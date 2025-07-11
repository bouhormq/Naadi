import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@naadi/ctx';

export default function DeleteAccountSuccessScreen() {
    const router = useRouter();
    const { signOut } = useSession();

    const handleClose = () => {
        signOut();
        router.replace('/(main)/onboarding');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark" size={40} color="#fff" />
                </View>
                <Text style={styles.title}>Your account has been deleted</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'flex-end', padding: 16 },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#a855f7', // Purple color
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        maxWidth: 300,
    },
});
