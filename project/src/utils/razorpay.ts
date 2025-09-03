// Razorpay configuration and utility functions

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const RAZORPAY_CONFIG = {
  // Replace with your actual Razorpay key
  key: 'rzp_test_1234567890',
  currency: 'INR',
  name: 'Cache2K25',
  theme_color: '#3B82F6',
};

export const createRazorpayOrder = async (amount: number, receipt: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, receipt }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData: RazorpayResponse) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      throw new Error('Payment verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const saveRegistration = async (registrationData: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save registration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving registration:', error);
    throw error;
  }
};