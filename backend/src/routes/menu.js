import express from 'express';
import prisma from '../prisma/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu.' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      select: { category: true },
      distinct: ['category']
    });
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
});

export default router;