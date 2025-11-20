import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { loginWithEmail, logout, signupNormalUser, getUserProfile, type UserRole, type AuthUserResult, type SignupData } from '@naadi/api'; // Import real auth functions and types
import { type User } from '../../types';
import { useRouter } from 'expo-router';
import { auth as firebaseAuth } from '@naadi/config/firebase/firebase';

// Define the shape of the context value
interface AuthContextType {
  // Updated signIn to be async and reflect potential failure
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshSession: () => Promise<void>; // New function to refresh session
  updateSession: (updates: Partial<User>) => void; // Manual session update
  session: User | null; // Store parsed user data object
  isLoading: boolean; // Overall loading state (checking storage)
  isLoggingIn: boolean; // Specific loading state for login action
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false, error: 'Provider not ready' }),
  signUp: async () => ({ success: false, error: 'Provider not ready' }),
  signOut: () => null,
  refreshSession: async () => { },
  updateSession: () => { },
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
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Login action loading state
  const router = useRouter();

  // Effect to parse stored session when it loads from storage
  useEffect(() => {
    if (!isLoadingStorage) {
      if (storedSession) {
        try {
          const parsedData: User = JSON.parse(storedSession);
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
        const dataToStore: User = result.user;
        setUserData(dataToStore);
        setStoredSession(JSON.stringify(dataToStore)); // Store stringified user data
        console.log("SessionProvider: Signed in, session set:", dataToStore);

        // Refresh session to get latest data from Firestore
        // This ensures onboardingCompleted and other fields are up-to-date
        try {
          const updatedUser = await getUserProfile(result.user.uid);
          if (updatedUser) {
            const mergedUser = { ...dataToStore, ...updatedUser };

            // If admin, force onboardingCompleted
            if (result.user.email === "bouhormq@gmail.com") {
              mergedUser.role = 'admin';
              mergedUser.onboardingCompleted = true;
            }

            setUserData(mergedUser);
            setStoredSession(JSON.stringify(mergedUser));
            console.log("SessionProvider: Session refreshed with Firestore data:", mergedUser);
          }
        } catch (refreshError) {
          console.warn("SessionProvider: Failed to refresh session, using initial data:", refreshError);
          // Continue with initial data if refresh fails
        }

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

    // Determine redirect based on app variant
    const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';

    if (appVariant === 'partner') {
      // Partner app: redirect to partner login
      router.replace('/partners/login');
    } else {
      // Main app: redirect to onboarding
      router.replace('/(main)/onboarding');
    }
  };

  const handleSignUp = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      await signupNormalUser(data);
      // After successful signup, automatically sign the user in
      return await handleSignIn(data.email, data.password);
    } catch (error: any) {
      console.error("SessionProvider: SignUp error:", error);
      return { success: false, error: error.message || 'An unknown signup error occurred.' };
    }
  };

  const refreshSession = async () => {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        console.log("Refreshing session for user:", currentUser.uid);
        const updatedUser = await getUserProfile(currentUser.uid);
        if (updatedUser) {
          // Preserve the role from the current session if it exists, as getUserProfile might not return it fully populated with claims logic
          // Actually, getUserProfile returns the Firestore doc.
          // We should probably re-run the logic from loginWithEmail to get the correct role if it depends on claims.
          // But for onboardingCompleted, the Firestore doc is the source of truth.

          // Let's merge with existing session to keep role if needed, or just trust Firestore + claims logic if we replicated it.
          // For now, let's assume Firestore has the role or we keep the existing one.

          const mergedUser = { ...userData, ...updatedUser };

          // If admin, force onboardingCompleted
          if (currentUser.email === "bouhormq@gmail.com") {
            mergedUser.role = 'admin';
            mergedUser.onboardingCompleted = true;
          }

          setUserData(mergedUser);
          setStoredSession(JSON.stringify(mergedUser));
          console.log("Session refreshed:", mergedUser);
        }
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  const updateSession = (updates: Partial<User>) => {
    if (userData) {
      const updatedUser = { ...userData, ...updates };
      setUserData(updatedUser);
      setStoredSession(JSON.stringify(updatedUser));
      console.log("Session updated manually:", updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleSignUp,
        refreshSession,
        updateSession, // Expose updateSession
        session: userData, // Provide the parsed user data object
        isLoading: isLoadingStorage, // Reflect storage loading state
        isLoggingIn: isLoggingIn,    // Reflect login action loading state
      }}>
      {children}
    </AuthContext.Provider>
  );
}