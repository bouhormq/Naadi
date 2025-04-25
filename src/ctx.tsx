import React, { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { loginWithEmail, logout, type UserRole, type AuthUserResult } from './api/auth'; // Import real auth functions and types
import { getFunctions } from 'firebase/functions'; // Import the getFunctions function

// Define the shape of the user data we want in the context
interface UserData {
  email: string | null;
  role: UserRole;
  // Add other relevant fields from Firebase User if needed (e.g., uid, displayName)
}

// Define the shape of the context value
interface AuthContextType {
  // Updated signIn to be async and reflect potential failure
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>; 
  signOut: () => void;
  session: UserData | null; // Store parsed user data object
  isLoading: boolean; // Overall loading state (checking storage)
  isLoggingIn: boolean; // Specific loading state for login action
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false, error: 'Provider not ready' }),
  signOut: () => null,
  session: null,
  isLoading: true, // Start as loading
  isLoggingIn: false,
});

// Hook to access the session context
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

// Provider component
export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoadingStorage, storedSession], setStoredSession] = useStorageState('session'); // Key for storage
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Login action loading state

  // Effect to parse stored session when it loads from storage
  useEffect(() => {
    if (!isLoadingStorage) {
      if (storedSession) {
        try {
          const parsedData: { email: string; role: UserRole } = JSON.parse(storedSession);
          setUserData(parsedData);
        } catch (e) {
          console.error("Failed to parse stored session:", e);
          setStoredSession(null); // Clear invalid stored session
        }
      } else {
        setUserData(null); // No stored session
      }
    }
  }, [isLoadingStorage, storedSession, setStoredSession]);

  const handleSignIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoggingIn(true);
    try {
      const result = await loginWithEmail(email, pass);
      if (result && result.user) {
        const dataToStore: UserData = {
          email: result.user.email, // Assuming email is always present on success
          role: result.role,
        };
        setUserData(dataToStore);
        setStoredSession(JSON.stringify(dataToStore)); // Store stringified user data
        console.log("SessionProvider: Signed in, session set:", dataToStore);
        setIsLoggingIn(false);
        return { success: true };
      } else {
        // Should not happen if loginWithEmail throws errors, but handle defensively
        setIsLoggingIn(false);
        return { success: false, error: 'Login failed unexpectedly.' };
      }
    } catch (error: any) {
      console.error("SessionProvider: SignIn error:", error);
      setUserData(null);      // Clear any potentially stale user data
      setStoredSession(null); // Clear stored session on error
      setIsLoggingIn(false);
      return { success: false, error: error.message || 'An unknown login error occurred.' };
    }
  };

  const handleSignOut = async () => {
    try {
      await logout(); // Call the actual Firebase logout
    } catch (error) {
       console.error("SessionProvider: Logout error:", error);
       // Still proceed to clear local state even if Firebase logout fails
    }
    setUserData(null);
    setStoredSession(null);
    console.log("SessionProvider: Signed out, session cleared.");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        session: userData, // Provide the parsed user data object
        isLoading: isLoadingStorage, // Reflect storage loading state
        isLoggingIn: isLoggingIn,    // Reflect login action loading state
      }}>
      {children}
    </AuthContext.Provider>
  );
} 