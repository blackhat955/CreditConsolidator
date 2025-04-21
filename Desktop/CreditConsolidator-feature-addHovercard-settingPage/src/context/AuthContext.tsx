// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { User } from '../types';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
// }



// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Mock user for demonstration
// const mockUser: User = {
//   id: '1',
//   name: 'Durgesh Tiwari',
//   email: 'durgesh.tiw@example.com',
//   avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
//   notificationPreferences: {
//     email: true,
//     sms: false,
//     push: true,
//   },
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate checking for user session
//     const checkAuthState = () => {
//       const savedUser = localStorage.getItem('user');
//       if (savedUser) {
//         setUser(JSON.parse(savedUser));
//       }
//       setLoading(false);
//     };

//     checkAuthState();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // For demo purposes, automatically log in with mock data
//       setUser(mockUser);
//       localStorage.setItem('user', JSON.stringify(mockUser));
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithGoogle = async () => {
//     setLoading(true);
//     try {
//       // Simulate Google Auth
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setUser(mockUser);
//       localStorage.setItem('user', JSON.stringify(mockUser));
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (name: string, email: string, password: string) => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const newUser: User = {
//         ...mockUser,
//         name,
//         email,
//       };
      
//       setUser(newUser);
//       localStorage.setItem('user', JSON.stringify(newUser));
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User & { twoFactorEnabled: boolean } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<void>;
  setup2FA: (phone: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  disable2FA: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demonstration
const mockUser: User & { twoFactorEnabled: boolean } = {
  id: '1',
  name: 'Durgesh Tiwari',
  email: 'durgesh.tiw@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
  },
  twoFactorEnabled: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { twoFactorEnabled: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for saved user
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed: User & { twoFactorEnabled: boolean } = JSON.parse(saved);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    const newUser: User & { twoFactorEnabled: boolean } = {
      ...mockUser,
      id: Date.now().toString(),
      name,
      email,
      twoFactorEnabled: false,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    // Simulate password change API
    await new Promise((res) => setTimeout(res, 1000));
    // No state change
  };

  const setup2FA = async (phone: string) => {
    // Simulate sending SMS code
    await new Promise((res) => setTimeout(res, 1000));
    // Could store phone if needed
  };

  const verify2FA = async (code: string) => {
    // Simulate verifying code
    await new Promise((res) => setTimeout(res, 1000));
    if (user) {
      const updated = { ...user, twoFactorEnabled: true };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const disable2FA = async () => {
    // Simulate disabling 2FA
    await new Promise((res) => setTimeout(res, 1000));
    if (user) {
      const updated = { ...user, twoFactorEnabled: false };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        changePassword,
        setup2FA,
        verify2FA,
        disable2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
