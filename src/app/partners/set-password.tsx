import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { completePartnerRegistration } from '../../api/auth'; // Import the completion function
import CustomText from '@/components/CustomText';

export default function SetPartnerPasswordScreen() {
    const router = useRouter();
    const { email, code } = useLocalSearchParams<{ email: string; code: string }>(); // Get params

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSetPassword = async () => {
        setError(null);
        setSuccessMessage(null);

        // Basic Client-Side Validation
        if (!password || !confirmPassword) {
            setError("Please enter and confirm your password.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!email || !code) {
             setError("Missing email or code information. Please go back and try again.");
            return;
        }


        setLoading(true);
        try {
             console.log(`Attempting to complete registration for email: ${email}`);
             const result = await completePartnerRegistration({ 
                email, 
                code, 
                password 
             });
            
             console.log("Registration completed successfully");
             setSuccessMessage(result.message || "Account created successfully! Redirecting to login...");

             // Redirect to login screen after a short delay to show message
             setTimeout(() => {
                router.replace({
                    pathname: '/partners/login', 
                    params: { passwordSet: 'true' } // Optional param to show success on login
                });
             }, 2000); // 2-second delay

        } catch (err: any) {
            console.error("Password setting failed:", err);
            setError(err.message || "Failed to set password. Please try again.");
            // Clear passwords on error for security
            setPassword('');
            setConfirmPassword('');
        } finally {
            setLoading(false);
        }
    };
    
    // If success message is shown, disable inputs and button
    const isSuccess = !!successMessage;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.content}>
                    <CustomText style={styles.title}>naadi</CustomText>
                    <CustomText style={styles.subtitle}>Set Your Partner Password</CustomText>
                    <CustomText style={styles.infoText}>
                        Create a secure password for your account ({email})
                    </CustomText>
                    
                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <CustomText style={styles.label}>New Password</CustomText>
                            <TextInput
                                style={[styles.input, isSuccess && styles.inputDisabled]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder="New Password"
                                placeholderTextColor="#9ca3af"
                                editable={!isSuccess}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <CustomText style={styles.label}>Confirm New Password</CustomText>
                            <TextInput
                                style={[styles.input, isSuccess && styles.inputDisabled]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder="Confirm New Password"
                                placeholderTextColor="#9ca3af"
                                editable={!isSuccess}
                            />
                        </View>

                        {error && <CustomText style={styles.errorText}>{error}</CustomText>}
                        {successMessage && <CustomText style={styles.successText}>{successMessage}</CustomText>}

                        <TouchableOpacity
                            style={[styles.button, (loading || isSuccess) && styles.buttonDisabled]}
                            onPress={handleSetPassword}
                            disabled={loading || isSuccess}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" /> 
                            ) : (
                                <CustomText style={styles.buttonText}>Set Password & Create Account</CustomText>
                            )}
                        </TouchableOpacity>
                        
                        {!isSuccess && (
                            <TouchableOpacity onPress={() => router.replace('/partners/login')} style={styles.switchLink}>
                                <CustomText style={styles.backLinkText}>Back to Login</CustomText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Reusing styles from PartnerLoginScreen
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
        marginBottom: 15,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    form: {
        // Styles for the form content area
    },
    formGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
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
    inputDisabled: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
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
    errorText: {
        width: '100%',
        color: '#dc3545',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    successText: {
        width: '100%',
        color: '#28a745',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    switchLink: {
        paddingVertical: 10,
    },
    backLinkText: {
        color: '#007bff',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
}); 