import { UserProfile } from '../types/user';

export const DEMO_USER: UserProfile = {
  id: 'user-001',
  fullName: 'Ramesh Patel',
  email: 'ramesh.patel@agrishield.farm',
  phone: '+91 98480 22334',
  farmName: 'Green Valley Agro Farm',
  farmLocation: 'Godavari Basin, Andhra Pradesh',
  role: 'farmer',
  joinedDate: '2025-08-15',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const authService = {
  getCurrentUser: (): UserProfile | null => {
    const stored = localStorage.getItem('agrishield_user');
    if (!stored) {
      // Default to logged-in demo farmer for instant seamless experience
      localStorage.setItem('agrishield_user', JSON.stringify(DEMO_USER));
      localStorage.setItem('agrishield_token', 'demo-jwt-token-agrishield-2026');
      return DEMO_USER;
    }
    return JSON.parse(stored);
  },

  login: async (email: string, _password: string): Promise<AuthResponse> => {
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    let user: UserProfile = DEMO_USER;
    if (email && email !== DEMO_USER.email) {
      user = {
        ...DEMO_USER,
        fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email
      };
    }

    const token = 'jwt-token-' + Math.random().toString(36).substring(2);
    localStorage.setItem('agrishield_user', JSON.stringify(user));
    localStorage.setItem('agrishield_token', token);

    return { user, token };
  },

  register: async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    farmName: string;
    farmLocation: string;
  }): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      farmName: userData.farmName || 'My Agri Farm',
      farmLocation: userData.farmLocation || 'India',
      role: 'farmer',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const token = 'jwt-token-reg-' + Math.random().toString(36).substring(2);
    localStorage.setItem('agrishield_user', JSON.stringify(newUser));
    localStorage.setItem('agrishield_token', token);

    return { user: newUser, token };
  },

  logout: (): void => {
    localStorage.removeItem('agrishield_user');
    localStorage.removeItem('agrishield_token');
  }
};
