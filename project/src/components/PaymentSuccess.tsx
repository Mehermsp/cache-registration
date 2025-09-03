import React from 'react';
import { CheckCircle, Download, Share2, Calendar } from 'lucide-react';

interface PaymentSuccessProps {
  transactionId: string;
  amount: number;
  eventName: string;
  participantName: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  transactionId,
  amount,
  eventName,
  participantName
}) => {
  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      transactionId,
      amount,
      eventName,
      participantName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${transactionId}.json`;
    link.click();
  };

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TechFest 2025 Registration Confirmation',
        text: `Successfully registered for ${eventName}. Transaction ID: ${transactionId}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`TechFest 2025 Registration Confirmed!\nEvent: ${eventName}\nTransaction ID: ${transactionId}`);
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Your registration has been confirmed</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono font-semibold">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-semibold text-green-600">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Event:</span>
            <span className="font-semibold">{eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Participant:</span>
            <span className="font-semibold">{participantName}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleDownloadReceipt}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Receipt</span>
        </button>
        
        <button
          onClick={handleShareReceipt}
          className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Receipt</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-left">
            <h4 className="font-semibold text-blue-800 text-sm">What's Next?</h4>
            <p className="text-blue-700 text-sm">
              Check your email for event details and further instructions. 
              Save your transaction ID for future reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;