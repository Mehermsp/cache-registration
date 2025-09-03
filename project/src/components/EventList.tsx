import React, { useState } from 'react';
import { events } from '../data/events';
import { Event } from '../types/Event';
import EventCard from './EventCard';

interface EventListProps {
  onEventSelect: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ onEventSelect }) => {
  const [filter, setFilter] = useState<'all' | 'technical' | 'non-technical'>('all');

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.category === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Events</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of technical and non-technical competitions
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('technical')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filter === 'technical'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setFilter('non-technical')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filter === 'non-technical'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Non-Technical
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={onEventSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;