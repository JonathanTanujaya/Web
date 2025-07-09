import { Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, useTheme, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [errors, setErrors] = useState<Record<string, boolean>>({}); // State for validation errors
  const [loading, setLoading] = useState(false); // Loading state
  const theme = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleOpenDialog = (category?: Category) => {
    setCurrentCategory(category || null);
    setName(category ? category.name : '');
    setType(category ? category.type : 'expense');
    setErrors({}); // Clear errors when opening dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
    setName('');
    setType('expense');
    setErrors({}); // Clear errors when closing dialog
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!name.trim()) newErrors.name = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    setLoading(true);
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, { name, type });
      } else {
        await createCategory({ name, type });
      }
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="card-shadow" sx={{ p: 3, borderRadius: '16px', backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Categories
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add New Category
        </Button>
      </Box>
      <Typography paragraph>
        Manage your income and expense categories here.
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        categories.length === 0 ? (
          <Box sx={{ mt: 4, p: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
            <Typography variant="h6" gutterBottom>No categories found.</Typography>
            <Typography>Click "Add New Category" to get started.</Typography>
          </Box>
        ) : (
          <List>
            {categories.map((category) => (
              <ListItem
                key={category.id}
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
                <ListItemText primary={`${category.name} (${category.type})`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            helperText={errors.name ? 'Category Name is required' : ''}
          />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{currentCategory ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;