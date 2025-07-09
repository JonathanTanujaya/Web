import React, { useState, useEffect } from 'react';

const PersonalFinanceApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [balance, setBalance] = useState(2450000);
  const [currentPage, setCurrentPage] = useState('home');

  // Sample data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'expense',
      description: 'Makan Siang',
      category: 'Makanan & Minuman',
      amount: 45000,
      icon: 'utensils',
      date: '2024-01-15'
    },
    {
      id: 2,
      type: 'income',
      description: 'Gaji Bulanan',
      category: 'Pekerjaan',
      amount: 3200000,
      icon: 'briefcase',
      date: '2024-01-01'
    },
    {
      id: 3,
      type: 'expense',
      description: 'Isi Bensin',
      category: 'Transportasi',
      amount: 50000,
      icon: 'gas-pump',
      date: '2024-01-14'
    },
    {
      id: 4,
      type: 'expense',
      description: 'Belanja Bulanan',
      category: 'Kebutuhan Rumah',
      amount: 250000,
      icon: 'shopping-cart',
      date: '2024-01-10'
    }
  ]);

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Liburan ke Bali',
      target: 5000000,
      current: 3000000,
      progress: 60
    },
    {
      id: 2,
      title: 'Dana Darurat',
      target: 10000000,
      current: 2500000,
      progress: 25
    }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Makanan & Minuman', type: 'expense' },
    { id: 2, name: 'Transportasi', type: 'expense' },
    { id: 3, name: 'Kebutuhan Rumah', type: 'expense' },
    { id: 4, name: 'Pekerjaan', type: 'income' },
    { id: 5, name: 'Investasi', type: 'income' }
  ]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get icon for transaction
  const getTransactionIcon = (iconName) => {
    const iconMap = {
      'utensils': '🍽️',
      'briefcase': '💼',
      'gas-pump': '⛽',
      'shopping-cart': '🛒',
      'home': '🏠',
      'car': '🚗',
      'heart': '❤️',
      'gamepad': '🎮'
    };
    return iconMap[iconName] || '💰';
  };

  // Add new transaction
  const addTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([newTransaction, ...transactions]);
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'transactions', label: 'Transaksi', icon: '💸' },
    { id: 'analytics', label: 'Analitik', icon: '📊' },
    { id: 'goals', label: 'Tujuan', icon: '🎯' },
    { id: 'profile', label: 'Profil', icon: '👤' }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Main Container */}
      <div className="max-w-md mx-auto bg-white dark:bg-gray-700 min-h-screen shadow-xl relative overflow-hidden">
        {/* Styles */}
        <style jsx>{`
          .dark {
            background-color: #374151;
            color: #f9fafb;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          }
          
          .card-shadow {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .dark .card-shadow {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
          }
          
          .hover-lift {
            transition: all 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .slide-up {
            animation: slideUp 0.5s ease-out;
          }
          
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .progress-bar {
            background: linear-gradient(90deg, #10b981, #d4af37);
            border-radius: 4px;
            transition: width 0.5s ease;
          }
          
          .floating-element {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        {/* Header */}
        <div className={`gradient-bg text-white p-6 relative overflow-hidden ${isDarkMode ? '' : ''}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 floating-element"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <div className="text-sm font-medium opacity-90">Selamat Pagi</div>
              <div className="text-2xl font-bold">Budi Santoso</div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="px-6 -mt-8 relative z-10">
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl p-6 card-shadow slide-up backdrop-blur-sm`}>
            <div className="text-sm text-gray-500 mb-2">Saldo Saat Ini</div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {formatCurrency(balance)}
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-500">
                  +{formatCurrency(totalIncome)}
                </div>
                <div className="text-xs text-gray-500">Pemasukan</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-500">
                  -{formatCurrency(totalExpense)}
                </div>
                <div className="text-xs text-gray-500">Pengeluaran</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentPage('add-transaction')}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-2xl card-shadow hover-lift text-center pulse-animation`}
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="text-sm font-medium">Tambah Transaksi</div>
            </button>
            <button
              onClick={() => setCurrentPage('categories')}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-2xl card-shadow hover-lift text-center`}
            >
              <div className="text-2xl mb-2">🏷️</div>
              <div className="text-sm font-medium">Kategori</div>
            </button>
          </div>

          {/* Chart Section */}
          <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pengeluaran Bulanan</h2>
              <button className="text-blue-600 text-sm font-medium">Lihat Detail</button>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl p-6 card-shadow`}>
              <div className="h-48 gradient-bg rounded-xl flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="font-medium">Grafik Pengeluaran Bulanan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tujuan Keuangan</h2>
              <button className="text-blue-600 text-sm font-medium">Tambah Tujuan</button>
            </div>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl p-6 card-shadow hover-lift`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-semibold">{goal.title}</div>
                    <div className="text-green-500 font-semibold">
                      {formatCurrency(goal.target)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="progress-bar h-2 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(goal.current)} dari {formatCurrency(goal.target)} ({goal.progress}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transaksi Terbaru</h2>
              <button className="text-blue-600 text-sm font-medium">Lihat Semua</button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 4).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 card-shadow hover-lift flex items-center`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-4 ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {getTransactionIcon(transaction.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.category}</div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} border-t border-gray-200 p-3 flex justify-around items-center`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                currentPage === item.id
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setCurrentPage('add-transaction')}
          className="fixed bottom-20 right-6 w-14 h-14 gradient-bg text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl z-50"
          style={{ transform: 'scale(1)' }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          ➕
        </button>
      </div>
    </div>
  );
};

export default PersonalFinanceApp;
