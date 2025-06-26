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
    KeyboardAvoidingView,
    Image,
    Linking,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import CustomText from '@/components/CustomText';
import { useSession } from '../../ctx'; // Adjust path if needed based on actual location
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../i18n';
import { checkIfUserExists } from '../../api/auth';

// This is the Main App Login Screen
export default function MainLoginScreen() {
    const router = useRouter();
    // Get signIn function and session status from context
    const { signIn, session, isLoading: isSessionLoading, isLoggingIn } = useSession(); 

    // State for Login Form
    const [email, setEmail] = useState('');
    const [isNavigating, setIsNavigating] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

    const languages = [
        { code: 'en', name: 'English', emoji: '🇬🇧' },
        { code: 'fr', name: 'Français', emoji: '🇫🇷' },
        { code: 'ma', name: 'Darija', emoji: '🇲🇦' },
        { code: 'es', name: 'Español', emoji: '🇪🇸' },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        const currentLangCode = i18n.language;
        return languages.find(lang => lang.code === currentLangCode) || languages[0];
    });

    const changeLanguage = (language: { code: string; name: string; emoji: string }) => {
        setSelectedLanguage(language);
        setIsLanguageModalVisible(false);
        i18n.changeLanguage(language.code);
    };

    const toggleLanguageModal = () => {
        setIsLanguageModalVisible(!isLanguageModalVisible);
    };

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

    const handleAppleLogin = () => {
        console.log('Apple login pressed');
    };

    const handleFacebookLogin = () => {
        console.log('Facebook login pressed');
    };

    const handleGoogleLogin = () => {
        console.log('Google login pressed');
    };

    const handleContinue = async () => {
        setLoginError(null);
        setIsNavigating(true);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            setLoginError('Please enter a valid email address.');
            setIsNavigating(false);
            return;
        }

        try {
            const userExists = await checkIfUserExists(email);
            if (userExists) {
                // Navigate to the password screen for existing users
                router.push({
                    pathname: 'login',
                    params: { email: email },
                });
            } else {
                // Navigate to the signup screen for new users
                router.push({
                    pathname: 'signup',
                    params: { email: email },
                });
            }
        } catch (error) {
            console.error("Error during user check:", error);
            setLoginError("An unexpected error occurred. Please try again.");
        } finally {
            setIsNavigating(false);
        }
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
        <TouchableWithoutFeedback onPress={() => Platform.OS !== 'web' && Keyboard.dismiss()} accessible={false}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.content}> 
                        <CustomText style={styles.title}>Log in or sign up</CustomText> 
                        <CustomText style={styles.subtitle}>Create an account or log in to book and manage your appointments.</CustomText>
                        
                        {loginError && <CustomText style={styles.errorText}>{loginError}</CustomText>}

                        <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                            <Image source={require('../(main)/(assets)/apple.png')} style={styles.icon} />
                            <CustomText style={styles.socialButtonText}>Continue with Apple</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                            <Image source={require('../(main)/(assets)/facebook.png')} style={styles.icon} />
                            <CustomText style={styles.socialButtonText}>Continue with Facebook</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                            <Image source={require('../(main)/(assets)/google.png')} style={styles.icon} />
                            <CustomText style={styles.socialButtonText}>Continue with Google</CustomText>
                        </TouchableOpacity>

                        <View style={styles.separatorContainer}>
                            <View style={styles.separatorLine} />
                            <CustomText style={styles.separatorText}>OR</CustomText>
                            <View style={styles.separatorLine} />
                        </View>

                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Email address"
                            placeholderTextColor="#9ca3af"
                        />
                       
                        <TouchableOpacity
                            style={[styles.button, (!email || isLoggingIn || isNavigating) && styles.buttonDisabled]}
                            onPress={handleContinue}
                            disabled={!email || isLoggingIn || isNavigating}
                        >
                            {(isLoggingIn || isNavigating) ? <ActivityIndicator color="#fff" size="small" /> : <CustomText style={styles.buttonText}>Continue</CustomText>}
                        </TouchableOpacity>

                        <View style={styles.businessAccountContainer}>
                            <CustomText style={styles.businessAccountText}>Have a business account?</CustomText>
                            <TouchableOpacity onPress={() => router.push('/partners/login')}>
                                <CustomText style={styles.switchLinkText}>Sign in as a professional</CustomText>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            <TouchableOpacity
                                style={styles.languageSelector}
                                onPress={toggleLanguageModal}
                            >
                                <Ionicons name="language" size={20} color="#666" />
                                <CustomText style={styles.footerLinkText}>{selectedLanguage.emoji} {selectedLanguage.name}</CustomText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.supportButton} onPress={() => Linking.openURL('https://naadi.ma/support')}>
                                <Ionicons name="help-circle-outline" size={20} color="#666" />
                                <CustomText style={styles.footerLinkText}>Support</CustomText>
                            </TouchableOpacity>
                        </View>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isLanguageModalVisible}
                            onRequestClose={toggleLanguageModal}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPressOut={toggleLanguageModal}
                            >
                                <View style={styles.modalContent}>
                                    <CustomText style={styles.modalTitle}>Select a Language</CustomText>
                                    <ScrollView>
                                        {languages.map((lang) => (
                                            <TouchableOpacity
                                                key={lang.code}
                                                style={[
                                                    styles.languageOption,
                                                    selectedLanguage.code === lang.code && styles.selectedLanguage,
                                                ]}
                                                onPress={() => changeLanguage(lang)}
                                            >
                                                <CustomText style={styles.languageOptionText}>{lang.emoji} {lang.name}</CustomText>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

// Styles adapted from PartnerLoginScreen
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', 
    },
    container: { 
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    content: { 
        width: '100%',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 26, 
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30, 
    },
    input: {
        width: '100%',
        height: 50, 
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc', 
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#000', 
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
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
    switchLinkText: {
        color: '#007bff', 
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        width: '100%',
        color: '#dc3545', 
        fontSize: 14,
        marginBottom: 15,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    socialButtonText: {
        color: '#000',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 10,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    separatorText: {
        marginHorizontal: 10,
        color: '#666',
        fontSize: 14,
    },
    businessAccountContainer: {
        alignItems: 'flex-start',
        marginTop: 20,
    },
    businessAccountText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerLinkText: {
        color: '#666',
        fontSize: 16,
        marginHorizontal: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '47%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    languageOptionText: {
        fontSize: 16,
        color: '#000',
    },
    selectedLanguage: {
        backgroundColor: '#f0f0f0',
    },
});