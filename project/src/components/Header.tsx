import React from 'react';
import { Calendar, Users, Trophy } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Cache2K25</h1>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Sep 18-19, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>1000+ Participants</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Cache2K25 - The Ultimate Tech Fest
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join us for two days of innovation, competition, and technology excellence. 
            Register now for technical and non-technical events!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;