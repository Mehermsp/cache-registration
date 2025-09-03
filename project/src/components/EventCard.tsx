import React from 'react';
import { Event } from '../types/Event';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegister: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
          event.category === 'technical' 
            ? 'bg-blue-500 text-white' 
            : 'bg-purple-500 text-white'
        }`}>
          {event.category === 'technical' ? 'Technical' : 'Non-Technical'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
            <span className="font-semibold text-green-600">₹{event.price}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Deadline: {formatDeadline(event.deadline)}</span>
          </div>
          
          {event.requiresTeam && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>Team Size: {event.teamSize} members</span>
            </div>
          )}
          
          {event.requiresGameIds && (
            <div className="flex items-center text-sm text-blue-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Game IDs Required</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => onRegister(event)}
          disabled={isDeadlinePassed(event.deadline)}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isDeadlinePassed(event.deadline)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
          }`}
        >
          {isDeadlinePassed(event.deadline) ? 'Registration Closed' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;