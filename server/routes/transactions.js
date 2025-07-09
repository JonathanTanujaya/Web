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

// Get all transactions (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { type, category_id, start_date, end_date } = req.query;
        let query = 'SELECT t.*, c.name as category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (type) {
            query += ` AND t.type = $${paramIndex++}`;
            params.push(type);
        }
        if (category_id) {
            query += ` AND t.category_id = $${paramIndex++}`;
            params.push(category_id);
        }
        if (start_date) {
            query += ` AND t.transaction_date >= $${paramIndex++}`;
            params.push(start_date);
        }
        if (end_date) {
            query += ` AND t.transaction_date <= $${paramIndex++}`;
            params.push(end_date);
        }

        query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single transaction by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT t.*, c.name as category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new transaction
router.post('/', async (req, res) => {
    const { user_id, category_id, amount, type, description, transaction_date } = req.body;
    try {
        const newTransaction = await pool.query(
            'INSERT INTO transactions (user_id, category_id, amount, type, description, transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
            [user_id, category_id, amount, type, description, transaction_date]
        );
        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a transaction
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, category_id, amount, type, description, transaction_date } = req.body;
    try {
        const updatedTransaction = await pool.query(
            'UPDATE transactions SET user_id = $1, category_id = $2, amount = $3, type = $4, description = $5, transaction_date = $6 WHERE id = $7 RETURNING *;',
            [user_id, category_id, amount, type, description, transaction_date, id]
        );
        if (updatedTransaction.rows.length === 0) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.json(updatedTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTransaction = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *;', [id]);
        if (deletedTransaction.rows.length === 0) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.json({ msg: 'Transaction deleted', transaction: deletedTransaction.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
