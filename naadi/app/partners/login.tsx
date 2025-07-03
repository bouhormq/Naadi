import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Remove direct auth imports if no longer needed directly here
// import { loginWithEmail, registerPartnerWithCode } from '../../api/auth';
import { verifyPartnerRegistrationCode } from '@naadi/api'; // Keep if first time tab uses it
import CustomText from '@/components/CustomText';
// Import the useSession hook
import { useSession } from '@naadi/hooks/ctx'; 

type ViewState = 'login' | 'firstTime';

// This is the Partner-specific Login Screen
export default function PartnerLoginScreen() {
    const [activeView, setActiveView] = useState<ViewState>('login');
    const router = useRouter();
    const { passwordSet } = useLocalSearchParams<{ passwordSet?: string }>(); // Check if password was just set
    // Get signIn function and loading state from context
    const { signIn, session, isLoading: isSessionLoading, isLoggingIn } = useSession(); 

    // State for Login Form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    // Remove local loginLoading state, use isLoggingIn from context
    // const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null); // For password set message

    // State for First Time Form
    const [firstTimeEmail, setFirstTimeEmail] = useState('');
    const [firstTimeCode, setFirstTimeCode] = useState('');
    const [firstTimeLoading, setFirstTimeLoading] = useState(false);
    const [firstTimeError, setFirstTimeError] = useState<string | null>(null);
    // Remove success state for first time, navigation handles it
    // const [firstTimeSuccess, setFirstTimeSuccess] = useState<string | null>(null);

    const ADMIN_EMAIL = "bouhormq@gmail.com";

    // Show success message if redirected from password setting
    useEffect(() => {
        if (passwordSet === 'true') {
            setLoginSuccessMessage("Password set successfully! You can now log in.");
            // Optionally clear the param from history if possible/needed, expo-router might handle this
        }
    }, [passwordSet]);

    // Redirect based on session state after login
    useEffect(() => {
        // Only redirect if session is loaded and valid
        if (!isSessionLoading && session) {
            if (session.role === 'admin') {
                console.log("PartnerLoginScreen: Session detected admin, redirecting to /admin");
                router.replace('/admin');
            } else if (session.role === 'partner') {
                console.log("PartnerLoginScreen: Session detected partner, redirecting to /partners");
                router.replace('/partners');
            } else if (session.role === 'user') {
                console.log("PartnerLoginScreen: Session detected user, redirecting to /");
                router.replace('/'); // Redirect user role to main app root
            }
        }
    }, [session, isSessionLoading, router]);

    const handleLogin = async () => {
        setLoginError(null);
        setLoginSuccessMessage(null); // Clear success message on new attempt
        // Call signIn from context
        const result = await signIn(loginEmail, loginPassword);

        if (!result.success) {
            setLoginError(result.error || "Login failed. Please check your credentials.");
        } 
        // If login is successful, the useEffect above will handle the redirect
        // based on the updated session state from the context.
    };

    const handleFirstTimeSubmit = async () => {
        setFirstTimeLoading(true);
        setFirstTimeError(null);
        try {
            console.log(`Attempting to verify code for email: ${firstTimeEmail}`);
            // Call the verification function
            await verifyPartnerRegistrationCode({ email: firstTimeEmail, code: firstTimeCode });
            
            console.log("Code verified, navigating to set-password");
            // Navigate to the set password screen on success
            router.push({
                pathname: '/partners/set-password',
                params: { email: firstTimeEmail, code: firstTimeCode }
            });
        } catch (error: any) {
             console.error("Code verification failed:", error);
            setFirstTimeError(error.message || "Failed to verify registration code.");
        } finally {
            setFirstTimeLoading(false);
        }
    };

    const renderLoginForm = () => (
        <>
            <CustomText style={styles.title}>naadi</CustomText> 
            <CustomText style={styles.subtitle}>Sign in to your partner account</CustomText>
            
            {loginSuccessMessage && <CustomText style={styles.successText}>{loginSuccessMessage}</CustomText>}
            {loginError && <CustomText style={styles.errorText}>{loginError}</CustomText>}

            <TextInput
                style={styles.input}
                value={loginEmail}
                onChangeText={(text) => { setLoginEmail(text); setLoginError(null); setLoginSuccessMessage(null); }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
            />
            <TextInput
                style={styles.input}
                value={loginPassword}
                onChangeText={(text) => { setLoginPassword(text); setLoginError(null); setLoginSuccessMessage(null); }}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#9ca3af"
            />
           
            <TouchableOpacity
                style={[styles.button, isLoggingIn && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoggingIn}
            >
                {isLoggingIn ? <ActivityIndicator color="#fff" size="small" /> : <CustomText style={styles.buttonText}>Log In</CustomText>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveView('firstTime')} style={styles.switchLink}>
                <CustomText style={styles.switchLinkText}>First Time Here? Sign-Up</CustomText>
            </TouchableOpacity>
        </>
    );

    const renderFirstTimeForm = () => (
        <>
            <CustomText style={styles.title}>naadi</CustomText> 
            <CustomText style={styles.subtitle}>Enter the email you registered with and the code sent to you after approval.</CustomText>

            {firstTimeError && <CustomText style={styles.errorText}>{firstTimeError}</CustomText>}

            <TextInput
                style={styles.input}
                value={firstTimeEmail}
                onChangeText={(text) => { setFirstTimeEmail(text); setFirstTimeError(null); }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
            />
            <TextInput
                style={styles.input}
                value={firstTimeCode}
                onChangeText={(text) => { setFirstTimeCode(text); setFirstTimeError(null); }}
                autoCapitalize="characters"
                placeholder="Registration Code"
                placeholderTextColor="#9ca3af"
            />
            
            <TouchableOpacity
                style={[styles.button, firstTimeLoading && styles.buttonDisabled]}
                onPress={handleFirstTimeSubmit}
                disabled={firstTimeLoading}
            >
                {firstTimeLoading ? <ActivityIndicator color="#fff" size="small" /> : <CustomText style={styles.buttonText}>Verify Code</CustomText>}
            </TouchableOpacity>

             <TouchableOpacity onPress={() => setActiveView('login')} style={styles.switchLink}>
                <CustomText style={styles.switchLinkText}>Back to Log In</CustomText>
            </TouchableOpacity>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.content}> 
                    {activeView === 'login' ? renderLoginForm() : renderFirstTimeForm()}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Styles inspired by the Classpass example
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Light gray background
    },
    container: { // Main container for centering
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    content: { // Content wrapper within the container
        width: '100%',
        maxWidth: 360, // Max width for the content block
        alignItems: 'center', // Center items horizontally
    },
    title: {
        fontSize: 70, // Larger font size for the brand name
        fontWeight: '500',
        color: '#212529',
        marginBottom: 15,
        textAlign: 'center',
        // Use a specific font if available, e.g., fontFamily: 'YourBrandFont-Medium'
    },
    subtitle: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 30, 
        textAlign: 'center',
    },
    formInfoText: { // Specific text for first time setup form
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    input: {
        width: '100%',
        height: 50, // Taller inputs
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ced4da', 
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#212529',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff', // Standard blue
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10, 
        marginBottom: 25, // Space before the link
    },
    buttonDisabled: {
        backgroundColor: '#6c757d', // Gray when disabled
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    switchLink: {
        paddingVertical: 10,
    },
    switchLinkText: {
        color: '#007bff', // Blue link color
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    errorText: {
        width: '100%',
        color: '#dc3545', // Bootstrap danger color
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        // backgroundColor: '#f8d7da',
        // padding: 10,
        // borderRadius: 4,
    },
     successText: {
        width: '100%',
        color: '#28a745', // Bootstrap success color
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        // backgroundColor: '#d4edda',
        // padding: 10,
        // borderRadius: 4,
    },
    // Remove unused styles (like tab, formContainer, label etc.)
}); 