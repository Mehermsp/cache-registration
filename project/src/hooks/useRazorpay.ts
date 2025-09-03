import { useState, useCallback } from 'react';
import { Registration } from '../types/Event';

interface UseRazorpayProps {
  onSuccess: (paymentData: any) => void;
  onError?: (error: any) => void;
}

export const useRazorpay = ({ onSuccess, onError }: UseRazorpayProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = useCallback(() => {
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
  }, []);

  const initiatePayment = useCallback(async (registration: Registration) => {
    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order (this would typically call your backend)
      const orderData = {
        amount: registration.totalAmount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const options = {
        key: 'rzp_test_1234567890', // Replace with your actual key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TechFest 2025',
        description: 'Event Registration Payment',
        image: '/vite.svg',
        order_id: `order_${Date.now()}`,
        handler: function (response: any) {
          setIsLoading(false);
          onSuccess(response);
        },
        prefill: {
          name: registration.participantName,
          email: registration.email,
          contact: registration.phone,
        },
        notes: {
          event_id: registration.eventId,
          participant_name: registration.participantName,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      setIsLoading(false);
      if (onError) {
        onError(error);
      } else {
        console.error('Payment error:', error);
        alert('Payment initialization failed. Please try again.');
      }
    }
  }, [loadRazorpayScript, onSuccess, onError]);

  return {
    initiatePayment,
    isLoading
  };
};