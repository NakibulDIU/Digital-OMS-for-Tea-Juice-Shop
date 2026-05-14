import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|gif|webp/;
    const extname = allowedExts.test(path.extname(file.originalname).toLowerCase().slice(1));
    const mimetype = /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    const err = new Error('Only image files are allowed!');
    req.fileValidationError = err;
    cb(null, false);
  }
});

router.use(authenticateToken, requireAdmin);

router.get('/menu', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu.' });
  }
});

router.post('/menu', upload.single('image'), async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    console.log('POST /menu - req.body:', req.body);
    console.log('POST /menu - req.file:', req.file);
    const { name, nameBn, description, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const item = await prisma.menuItem.create({
      data: { name, nameBn, description, price: parseFloat(price), imageUrl, category: category || 'tea' }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

router.put('/menu/:id', upload.single('image'), async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    const { name, nameBn, description, price, category, isAvailable } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.existingImageUrl;

    console.log('PUT /menu/:id - req.body:', req.body);
    console.log('PUT /menu/:id - req.file:', req.file);

    const item = await prisma.menuItem.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        name, 
        nameBn, 
        description, 
        price: parseFloat(price), 
        imageUrl, 
        category, 
        isAvailable: isAvailable === 'true' || isAvailable === true
      }
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    await prisma.menuItem.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Menu item deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: today, lt: tomorrow } }
    });

    const totalRevenue = todayOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const statusCounts = {};
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    for (const status of statuses) {
      statusCounts[status] = await prisma.order.count({ where: { status } });
    }

    res.json({
      todayOrders: todayOrders.length,
      totalRevenue,
      statusCounts,
      pendingCount: statusCounts.pending
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

export default router;