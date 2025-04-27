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
    ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { completePartnerRegistration } from '@naadi/api'; // Import the completion function
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formWrapper}>
                    <View style={styles.formContainer}>
                        <CustomText style={styles.formTitle}>Set Your Partner Password</CustomText>
                        <CustomText style={styles.formSubtitle}>
                            Create a secure password for your account associated with: 
                            <CustomText style={{ fontWeight: '600' }}> {email}</CustomText>
                        </CustomText>
                        
                        <View style={styles.form}>
                            <View style={styles.formGroup}>
                                <CustomText style={styles.label}>New Password</CustomText>
                                <TextInput
                                    style={[styles.input, isSuccess && styles.inputDisabled]}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    placeholder="Enter your new password"
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
                                    placeholder="Confirm your new password"
                                    placeholderTextColor="#9ca3af"
                                    editable={!isSuccess}
                                />
                            </View>

                            {error && <CustomText style={styles.errorText}>{error}</CustomText>}
                            {successMessage && <CustomText style={styles.successText}>{successMessage}</CustomText>}

                            <TouchableOpacity
                                style={[styles.submitButton, (loading || isSuccess) && styles.submitButtonDisabled]}
                                onPress={handleSetPassword}
                                disabled={loading || isSuccess}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" /> 
                                ) : (
                                    <CustomText style={styles.submitButtonText}>Set Password & Create Account</CustomText>
                                )}
                            </TouchableOpacity>
                            
                             {/* Optional: Add link back to login if they arrived here by mistake? */}
                             {!isSuccess && (
                                 <TouchableOpacity onPress={() => router.replace('/partners/login')} style={styles.backLink}>
                                     <CustomText style={styles.backLinkText}>Back to Login</CustomText>
                                 </TouchableOpacity>
                             )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Reusing styles from PartnerLoginScreen with minor adjustments
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 30,
    },
    formWrapper: {
        width: '90%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 25,
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
        borderWidth: 1,
        borderColor: '#d1d5db', 
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        fontSize: 14,
        color: '#1f2937',
        backgroundColor: '#fff',
        minHeight: 40,
    },
    inputDisabled: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    submitButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#adb5bd',
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
     successText: {
        color: '#28a745',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    backLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    backLinkText: {
        color: '#007bff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
}); 