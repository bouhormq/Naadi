import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSession } from '@naadi/hooks/ctx';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const email = params.email as string;

    const { signIn, session, isLoading: isSessionLoading, isLoggingIn } = useSession();

    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    useEffect(() => {
        // If the email is not passed, we can't proceed with login.
        // Redirect back to the onboarding screen.
        if (!email) {
            router.replace('onboarding');
        }
    }, [email, router]);

    useEffect(() => {
        if (session) {
            switch (session.role) {
                case 'admin':
                    router.replace('/admin/(protected)');
                    break;
                case 'partner':
                    router.replace('/partners/(protected)');
                    break;
                default:
                    router.replace('/(main)/(protected)');
                    break;
            }
        }
    }, [session, router]);

    if (isSessionLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (session) {
        // While redirecting, don't render the login form
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    // While redirecting, don't render the login form
    if (!email) {
        return null;
    }

    const handleLogin = async () => {
        if (!password) {
            setLoginError('Password is required.');
            return;
        }
        setLoginError(null);
        const result = await signIn(email, password);

        if (!result.success) {
            setLoginError('Incorrect password. Please try again');
        }
        // On success, the useEffect listening to session changes will handle the redirect.
    };

    return (
        <TouchableWithoutFeedback onPress={() => Platform.OS !== 'web' && Keyboard.dismiss()} accessible={false}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <CustomText style={styles.title}>Welcome back</CustomText>
                        <CustomText style={styles.subtitle}>
                            Enter your password to log in as {email}
                        </CustomText>
                    </View>

                    <View style={styles.form}>
                        <CustomText style={styles.label}>Password</CustomText>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                placeholder="Enter your password"
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="#8e8e93" />
                            </TouchableOpacity>
                        </View>

                        {loginError && <CustomText style={styles.errorText}>{loginError}</CustomText>}

                        <TouchableOpacity
                            style={[styles.button, isLoggingIn && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <CustomText style={styles.buttonText}>Continue</CustomText>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                            <CustomText style={styles.forgotPasswordText}>Forgot your password?</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4, // Increase touchable area
    },
    header: {
        marginTop: 24,
        marginBottom: 32,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#3c3c43',
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 4,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#000000',
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: '#000000',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    buttonDisabled: {
        backgroundColor: '#a9a9a9',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPasswordText: {
        color: '#007bff', 
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 13,
        marginTop: 8,
        marginBottom: 8,
    },
});