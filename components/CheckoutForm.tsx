'use client';

import { useState } from 'react';
import { initiateRazorpayPayment, createRazorpayOrder } from '@/lib/razorpay';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/contexts/CartContext';

interface CheckoutFormProps {
  total: number;
  subtotal: number;
  shipping: number;
  items: CartItem[];
  onOrderSuccess: (orderId: string, phone: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function CheckoutForm({
  total,
  subtotal,
  shipping,
  items,
  onOrderSuccess,
  isProcessing,
  setIsProcessing,
}: CheckoutFormProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Invalid email address. Please enter a valid email (e.g., name@example.com)';
      }
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode (6 digits required)';
    }

    // Always set errors, even if empty, to ensure state updates
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    // Debug: log errors for email field
    if (newErrors.email) {
      console.log('Email validation error:', newErrors.email, 'Email value:', formData.email);
    }
    
    // Scroll to first error field after state update
    if (!isValid) {
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey) {
          const errorElement = document.getElementById(firstErrorKey);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }
      }, 100);
    }
    
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing (only if error exists)
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      // Force re-render to show errors
      setErrors((prev) => ({ ...prev }));
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Store order data temporarily (will be saved after OTP verification)
      const orderData = {
        orderId,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shipping,
        total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };

      // Save order data to sessionStorage for later use
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_order', JSON.stringify(orderData));
      }

      // Save order to database if user is authenticated
      if (token) {
        try {
          // Decode token to log email (for debugging)
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Saving order for authenticated user:', payload.email, 'userId:', payload.userId);
          } catch (e) {
            console.log('Could not decode token for debugging');
          }

          const orderResponse = await fetch('/api/orders/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          });

          if (!orderResponse.ok) {
            const errorData = await orderResponse.json().catch(() => ({}));
            console.error('Error saving order:', errorData.error || 'Unknown error', orderResponse.status);
            // Order data is in sessionStorage, will be saved after OTP verification
          } else {
            const savedOrder = await orderResponse.json().catch(() => ({}));
            console.log('Order saved successfully:', orderId);
            console.log('Saved order details:', savedOrder.order?.orderId, 'for email:', savedOrder.order?.userEmail);
            // Remove from sessionStorage if saved successfully
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('pending_order');
            }
          }
        } catch (error) {
          console.error('Error saving order:', error);
          // Order data is in sessionStorage, will be saved after OTP verification
        }
      } else {
        console.log('User not authenticated, order data stored in sessionStorage');
      }

      if (formData.paymentMethod === 'razorpay') {
        try {
          // Create Razorpay order
          const razorpayOrderId = await createRazorpayOrder(total * 100, {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          });

          // Initiate Razorpay payment
          await initiateRazorpayPayment({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            amount: total * 100, // Convert to paise
            currency: 'INR',
            name: 'The Button',
            description: `Order ${orderId}`,
            order_id: razorpayOrderId,
            handler: (response) => {
              // Payment successful
              console.log('Payment successful:', response);
              onOrderSuccess(orderId, formData.phone);
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#000000',
            },
          });
        } catch (error) {
          console.error('Payment error:', error);
          alert('Payment failed. Please try again or use Cash on Delivery.');
          setIsProcessing(false);
        }
      } else {
        // COD - redirect to OTP verification
        onOrderSuccess(orderId, formData.phone);
      }
    } catch (error) {
      console.error('Order processing error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.firstName 
                ? 'border-red-500 text-red-700' 
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.lastName 
                ? 'border-red-500 text-red-700' 
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
            errors.email 
              ? 'border-red-500 text-red-700' 
              : 'border-gray-300 text-gray-900'
          }`}
          placeholder="john@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-sm font-medium text-red-600" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
            errors.phone 
              ? 'border-red-500 text-red-700' 
              : 'border-gray-300 text-gray-900'
          }`}
          placeholder="9876543210"
          maxLength={10}
        />
        {errors.phone && (
          <p className="mt-1 text-sm font-medium text-red-600">{errors.phone}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">10-digit mobile number</p>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
            errors.address 
              ? 'border-red-500 text-red-700' 
              : 'border-gray-300 text-gray-900'
          }`}
          placeholder="House/Flat No., Building Name, Street"
        />
        {errors.address && (
          <p className="mt-1 text-sm font-medium text-red-600">{errors.address}</p>
        )}
      </div>

      {/* City, State, Pincode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.city 
                ? 'border-red-500 text-red-700' 
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Mumbai"
          />
          {errors.city && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.state 
                ? 'border-red-500 text-red-700' 
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Maharashtra"
          />
          {errors.state && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.state}</p>
          )}
        </div>

        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.pincode 
                ? 'border-red-500 text-red-700' 
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="400001"
            maxLength={6}
          />
          {errors.pincode && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={formData.paymentMethod === 'razorpay'}
              onChange={handleInputChange}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900">Online Payment (Razorpay)</span>
              <p className="text-sm text-gray-600">Pay securely with credit/debit card, UPI, or wallet</p>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleInputChange}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
              <p className="text-sm text-gray-600">Pay when you receive your order</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
          isProcessing
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
        }`}
      >
        {isProcessing
          ? 'Processing...'
          : formData.paymentMethod === 'cod'
          ? `Place Order (Pay ₹${total.toLocaleString('en-IN')} on Delivery)`
          : `Pay ₹${total.toLocaleString('en-IN')}`}
      </button>
    </form>
  );
}

