import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
} from "lucide-react";
import { OrderCard } from "../components/OrderCard";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import type { OrderSummary } from "../types";
import { useOrders } from "../hooks/useOrders";

const statusTabs = [
  { id: "all", label: "All Orders", icon: Package },
  { id: "PENDING", label: "Pending", icon: Package },
  { id: "CONFIRMED", label: "Confirmed", icon: Package },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle },
  { id: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>("");
  const [debouncedDoctorSearch, setDebouncedDoctorSearch] =
    useState<string>("");
  const [dateRange, setDateRange] = useState<string>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const dateRangeOptions = [
    { value: "ALL", label: "All Time" },
    { value: "TODAY", label: "Today" },
    { value: "LAST_7_DAYS", label: "Last 7 Days" },
    { value: "LAST_MONTH", label: "Last Month" },
    { value: "LAST_YEAR", label: "Last Year" },
  ];

  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setDebouncedDoctorSearch(doctorSearchQuery);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, doctorSearchQuery]);

  const { data, isLoading, isError } = useOrders({
    page,
    limit,
    search: debouncedSearch || undefined,
    doctorName: debouncedDoctorSearch || undefined,
    status: activeTab !== "all" ? activeTab : undefined,
    dateRange: dateRange !== "ALL" ? dateRange : undefined,
  });

  const orders = data?.orders || [];
  const meta = data?.meta;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1); // Reset page on tab change
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleViewDetails = (order: OrderSummary) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full px-4 py-5 md:px-6 md:py-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor..."
              value={doctorSearchQuery}
              onChange={(e) => setDoctorSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
        <div className="flex gap-3 relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Filter className="h-4 w-4" />
            {dateRange === "ALL"
              ? "Filter"
              : dateRangeOptions.find((o) => o.value === dateRange)?.label}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDateRangeChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    dateRange === option.value
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          Failed to load orders. Please try again.
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 text-center p-6 mb-6">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mb-2">
            No orders found
          </h3>
          <p className="text-slate-500 text-sm max-w-sm">
            {searchQuery
              ? `No orders match your search "${searchQuery}"`
              : "There are no orders in this status yet"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * limit, meta.total)}
            </span>{" "}
            of <span className="font-medium">{meta.total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 px-4 py-2 bg-slate-50 rounded-lg">
              Page {page} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
