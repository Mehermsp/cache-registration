import { Event } from '../types/Event';

export const events: Event[] = [
  // Technical Events
  {
    id: 'web-dev',
    name: 'Web Development Challenge',
    category: 'technical',
    description: 'Build innovative web applications using modern frameworks and showcase your coding skills.',
    price: 299,
    maxParticipants: 2,
    requiresTeam: true,
    teamSize: 2,
    image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-15'
  },
  {
    id: 'poster-presentation',
    name: 'Poster Presentation',
    category: 'technical',
    description: 'Present your research and technical projects through compelling visual presentations.',
    price: 199,
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-17'
  },
  {
    id: 'techexpo',
    name: 'Tech Expo',
    category: 'technical',
    description: 'Showcase your innovative technology projects and prototypes to industry experts.',
    price: 499,
    maxParticipants: 4,
    requiresTeam: true,
    teamSize: 4,
    image: 'https://images.pexels.com/photos/8636654/pexels-photo-8636654.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-16'
  },
  {
    id: 'pycharm',
    name: 'PyCharm Programming Contest',
    category: 'technical',
    description: 'Solve complex programming challenges using Python and demonstrate your algorithmic skills.',
    price: 249,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-17'
  },
  {
    id: 'technical-quiz',
    name: 'Technical Quiz',
    category: 'technical',
    description: 'Test your knowledge across various technical domains in this comprehensive quiz competition.',
    price: 149,
    image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-17'
  },
  // Non-Technical Events
  {
    id: 'photo-contest',
    name: 'Photography Contest',
    category: 'non-technical',
    description: 'Capture the world through your lens and compete for the best photograph award.',
    price: 99,
    image: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-17'
  },
  {
    id: 'tech-meme-contest',
    name: 'Tech Meme Contest',
    category: 'non-technical',
    description: 'Create hilarious memes about technology, programming, and developer life.',
    price: 79,
    image: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-17'
  },
  {
    id: 'bgmi-esports',
    name: 'BGMI Esports Tournament',
    category: 'non-technical',
    description: 'Battle it out in Battlegrounds Mobile India with your squad for the ultimate victory.',
    price: 199,
    maxParticipants: 4,
    requiresTeam: true,
    teamSize: 4,
    requiresGameIds: true,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-15'
  },
  {
    id: 'freefire-esports',
    name: 'Free Fire Esports Championship',
    category: 'non-technical',
    description: 'Compete in Free Fire with your squad and claim the championship title.',
    price: 179,
    maxParticipants: 4,
    requiresTeam: true,
    teamSize: 4,
    requiresGameIds: true,
    image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
    deadline: '2025-09-15'
  }
];