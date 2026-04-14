import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import QRCodeGenerator from './pages/QRCodeGenerator';

type Page = 'menu' | 'cart' | 'order-confirmation' | 'admin' | 'qr-generator' | 'landing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const adminParam = params.get('admin');
    const qrParam = params.get('qr');

    if (adminParam === 'true') {
      setCurrentPage('admin');
    } else if (qrParam === 'true') {
      setCurrentPage('qr-generator');
    } else if (table) {
      setTableNumber(table);
      setCurrentPage('menu');
    }
  }, []);

  const handleViewCart = () => {
    setCurrentPage('cart');
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  const handleOrderPlaced = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentPage('order-confirmation');
  };

  const handleTableSubmit = (table: string) => {
    setTableNumber(table);
    setCurrentPage('menu');
  };

  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  if (currentPage === 'qr-generator') {
    return <QRCodeGenerator />;
  }

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Restaurant Menu</h1>
            <p className="text-gray-600">Welcome! Please enter your table number to get started</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem('table') as HTMLInputElement;
              if (input.value) {
                handleTableSubmit(input.value);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Table Number
              </label>
              <input
                type="text"
                name="table"
                placeholder="Enter table number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition"
            >
              View Menu
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="?admin=true"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition text-sm font-semibold"
              >
                Admin Dashboard
              </a>
              <a
                href="?qr=true"
                className="bg-green-500 text-white py-2 px-4 rounded-lg text-center hover:bg-green-600 transition text-sm font-semibold"
              >
                Generate QR Codes
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      {currentPage === 'menu' && (
        <MenuPage tableNumber={tableNumber} onViewCart={handleViewCart} />
      )}
      {currentPage === 'cart' && (
        <CartPage
          tableNumber={tableNumber}
          onBack={handleBackToMenu}
          onOrderPlaced={handleOrderPlaced}
        />
      )}
      {currentPage === 'order-confirmation' && (
        <OrderConfirmationPage orderId={orderId} onBackToMenu={handleBackToMenu} />
      )}
    </CartProvider>
  );
}

export default App;
