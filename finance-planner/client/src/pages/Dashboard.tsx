import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTransactions, getCategories } from '../services/api';

interface Transaction {
  id: number;
  user_id: number;
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

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Aggregate expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = categories.find(cat => cat.id === transaction.category_id);
      const categoryName = category ? category.name : 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.keys(expensesByCategory).map(categoryName => ({
    name: categoryName,
    expenses: expensesByCategory[categoryName],
  }));

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box className="card-shadow" sx={{ p: 3, borderRadius: '16px', backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography paragraph>
        Here you will see a summary of your finances, including charts and key metrics.
      </Typography>

      {transactions.length === 0 ? (
        <Box sx={{ mt: 4, p: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
          <Typography variant="h6" gutterBottom>No financial data available.</Typography>
          <Typography>Add some transactions to see your financial summary and charts.</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mt: 4, p: 3, border: '1px dashed grey', minHeight: 200 }}>
            <Typography variant="h6">Financial Summary</Typography>
            <Typography>Total Income: {formatCurrency(totalIncome)}</Typography>
            <Typography>Total Expenses: {formatCurrency(totalExpense)}</Typography>
            <Typography>Net Balance: {formatCurrency(netBalance)}</Typography>
          </Box>

          <Box sx={{ mt: 4, p: 3, borderRadius: '16px', backgroundColor: theme.palette.background.default }}>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="expenses" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
