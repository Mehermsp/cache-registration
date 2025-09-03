import React, { useState } from 'react';
import { Event, Registration, TeamMember, GameId } from '../types/Event';
import { ArrowLeft, Users, GamepadIcon, CreditCard } from 'lucide-react';

interface RegistrationFormProps {
  event: Event;
  onBack: () => void;
  onSubmit: (registration: Registration) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    participantName: '',
    email: '',
    phone: '',
    college: ''
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    event.requiresTeam ? Array(event.teamSize! - 1).fill(null).map(() => ({
      name: '',
      email: '',
      phone: ''
    })) : []
  );

  const [gameIds, setGameIds] = useState<GameId[]>(
    event.requiresGameIds ? Array(event.teamSize || 1).fill(null).map(() => ({
      playerName: '',
      gameId: '',
      characterName: ''
    })) : []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
  };

  const handleGameIdChange = (index: number, field: keyof GameId, value: string) => {
    setGameIds(prev => prev.map((gameId, i) => 
      i === index ? { ...gameId, [field]: value } : gameId
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const registration: Registration = {
      eventId: event.id,
      participantName: formData.participantName,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      teamMembers: event.requiresTeam ? teamMembers : undefined,
      gameIds: event.requiresGameIds ? gameIds : undefined,
      totalAmount: event.price
    };

    onSubmit(registration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            <p className="text-blue-100 mb-4">{event.description}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="font-semibold">₹{event.price}</span>
              </div>
              {event.requiresTeam && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Team of {event.teamSize}</span>
                </div>
              )}
              {event.requiresGameIds && (
                <div className="flex items-center">
                  <GamepadIcon className="w-4 h-4 mr-2" />
                  <span>Game IDs Required</span>
                </div>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Participant Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Participant Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/Institution
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            {event.requiresTeam && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Team Members
                </h3>
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-700 mb-4">Member {index + 2}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Game IDs */}
            {event.requiresGameIds && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <GamepadIcon className="w-5 h-5 mr-2 text-green-600" />
                  Game IDs
                </h3>
                {gameIds.map((gameId, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-700 mb-4">Player {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Player Name *
                        </label>
                        <input
                          type="text"
                          value={gameId.playerName}
                          onChange={(e) => handleGameIdChange(index, 'playerName', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Game ID *
                        </label>
                        <input
                          type="text"
                          value={gameId.gameId}
                          onChange={(e) => handleGameIdChange(index, 'gameId', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Character Name
                        </label>
                        <input
                          type="text"
                          value={gameId.characterName || ''}
                          onChange={(e) => handleGameIdChange(index, 'characterName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-gray-700">Total Amount:</span>
                <span className="font-bold text-green-600">₹{event.price}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;