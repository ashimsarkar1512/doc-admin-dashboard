import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { 
  useGetNotifications, 
  useMarkAllNotificationsAsRead, 
  useMarkNotificationAsRead 
} from "@/features/notifications/hooks/useNotifications";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRouteForAction = (actionType: string, _referenceId: string) => {
    switch (actionType) {
      case "PAYMENT_SUCCESS":
        return `/dashboard/payments`;
      case "ASSESSMENT_SUBMITTED":
      case "ASSESSMENT_ASSIGNED":
      case "ASSESSMENT_STATUS_UPDATED":
        return `/dashboard/assessment-table`;
      case "PROPOSAL_ACCEPTED":
      case "PROPOSAL_REJECTED":
        return `/dashboard/assessments`; 
      case "ORDER_STATUS_UPDATED":
        return `/dashboard/orders`;
      case "SUBSCRIPTION_CANCELLED":
        return `/dashboard/patients`;
      default:
        return `/dashboard`;
    }
  };

  const handleNotificationClick = (id: string, isRead: boolean, actionType: string, referenceId: string) => {
    if (!isRead) {
      markAsRead(id);
    }
    setIsOpen(false);
    const route = getRouteForAction(actionType, referenceId);
    navigate({ to: route });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">You have {unreadCount} unread messages</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                disabled={isMarkingAll}
                className="text-xs font-medium text-[#1447E6] hover:text-blue-800 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isMarkingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-500">
                <Bell className="mx-auto mb-2 opacity-20" size={32} />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.isRead,
                        notification.actionType,
                        notification.referenceId
                      )
                    }
                    className={`text-left p-3 rounded-xl transition-all duration-200 flex flex-col gap-1 ${
                      notification.isRead 
                        ? 'bg-transparent hover:bg-slate-50 opacity-75' 
                        : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-sm font-semibold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#1447E6] shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
