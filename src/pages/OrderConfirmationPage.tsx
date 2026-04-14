import { useEffect, useState } from 'react';
import { supabase, Order } from '../lib/supabase';
import { CheckCircle, Home } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  onBackToMenu: () => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onBackToMenu }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">Order not found</div>
      </div>
    );
  }

  const gst = order.total_amount * 0.05;
  const totalWithGst = order.total_amount + gst;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Your order has been placed successfully</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono text-sm font-semibold">{order.id?.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Table Number</p>
                <p className="font-semibold text-lg">#{order.table_number}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Details</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{totalWithGst.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Your order is being prepared. Our staff will serve it to your table shortly.
            </p>
          </div>

          <button
            onClick={onBackToMenu}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
          >
            <Home size={20} />
            Back to Menu
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Thank you for dining with us!</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
