import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ActivityIndicator, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@naadi/ctx';

const LoadingDots = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animations = [dot1, dot2, dot3].map((dot, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 200),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.delay(600 - (index * 200)),
                ])
            )
        );

        Animated.parallel(animations).start();
    }, [dot1, dot2, dot3]);

    const animatedStyles = [dot1, dot2, dot3].map(dot => ({
        opacity: dot,
        transform: [{
            translateY: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
            })
        }]
    }));

    return (
        <View style={styles.loadingContainer}>
            <Animated.View style={[styles.dot, animatedStyles[0]]} />
            <Animated.View style={[styles.dot, animatedStyles[1]]} />
            <Animated.View style={[styles.dot, animatedStyles[2]]} />
        </View>
    );
};


export default function DeleteAccountFinalScreen() {
    const router = useRouter();
    const { session } = useSession();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!password) {
            setError('Password is required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // In a real app, you would call an API to re-authenticate and delete the user.
            // This is a mock implementation.
            console.log('Attempting to delete account for:', session?.email);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // On successful deletion from backend:
            router.replace('/(main)/(protected)/(tabs)/profile/delete-account/success');

        } catch (e: any) {
            setError(e.message || 'Failed to delete account. Please check your password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, styles.progressStepFilled]} />
                    <View style={[styles.progressBar, styles.progressStepFilled]} />
                    <View style={[styles.progressBar, styles.progressStepFilled]} />
                </View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.replace('/(main)/(protected)/(tabs)/profile/my-profile')}>
                        <Ionicons name="close" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.pageTitle}>Delete my account</Text>
                    <Text style={styles.title}>Confirm you are happy to proceed</Text>
                    <Text style={styles.subtitle}>Please note this is permanent and can't be undone. To confirm deleting your account, please enter your password below:</Text>

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.deleteButton, (loading || !password) && styles.disabledButton]}
                        onPress={handleDelete}
                        disabled={loading || !password}
                    >
                        {loading ? <LoadingDots /> : <Text style={styles.deleteButtonText}>Delete account</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    progressBarContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        marginHorizontal: 2,
    },
    progressStepFilled: {
        backgroundColor: '#a855f7',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    pageTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#888',
    },
    errorText: {
        color: 'red',
        marginTop: -8,
        marginBottom: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    deleteButton: {
        backgroundColor: '#d4163a',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#e57373',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 4,
    },
});
