import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  session: any | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInMock: (email: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const stored = localStorage.getItem('sirlarex_mock_auth');
    if (stored) {
      const data = JSON.parse(stored);
      setUser(data.user);
      setSession(data.session);
      setRole(data.role);
    }
    setLoading(false);
  }, []);

  const signInMock = (email: string, role: string) => {
    const mockUser = { id: 'mock-user-id', email };
    const mockSession = { user: mockUser, access_token: 'mock-token' };
    
    setUser(mockUser);
    setSession(mockSession);
    setRole(role);
    
    localStorage.setItem('sirlarex_mock_auth', JSON.stringify({
      user: mockUser,
      session: mockSession,
      role
    }));
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setRole(null);
    localStorage.removeItem('sirlarex_mock_auth');
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut, signInMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
