import express from 'express';
import prisma from '../prisma/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

router.post('/', async (req, res) => {
  try {
    const { customerName, customerContact, customerAddress, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ error: `Item ${item.menuItemId} is not available.` });
      }

      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        subtotal
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerContact,
        customerAddress,
        totalAmount,
        status: 'pending',
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: { menuItem: true }
        }
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, date } = req.query;
    const where = {};

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    if (status) {
      where.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { menuItem: true } },
        bill: true
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: { include: { menuItem: true } },
        bill: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;