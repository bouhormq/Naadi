import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Linking,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import CustomText from '@/components/CustomText';
import PhoneInput, { PhoneInfo, countriesData } from '@/components/PhoneInput';
import { useSession } from '../../ctx';

export default function SignupScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const { signUp } = useSession();

    const defaultCountry = countriesData.find(c => c.code === 'MA') || countriesData[0];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [phoneInfo, setPhoneInfo] = useState<PhoneInfo>({ ...defaultCountry, number: '' });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [agreeToMarketing, setAgreeToMarketing] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        if (isContinueDisabled) return;

        setIsLoading(true);
        setError(null);

        const result = await signUp({
            email: Array.isArray(email) ? email[0] : email || '',
            password,
            firstName,
            lastName,
            phone: phoneInfo,
            agreeToMarketing,
        });

        setIsLoading(false);

        if (!result.success) {
            setError(result.error || "Signup failed. Please try again.");
        }
    };

    const handlePhoneChange = (info: PhoneInfo | null) => {
        if (info) {
            setPhoneInfo(info);
        } else {
            setPhoneInfo({ ...defaultCountry, number: '' });
        }
        setIsPhoneValid(true);
    };

    const isContinueDisabled = !firstName || !lastName || !password || !phoneInfo.number || !agreeToTerms || isLoading;

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        <CustomText style={styles.title}>Create Account</CustomText>
                        <CustomText style={styles.subtitle}>
                            {"You're almost there! Create your new account for "}
                            <CustomText style={{ fontWeight: 'bold' }}>{email}</CustomText>
                        </CustomText>

                        {error && <CustomText style={styles.errorText}>{error}</CustomText>}

                        <CustomText style={styles.label}>First name</CustomText>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="John"
                            placeholderTextColor="#9ca3af"
                        />

                        <CustomText style={styles.label}>Last name</CustomText>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Smith"
                            placeholderTextColor="#9ca3af"
                        />

                        <CustomText style={styles.label}>Password</CustomText>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                                placeholder="Password"
                                placeholderTextColor="#9ca3af"
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <CustomText style={styles.label}>Mobile number</CustomText>
                        <View style={{marginBottom: 20}}>
                            <PhoneInput
                                value={phoneInfo}
                                onChangeInfo={handlePhoneChange}
                                isValid={isPhoneValid}
                                placeholder="6502137379"
                            />
                        </View>

                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                value={agreeToTerms}
                                onValueChange={setAgreeToTerms}
                                color={agreeToTerms ? '#007bff' : '#adb5bd'}
                            />
                            <View style={styles.checkboxLabelContainer}>
                                <CustomText style={styles.checkboxText}>I agree to the </CustomText>
                                <TouchableOpacity onPress={() => Linking.openURL('https://naadi.ma/privacy')}>
                                    <CustomText style={styles.linkText}>Privacy Policy</CustomText>
                                </TouchableOpacity>
                                <CustomText style={styles.checkboxText}>, </CustomText>
                                <TouchableOpacity onPress={() => Linking.openURL('https://naadi.ma/terms-of-use')}>
                                    <CustomText style={styles.linkText}>Terms of Use</CustomText>
                                </TouchableOpacity>
                                <CustomText style={styles.checkboxText}> and </CustomText>
                                 <TouchableOpacity onPress={() => Linking.openURL('https://naadi.ma/terms-of-service')}>
                                    <CustomText style={styles.linkText}>Terms of Service</CustomText>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                value={agreeToMarketing}
                                onValueChange={setAgreeToMarketing}
                                color={agreeToMarketing ? '#007bff' : '#adb5bd'}
                            />
                            <View style={styles.checkboxLabelContainer}>
                                <CustomText style={styles.checkboxText}>I do not wish to receive marketing notifications with offers and news</CustomText>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isContinueDisabled && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={isContinueDisabled}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <CustomText style={styles.buttonText}>Create Account</CustomText>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
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
        marginBottom: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 10,
        flex: 1,
    },
    checkboxText: {
        fontSize: 14,
    },
    linkText: {
        fontSize: 14,
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    button: {
        width: '100%',
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
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
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});
