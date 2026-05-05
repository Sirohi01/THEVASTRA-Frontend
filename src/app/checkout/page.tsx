"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRazorpay } from "@/hooks/useRazorpay";
import API from "@/services/api";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode is required"),
  paymentMethod: z.enum(["COD", "Razorpay"]),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { openPaymentModal } = useRazorpay();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "Razorpay"
    }
  });

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const { data } = await API.post("/coupon/validate", {
        code: couponCode,
        orderAmount: getTotal()
      });
      setDiscount(data.discount);
      toast.success("Coupon applied successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setDiscount(0);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const onSubmit = async (data: CheckoutData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const subtotal = getTotal();
      const finalAmount = subtotal - discount;
      const tax = finalAmount * 0.18;
      const shipping = finalAmount > 5000 ? 0 : 100;
      const total = finalAmount + tax + shipping;

      // 1. Create Order in Backend
      const orderData = {
        orderItems: items.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          variant: item.variant
        })),
        shippingAddress: data,
        paymentMethod: data.paymentMethod,
        itemsPrice: subtotal,
        discountPrice: discount,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };

      const { data: orderRes } = await API.post("/order", orderData);
      const orderId = orderRes.order._id;

      if (data.paymentMethod === "Razorpay") {
        // 2. Create Razorpay Order
        const { data: rzpRes } = await API.post("/payment/create-order", {
          amount: orderData.totalPrice
        });

        // 3. Open Razorpay Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RTd9y3ngRanKxq",
          amount: rzpRes.order.amount,
          currency: "INR",
          name: "TheVastraHouse",
          description: "Luxury Ethnic Wear Purchase",
          order_id: rzpRes.order.id,
          handler: async (response: any) => {
            try {
              await API.post("/payment/verify", {
                ...response,
                orderId
              });
              toast.success("Payment Successful!");
              clearCart();
              router.push(`/order-success/${orderId}`);
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: data.fullName,
            contact: data.phone,
            email: user?.email
          },
          theme: { color: "#540B0E" }
        };
        openPaymentModal(options);
      } else {
        // Cash on Delivery flow
        toast.success("Order placed successfully (COD)");
        clearCart();
        router.push(`/order-success/${orderId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream/30">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <div className="bg-white p-8 border border-accent">
            <h2 className="text-2xl font-serif text-primary mb-8 uppercase tracking-widest">Shipping Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Full Name</label>
                  <input {...register("fullName")} className="w-full border border-accent p-3 focus:outline-none focus:border-primary transition-colors" />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Phone Number</label>
                  <input {...register("phone")} className="w-full border border-accent p-3 focus:outline-none focus:border-primary transition-colors" />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Address</label>
                <input {...register("addressLine1")} className="w-full border border-accent p-3 focus:outline-none focus:border-primary transition-colors" />
                {errors.addressLine1 && <p className="text-xs text-red-600 mt-1">{errors.addressLine1.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">City</label>
                  <input {...register("city")} className="w-full border border-accent p-3 focus:outline-none focus:border-primary transition-colors" />
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">State</label>
                  <input {...register("state")} className="w-full border border-accent p-3 focus:outline-none focus:border-primary transition-colors" />
                  {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Pincode</label>
                  <input {...register("pincode")} className="w-full border border-accent p-3 focus:outline-none focus:border-primary transition-colors" />
                  {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              <div className="pt-6 border-t border-accent">
                <h3 className="text-sm uppercase tracking-widest text-primary mb-4 font-medium">Payment Method</h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="Razorpay" {...register("paymentMethod")} className="accent-primary" />
                    <span className="text-xs uppercase tracking-widest">Pay Online (Razorpay)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="COD" {...register("paymentMethod")} className="accent-primary" />
                    <span className="text-xs uppercase tracking-widest">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <Button isLoading={isProcessing} className="w-full mt-8" size="lg">Place Order</Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-cream p-8 border border-accent self-start">
            <h2 className="text-2xl font-serif text-primary mb-8 uppercase tracking-widest">Order Summary</h2>

            {/* Coupon Input */}
            <div className="mb-8 pb-8 border-b border-accent/30">
              <label className="text-[10px] uppercase tracking-widest text-secondary block mb-2">Discount Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 bg-white border border-accent p-2 text-xs uppercase tracking-widest focus:outline-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  isLoading={isValidatingCoupon}
                >
                  Apply
                </Button>
              </div>
              {discount > 0 && (
                <p className="text-[10px] text-green-700 mt-2 uppercase tracking-widest font-bold">
                  ✓ Coupon Applied: -₹{discount.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-secondary">{item.name} x {item.quantity}</span>
                  <span className="font-medium text-primary">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-6 border-t border-accent/30 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span className="uppercase tracking-widest text-[10px] font-bold">Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-secondary">GST (18%)</span>
                <span>₹{((getTotal() - discount) * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span>{(getTotal() - discount) > 5000 ? "FREE" : "₹100"}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-accent text-lg font-serif text-primary">
                <span>Total Amount</span>
                <span>₹{((getTotal() - discount) + ((getTotal() - discount) * 0.18) + ((getTotal() - discount) > 5000 ? 0 : 100)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
