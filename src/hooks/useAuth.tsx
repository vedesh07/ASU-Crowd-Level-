import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => void;
  resendOTP: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // For now, we'll use placeholder URLs since the backend is not connected
  // In production, these would be replaced with actual Supabase configuration
  const API_BASE = 'https://placeholder.supabase.co/functions/v1/make-server-964be997';
  const API_KEY = 'placeholder-anon-key';

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('crowdTracker_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const makeRequest = async (endpoint: string, body?: any) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      // Fallback for demo mode when backend is not available
      if (endpoint === '/auth/send-otp') {
        // Simulate OTP generation for demo
        const demoOTP = '123456';
        console.log(`Demo Mode - OTP for ${body.email}: ${demoOTP}`);
        return { success: true, debug: { otp: demoOTP } };
      } else if (endpoint === '/auth/verify-otp') {
        // Demo verification - accept 123456 as valid OTP
        if (body.otp === '123456') {
          const firstName = body.email.split('@')[0].split('.')[0];
          const lastName = body.email.includes('.') ? 
            body.email.split('@')[0].split('.')[1] : 'Student';
          
          return {
            success: true,
            user: {
              id: firstName.toLowerCase(),
              email: body.email,
              firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
              lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1)
            }
          };
        } else {
          throw new Error('Invalid OTP. Use 123456 for demo.');
        }
      }
      throw error;
    }
  };

  const login = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Skip all validation - accept any email
      setPendingEmail(email || 'demo@asu.edu');
    } catch (err) {
      // Never throw errors in demo mode
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Always succeed with any OTP - create demo user
      const email = pendingEmail || 'demo@asu.edu';
      const firstName = email.split('@')[0].split('.')[0] || 'Demo';
      const lastName = email.includes('.') ? 
        email.split('@')[0].split('.')[1] || 'User' : 'User';
      
      const userData = {
        id: firstName.toLowerCase(),
        email: email,
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1)
      };
      
      setUser(userData);
      localStorage.setItem('crowdTracker_user', JSON.stringify(userData));
      setPendingEmail(null);
    } catch (err) {
      // Never throw errors in demo mode
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!pendingEmail) {
      throw new Error('No pending email verification');
    }
    
    await login(pendingEmail);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crowdTracker_user');
    setPendingEmail(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      verifyOTP,
      logout,
      resendOTP,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}