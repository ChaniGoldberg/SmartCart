import React, { useEffect, useState } from 'react';
import { Bell, X, Trash2, Plus } from 'lucide-react';
import { Notification } from '../../../shared/src/notification';
import { useUser } from '../store/redux/userContext';

export default function AlertsList() {
  const [activeTab, setActiveTab] = useState('All');
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [statusMessages, setStatusMessages] = useState<{ [id: number]: string }>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.userName) {
      fetchAllAlerts();
    }
  }, [user?.userName]);

  const fetchAllAlerts = async () => {
    try {
      const res = await fetch(`/api/notification/user/${user?.userName}`);
      if (!res.ok) throw new Error('Failed to fetch all alerts');
      const data = await res.json();
      setAlerts(data.data);
    } catch (err) {
      console.error('Error fetching all alerts', err);
    }
  };

  const toggleAlertStatus = async (id: number, isActive: boolean) => {
    try {
      const res = await fetch(`/api/notification/${id}/${isActive}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      setStatusMessages((prev) => ({
        ...prev,
        [id]: !isActive ? 'ההתראה הופעלה' : 'ההתראה נעצרה',
      }));
      fetchAllAlerts();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const deleteAlert = async (id: number) => {
    try {
      const res = await fetch(`/api/notification/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete alert');
      setConfirmDeleteId(null);
      fetchAllAlerts();
    } catch (err) {
      console.error('Error deleting alert:', err);
    }
  };

  const addAlerts = async () => {
    try {
      const res = await fetch(`/api/notification/`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to add alert');
      fetchAllAlerts();
    } catch (err) {
      console.error('Error adding alert:', err);
    }
  };

  const tabs = ['All', 'Active', 'Triggered', 'Paused'];

  const filteredAlerts = alerts.filter((alert) => {
    switch (activeTab) {
      case 'Active':
        return alert.isActive;
      case 'Triggered':
        return alert.hasBeenTriggered;
      case 'Paused':
        return !alert.isActive;
      default:
        return true;
    }
  });

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto relative">
      {/* Confirm Delete Modal */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">האם אתה בטוח שברצונך למחוק את ההתראה?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteAlert(confirmDeleteId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                כן, מחק
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-4 border-gradient-to-r from-teal-600 to-green-400 pb-2">
        <h1 className="text-4xl font-extrabold text-teal-700 flex items-center gap-2">
          <span className="text-3xl">🔔</span> My Alerts
        </h1>
        <button
          onClick={addAlerts}
          className="bg-gradient-to-r from-teal-600 to-green-400 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 shadow-md"
        >
          <Plus size={18} />
          Add Alert
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === tab
                ? 'bg-gradient-to-r from-teal-600 to-green-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-teal-500 hover:to-green-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-5">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.notificationId}
              className={`rounded-lg p-5 shadow-md border transition-all ${
                !alert.isActive
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : alert.hasBeenTriggered
                  ? 'border-green-400 bg-green-50 text-green-900'
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold">{alert.productCode}</h2>
                  {/* 🟢 מיני-כותרת חדשה עם שם המשתמש */}
                  <p className="text-md font-medium text-teal-800">
                    הי {user?.userName}, המבצע מחכה לך
                  </p>
                  <p className="text-sm text-gray-600">{alert.username}</p>
                  <p className="text-sm font-semibold">{alert.notificationType}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      toggleAlertStatus(alert.notificationId, alert.isActive)
                    }
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    {alert.isActive ? (
                      <X className="w-5 h-5 text-red-600" />
                    ) : (
                      <Bell className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(alert.notificationId)}
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Status message */}
              {statusMessages[alert.notificationId] && (
                <p className="text-sm text-gray-500 mt-1">
                  {statusMessages[alert.notificationId]}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 font-medium">No alerts found.</p>
        )}
      </div>
    </div>
  );
}