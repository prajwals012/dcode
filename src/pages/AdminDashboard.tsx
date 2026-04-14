import { useEffect, useState } from 'react';
import { supabase, Order } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Clock, CheckCircle, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    subscribeToOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToOrders = () => {
    const subscription = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev]);
          calculateStats([newOrder, ...orders]);
          showNotification(`New order from Table #${newOrder.table_number}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrders((prev) =>
            prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const showNotification = (message: string) => {
    setNotification(message);
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCp6w/DVgj0KFGCx5uymWRMLP5zb8sFuJAUrdsfx2IY8CRdmuOvvoVYTC0Cf3/K+bSMELHrC8NSAOwkWYrPl76tXFA0+mtryxHInBSl2yPDYijkIGGS36+CfUxILPZzi8r9vIwQpeMPx1oE8CRdksOXurVgUDTua2/LFcScFK3fI8diKOQgZY7nt4Z9SFww8muLywG4jBCh4w/HWgDsJF2Ow5u+tVxQNOZrc8sVxJwUrdsjx2Ik5CBhkuevgnVIXDDua4vK/bSMEKHjD8daBPAkXY6/m761XFAU6m9rywXAnBSl3yO/YiTkIGGS56+CdUhYMOZrc8sJtIgQoeMPx1oE8CRdksOXurVgUDTua2/LFcScFK3fJ8diIOQgYZLnr4J1SFgw5meLywm0iBCh4w/HWgDsJF2Sw5e+tVxQNO5vb8sFwJgUqd8jw2Ik5CBhkuevgnVIWDDmZ4vK+bSMEKHjD8daBOwkXZLDl761XFA08mtyyxHEmBCh3yPDYiTkIGGS46+CdUhYMOZni8r5tIwQpeMPx1oE7CRdksOXvrVcUDTua2/LFcScEK3fI8diJOQgYZLnr4J1SFgw5meLyvm0jBCl4w/HWgTsJF2Sw5e+tVxQNO5rb8sVxJwUrd8jx2Ik5CBhkuevgnVIWDDmZ4vK+bSMEKXjD8daBOwkXZLDl761XFA07mtvyxXEnBSt3yPHYiTkIGGS56+CdUhYMOZni8r5tIwQpeMPx1oE7CRdksOXvrVcUDTua2/LFcScFK3fI8diJOQgYZLnr4J1SFgw5meLyvm0jBCl4w/HWgTsJF2Sw5e+tVxQNO5rb8sVxJwUrd8jx2Ik5CBhkuevgnVIWDDmZ4vK+bSMEKXjD8daBOwkXZLDl761XFA07mtvyxXEnBSt3yPHYiTkIGGS56+CdUhYMOZni8r5tIwQpeMPx1oE7CRdksOXvrVcUDTua2/LFcScFK3fI8diJOQgYZLnr4J1SFgw5meLyvm0jBCl4w/HWgTsJF2Sw5e+tVxQNO5rb8sVxJwUrd8jx2Ik5CBhkuevgnVIWDDmZ4vK+bSMEKXjD8daBOwkXZLDl761XFA07mtvyxXEnBSt3yPHYiTkIGGS56+CdUhYMOZni8r5tIwQpeMPx1oE7CRdksOXvrVcUDTua2/LFcScFK3fI8diJOQgYZLnr4J1SFgw5meLyvm0jBCl4w/HWgTsJF2Sw5e+tVxQNO5rb8sVxJwUrd8jx2Ik5CBhkuevgnVIWDDmZ4vK+bSMEKXjD8daBOwkXZLDl761XFA07mtvyxXEnBSt3yPHYiTkIGGS56+CdUhYMOZni8r5tIwQpeMPx1oE7CRdksOXvrVcUDTua2/LFcScFK3fI8diJOA==');
    audio.play().catch(() => {});
    setTimeout(() => setNotification(null), 5000);
  };

  const calculateStats = (ordersData: Order[]) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const pendingOrders = ordersData.filter((o) => o.status === 'pending' || o.status === 'preparing').length;
    const completedOrders = ordersData.filter((o) => o.status === 'served').length;

    setStats({ totalOrders, totalRevenue, pendingOrders, completedOrders });
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'served': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryData = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      const existing = acc.find((a) => a.name === item.name);
      if (existing) {
        existing.value += item.quantity;
      } else {
        acc.push({ name: item.name, value: item.quantity });
      }
    });
    return acc;
  }, [] as { name: string; value: number }[]).slice(0, 5);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <Bell size={20} />
          {notification}
        </div>
      )}

      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Real-time order management & analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <ShoppingBag size={40} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign size={40} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <Clock size={40} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <CheckCircle size={40} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Top 5 Popular Items</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-10">No data available</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Daily Orders</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: 'Today', orders: stats.totalOrders, revenue: stats.totalRevenue / 100 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#4ECDC4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Table</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono">{order.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm font-semibold">#{order.table_number}</td>
                    <td className="px-4 py-3 text-sm">{order.items.length} items</td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.created_at ? new Date(order.created_at).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id!, e.target.value as Order['status'])}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="served">Served</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
