import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trash2, Tag } from 'lucide-react';

interface CartProduct {
  id: string;
  name: string;
  detail: string;
  size: string;
  price: number;
  image: string;
  qty: number;
}

const initialCart: CartProduct[] = [
  {
    id: 'p1',
    name: 'Phentermine',
    detail: 'Medium, Rare, Bone Marrow Butter',
    size: 'Intro',
    price: 48,
    image: '/images/a2224651025069a6bda773c9a4c36bb3ce2cc1d1.png',
    qty: 1,
  },
  {
    id: 'p2',
    name: 'Vitamin C Ascorbic Acid',
    detail: 'Medium, Rare, Bone Marrow Butter',
    size: '2lb',
    price: 48,
    image: '/images/a2224651025069a6bda773c9a4c36bb3ce2cc1d1.png',
    qty: 1,
  },
];

const SHIPPING = 20;
const SERVICE_FEES = 50;
const DISCOUNT = 15;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartProduct[]>(initialCart);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // ── Billing fields ──────────────────────────────────────────────
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  // ── Payment fields ──────────────────────────────────────────────
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const discount = couponApplied ? DISCOUNT : 0;
  const total = subtotal + SERVICE_FEES + SHIPPING - discount;

  const removeItem = (id: string) => setCart((prev) => prev.filter((p) => p.id !== id));

  const handleApplyCoupon = () => {
    if (coupon.trim()) setCouponApplied(true);
  };

  const handlePreviewAndSubmit = () => {
    // Navigate to preview details using the first assessment id as a demo
    navigate({ to: '/dashboard/assessment-table/$assessmentId/preview', params: { assessmentId: 'asmnt_1' } });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Checkout</h1>
      <p className="text-sm text-slate-500 mb-8">Review your order and complete your purchase</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── LEFT: Billing + Payment ── */}
        <div className="flex-1 space-y-6">
          {/* Billing Information */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 mb-5">Billing Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={billing.firstName}
                  onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={billing.lastName}
                  onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={billing.email}
                  onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={billing.phone}
                  onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  value={billing.address}
                  onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">City</label>
                <input
                  type="text"
                  placeholder="New York"
                  value={billing.city}
                  onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">State</label>
                <input
                  type="text"
                  placeholder="NY"
                  value={billing.state}
                  onChange={(e) => setBilling({ ...billing, state: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">ZIP Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  value={billing.zip}
                  onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 mb-5">Payment Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Card Number</label>
                <input
                  type="text"
                  placeholder="1234  5678  9012  3456"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setCard({ ...card, number: val });
                  }}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 tracking-widest"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength={7}
                  value={card.expiry}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const formatted = val.length > 2 ? `${val.slice(0, 2)} / ${val.slice(2, 4)}` : val;
                    setCard({ ...card, expiry: formatted });
                  }}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="lg:w-[380px] space-y-5">
          {/* Cart items */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 mb-5">Order Summary</h2>

            {cart.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#2A2D31] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">{item.detail}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#1447E6] text-white text-[10px] rounded-full font-medium">
                        {item.size}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-semibold text-[#1447E6]">${item.price * item.qty}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon */}
            <div className="mt-5 pt-5 border-t border-[#E5E7EB]">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={couponApplied}
                    className="w-full pl-8 pr-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !coupon.trim()}
                  className="px-4 py-2.5 bg-[#1447E6] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-green-600 mt-1.5 font-medium">✓ Coupon applied — ${DISCOUNT} off</p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="mt-5 pt-5 border-t border-[#E5E7EB] space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Duration</span>
                <span>1 month</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Fees</span>
                <span>${SERVICE_FEES.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping charge</span>
                <span>${SHIPPING.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>- ${DISCOUNT.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-800 border-t border-[#E5E7EB] pt-3 mt-1 text-base">
                <span>Total</span>
                <span className="text-[#1447E6]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Preview & Submit button */}
          <button
            onClick={handlePreviewAndSubmit}
            className="w-full py-3.5 bg-[#1447E6] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-colors shadow-sm"
          >
            Preview &amp; Submit
          </button>

          <button
            onClick={() => navigate({ to: '/dashboard/assessment-table' })}
            className="w-full py-3 border border-[#E5E7EB] text-slate-600 text-sm font-medium rounded-2xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
