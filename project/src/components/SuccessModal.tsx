import React from 'react';
import { CheckCircle, Download, Mail, X, ExternalLink } from 'lucide-react';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 relative rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-300" />
            <h2 className="text-2xl font-bold">Registration Successful!</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-6">
            Your registration has been confirmed and payment processed successfully. 
            You will receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Registration ID</h3>
            <p className="text-lg font-mono text-blue-600">CACHE2K25-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Payment Status</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Payment Successful via Razorpay</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              <Mail className="w-4 h-4" />
              <span>Email Receipt</span>
            </button>

            <button 
              onClick={() => window.open('https://dashboard.razorpay.com', '_blank')}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Razorpay</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Keep your registration ID safe. You'll need it for event check-in. 
            Payment processed securely through Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;