import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import CustomText from '@/components/CustomText';
import { useSession } from '../../ctx'; // Adjust path if needed based on actual location

// This is the Main App Login Screen
export default function MainLoginScreen() {
    const router = useRouter();
    // Get signIn function and session status from context
    const { signIn, session, isLoading: isSessionLoading, isLoggingIn } = useSession(); 

    // State for Login Form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);

    // Redirect logged-in users away from this page
    useEffect(() => {
        // Only redirect if session is loaded and valid
        if (!isSessionLoading && session) {
            // This login form is only for 'user' roles.
            if (session.role === 'user') {
                 console.log("MainLoginScreen: Session detected user, redirecting to /(main)/(protected)");
                 // Redirect to the main protected area for users
                 router.replace('/(main)/(protected)'); 
            } else {
                // If admin or partner somehow logged in here or is visiting,
                // send them to the root. The root layout will handle the final redirect.
                console.log(`MainLoginScreen: Session detected ${session.role}, redirecting to /`);
                router.replace('/');
            }
        }
    }, [session, isSessionLoading, router]);

    const handleLogin = async () => {
        setLoginError(null);
        // Call signIn from context
        const result = await signIn(loginEmail, loginPassword);

        if (!result.success) {
            setLoginError(result.error || "Login failed. Please check your credentials.");
        } 
        // If login is successful, the useEffect above will handle the redirect
        // based on the updated session state from the context.
    };

    // If the session is still loading, show a basic indicator
    if (isSessionLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            </SafeAreaView>
        );
    }

    // If already logged in (and useEffect hasn't redirected yet), render nothing or Redirect
    // This prevents flickering the login form briefly before redirection
    if (session) {
         return <Redirect href="/" />; // Redirect immediately if session exists
    }


    // Render the login form if not loading and not logged in
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.content}> 
                    <CustomText style={styles.title}>naadi</CustomText> 
                    <CustomText style={styles.subtitle}>Sign in to your account</CustomText>
                    
                    {loginError && <CustomText style={styles.errorText}>{loginError}</CustomText>}

                    <TextInput
                        style={styles.input}
                        value={loginEmail}
                        onChangeText={(text) => { setLoginEmail(text); setLoginError(null); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Email"
                        placeholderTextColor="#9ca3af"
                    />
                    <TextInput
                        style={styles.input}
                        value={loginPassword}
                        onChangeText={(text) => { setLoginPassword(text); setLoginError(null); }}
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

                    {/* Optional: Link to Sign Up */}
                    {/* <TouchableOpacity onPress={() => router.push('/signup')} style={styles.switchLink}>
                        <CustomText style={styles.switchLinkText}>Don't have an account? Sign Up</CustomText>
                    </TouchableOpacity> */}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Styles adapted from PartnerLoginScreen
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa', 
    },
    container: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    content: { 
        width: '100%',
        maxWidth: 360, 
        alignItems: 'center',
    },
    title: {
        fontSize: 70, 
        fontWeight: '500',
        color: '#212529',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 30, 
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50, 
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
        backgroundColor: '#007bff', 
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10, 
        marginBottom: 25,
    },
    buttonDisabled: {
        backgroundColor: '#6c757d', 
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
        color: '#007bff', 
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    errorText: {
        width: '100%',
        color: '#dc3545', 
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
}); 