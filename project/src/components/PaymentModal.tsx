import React, { useState } from 'react';
import { Registration } from '../types/Event';
import { X, Smartphone, QrCode, Shield, Lock } from 'lucide-react';
import { createRazorpayOrder, verifyPayment, saveRegistration } from '../utils/razorpay';

interface PaymentModalProps {
  registration: Registration;
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ registration, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'qr'>('upi');
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Create order
      const orderData = await createRazorpayOrder(
        registration.totalAmount,
        `receipt_${Date.now()}`
      );

      const options = {
        key: 'rzp_test_1234567890', // Replace with your actual Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Cache2K25',
        description: 'Event Registration Payment',
        image: '/vite.svg',
        order_id: orderData.id,
        method: {
          upi: selectedMethod === 'upi',
          qr: selectedMethod === 'qr',
          card: false,
          netbanking: false,
          wallet: false
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(response);
            
            if (verificationResult.success) {
              // Save registration to Excel
              const registrationWithPayment = {
                ...registration,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentMethod: selectedMethod,
                eventName: getEventName(registration.eventId)
              };
              
              await saveRegistration(registrationWithPayment);
              setIsProcessing(false);
              onSuccess();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment processing error:', error);
            alert('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: registration.participantName,
          email: registration.email,
          contact: registration.phone,
        },
        notes: {
          event_id: registration.eventId,
          participant_name: registration.participantName,
          event_name: getEventName(registration.eventId)
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
    }
  };

  const getEventName = (eventId: string) => {
    const eventNames: Record<string, string> = {
      'web-dev': 'Web Development Challenge',
      'poster-presentation': 'Poster Presentation',
      'techexpo': 'Tech Expo',
      'pycharm': 'PyCharm Programming Contest',
      'technical-quiz': 'Technical Quiz',
      'photo-contest': 'Photography Contest',
      'tech-meme-contest': 'Tech Meme Contest',
      'bgmi-esports': 'BGMI Esports Tournament',
      'freefire-esports': 'Free Fire Esports Championship'
    };
    return eventNames[eventId] || 'Unknown Event';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold">Secure Payment</h2>
          </div>
          <p className="text-blue-100 text-sm mt-2">Powered by Razorpay</p>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Event: <span className="font-medium">{getEventName(registration.eventId)}</span></div>
              <div>Participant: <span className="font-medium">{registration.participantName}</span></div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-green-600">₹{registration.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Choose Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedMethod === 'upi'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">UPI</div>
                  <div className="text-xs text-gray-500">GPay, PhonePe, Paytm</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedMethod('qr')}
                className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedMethod === 'qr'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">QR Code</div>
                  <div className="text-xs text-gray-500">Scan & Pay</div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-2">
              <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 text-sm">
                  {selectedMethod === 'upi' ? 'UPI Payment' : 'QR Code Payment'}
                </h4>
                <p className="text-blue-700 text-sm">
                  {selectedMethod === 'upi' 
                    ? 'Pay directly using your UPI ID or UPI apps like Google Pay, PhonePe, Paytm'
                    : 'Scan the QR code with any UPI app to complete your payment instantly'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-6">
            <div className="flex items-center text-green-800 text-sm">
              <Lock className="w-4 h-4 mr-2" />
              <span>256-bit SSL encryption • PCI DSS compliant • Bank-grade security</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                {selectedMethod === 'upi' ? <Smartphone className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                <span>Pay ₹{registration.totalAmount} via {selectedMethod.toUpperCase()}</span>
              </div>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">
              By clicking "Pay", you agree to our Terms of Service and Privacy Policy
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span>Powered by</span>
              <span className="font-semibold text-blue-600">Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;