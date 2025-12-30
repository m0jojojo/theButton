'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const phone = searchParams.get('phone');
  const maskedPhone = phone ? `${phone.slice(0, 2)}****${phone.slice(-2)}` : '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [storedOtp, setStoredOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate and store OTP on mount
  useEffect(() => {
    if (!orderId || !phone) {
      router.push('/checkout');
      return;
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setStoredOtp(generatedOtp);
    
    // Store in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('otp_verification', JSON.stringify({
        orderId,
        phone,
        otp: generatedOtp,
        timestamp: Date.now(),
      }));
    }

    // In production, send OTP via SMS/Email API
    console.log('OTP generated:', generatedOtp); // Remove in production
    
    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId, phone, router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      // Focus last input
      inputRefs.current[5]?.focus();
      // Auto-verify
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify OTP
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('otp_verification');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.otp === otpToVerify && data.orderId === orderId) {
          // OTP verified - redirect to success page
          sessionStorage.removeItem('otp_verification');
          router.replace(`/order-success?orderId=${orderId}`);
          return;
        }
      }
    }

    // Fallback: verify against stored OTP
    if (otpToVerify === storedOtp) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('otp_verification');
      }
      router.replace(`/order-success?orderId=${orderId}`);
      return;
    }

    // Invalid OTP
    setError('Invalid OTP. Please try again.');
    setIsVerifying(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setStoredOtp(newOtp);
    
    if (typeof window !== 'undefined' && orderId && phone) {
      sessionStorage.setItem('otp_verification', JSON.stringify({
        orderId,
        phone,
        otp: newOtp,
        timestamp: Date.now(),
      }));
    }

    // In production, send OTP via SMS/Email API
    console.log('New OTP generated:', newOtp); // Remove in production

    setOtp(['', '', '', '', '', '']);
    setError('');
    setCanResend(false);
    setTimer(60);
    inputRefs.current[0]?.focus();
  };

  if (!orderId || !phone) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Verify Your Order
          </h1>
          <p className="text-gray-600">
            We&apos;ve sent a 6-digit OTP to <span className="font-medium text-gray-900">{maskedPhone}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter OTP
          </label>
          
          <div className="flex justify-center gap-2 md:gap-3 mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors ${
                  error
                    ? 'border-red-500 text-red-700'
                    : digit
                    ? 'border-gray-900 text-gray-900'
                    : 'border-gray-300 text-gray-400'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600 text-center mb-4" role="alert">
              {error}
            </p>
          )}

          {isVerifying && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <p className="text-sm text-gray-600 mt-2">Verifying...</p>
            </div>
          )}
        </div>

        {/* Resend OTP */}
        <div className="text-center mb-6">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-gray-900 font-medium hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Didn&apos;t receive OTP? Resend in{' '}
              <span className="font-medium text-gray-900">{timer}s</span>
            </p>
          )}
        </div>

        {/* Manual Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || otp.join('').length !== 6}
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Back to Checkout */}
        <div className="text-center">
          <Link
            href="/checkout"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Change phone number
          </Link>
        </div>

        {/* Development Note */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Development Mode:</strong> Check browser console for OTP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}

