import React, { useState, useEffect, useRef } from 'react';
import { notificationsAPI } from '../services/api';
import { Notification } from '../types';
import { FiBell, FiMail, FiZap, FiCheckCircle, FiInfo } from 'react-icons/fi';

const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const response = await notificationsAPI.getAll();
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unread_count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await notificationsAPI.markRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleMarkOneRead = async (id: number) => {
        try {
            await notificationsAPI.markRead(id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'service_request': return <FiZap className="text-primary-400" />;
            case 'payment': return <FiCheckCircle className="text-emerald-400" />;
            case 'system': return <FiInfo className="text-blue-400" />;
            default: return <FiMail className="text-gray-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
            >
                <FiBell className={`text-xl ${unreadCount > 0 ? 'text-primary-400' : 'text-gray-400'} group-hover:scale-110 transition-transform`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-[#030712] animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 glass-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <FiBell className="text-3xl text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-white/[0.04] transition-all group ${!notification.is_read ? 'bg-primary-500/[0.02]' : ''}`}
                                        onClick={() => !notification.is_read && handleMarkOneRead(notification.id)}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0 ${!notification.is_read ? 'bg-primary-500/10' : 'bg-white/5'}`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h4 className={`text-sm font-bold truncate ${!notification.is_read ? 'text-white' : 'text-gray-400'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-500 flex-shrink-0 whitespace-nowrap">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className={`text-xs leading-relaxed ${!notification.is_read ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                Showing your last 50 alerts
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
