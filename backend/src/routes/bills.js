import express from 'express';
import prisma from '../prisma/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function generateBillNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BILL-${timestamp}-${random}`;
}

router.post('/orders/:orderId/bill', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { bill: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Can only generate bill for completed orders.' });
    }

    if (order.bill) {
      return res.status(400).json({ error: 'Bill already generated.', bill: order.bill });
    }

    const bill = await prisma.bill.create({
      data: {
        orderId,
        billNumber: generateBillNumber(),
        totalAmount: order.totalAmount
      }
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error('Error generating bill:', error);
    res.status(500).json({ error: 'Failed to generate bill.' });
  }
});

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { generatedAt: 'desc' },
      include: { order: true }
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bills.' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        order: {
          include: {
            items: { include: { menuItem: true } }
          }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found.' });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bill.' });
  }
});

export default router;