import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, useTheme, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategories } from '../services/api';

interface Transaction {
  id: number;
  user_id: number; // Placeholder for now
  category_id: number;
  category_name: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  transaction_date: string;
}

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [errors, setErrors] = useState<Record<string, boolean>>({}); // State for validation errors
  const [loading, setLoading] = useState(false); // Loading state
  const theme = useTheme();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    setCurrentTransaction(transaction || null);
    setAmount(transaction ? transaction.amount.toString() : '');
    setType(transaction ? transaction.type : 'expense');
    setDescription(transaction ? transaction.description : '');
    setTransactionDate(transaction ? transaction.transaction_date : new Date().toISOString().split('T')[0]);
    setCategoryId(transaction ? transaction.category_id : '');
    setErrors({}); // Clear errors when opening dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTransaction(null);
    setAmount('');
    setType('expense');
    setDescription('');
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setCategoryId('');
    setErrors({}); // Clear errors when closing dialog
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = true;
    if (!description.trim()) newErrors.description = true;
    if (!categoryId) newErrors.categoryId = true;
    if (!transactionDate) newErrors.transactionDate = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    setLoading(true);
    try {
      const transactionData = {
        user_id: 1, // Hardcoded for now, will be dynamic with auth
        category_id: Number(categoryId),
        amount: parseFloat(amount),
        type,
        description,
        transaction_date: transactionDate,
      };

      if (currentTransaction) {
        await updateTransaction(currentTransaction.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="card-shadow" sx={{ p: 3, borderRadius: '16px', backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add New Transaction
        </Button>
      </Box>
      <Typography paragraph>
        List of all your income and expense transactions will appear here.
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        transactions.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>No transactions found.</Typography>
            <Typography>Click "Add New Transaction" to get started.</Typography>
          </Box>
        ) : (
          <List>
            {transactions.map((transaction) => (
              <ListItem
                key={transaction.id}
                className="hover-lift"
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  backgroundColor: theme.palette.background.default, // Use default background for list items
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemText
                  primary={`${transaction.description} - ${parseFloat(transaction.amount).toFixed(2)} (${transaction.type})`}
                  secondary={`${transaction.category_name} on ${transaction.transaction_date}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(transaction)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(transaction.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="standard"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            helperText={errors.amount ? 'Amount is required and must be greater than 0' : ''}
          />
          <FormControl fullWidth margin="dense" error={errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value as number)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && <Typography color="error" variant="caption">Category is required</Typography>}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            helperText={errors.description ? 'Description is required' : ''}
          />
          <TextField
            margin="dense"
            label="Transaction Date"
            type="date"
            fullWidth
            variant="standard"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            error={errors.transactionDate}
            helperText={errors.transactionDate ? 'Transaction date is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{currentTransaction ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;