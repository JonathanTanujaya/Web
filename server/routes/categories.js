const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new category
router.post('/', async (req, res) => {
    const { name, type } = req.body;
    try {
        const newCategory = await pool.query(
            'INSERT INTO categories (name, type) VALUES ($1, $2) RETURNING *;',
            [name, type]
        );
        res.json(newCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    try {
        const updatedCategory = await pool.query(
            'UPDATE categories SET name = $1, type = $2 WHERE id = $3 RETURNING *;',
            [name, type, id]
        );
        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json(updatedCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *;', [id]);
        if (deletedCategory.rows.length === 0) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json({ msg: 'Category deleted', category: deletedCategory.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
