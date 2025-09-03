export interface Event {
  id: string;
  name: string;
  category: 'technical' | 'non-technical';
  description: string;
  price: number;
  maxParticipants?: number;
  requiresTeam?: boolean;
  teamSize?: number;
  requiresGameIds?: boolean;
  image: string;
  deadline: string;
}

export interface Registration {
  eventId: string;
  participantName: string;
  email: string;
  phone: string;
  college?: string;
  teamMembers?: TeamMember[];
  gameIds?: GameId[];
  totalAmount: number;
}

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

export interface GameId {
  playerName: string;
  gameId: string;
  characterName?: string;
}