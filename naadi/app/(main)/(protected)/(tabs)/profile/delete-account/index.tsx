import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const reasons = [
    'I created this account by mistake',
    'I do not want to use the Naadi Marketplace anymore',
    "I can't find the venues or services I want",
    'Other',
];

export default function DeleteAccountReasonScreen() {
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, styles.progressStepFilled]} />
                    <View style={styles.progressBar} />
                    <View style={styles.progressBar} />
                </View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => router.replace('/(main)/(protected)/(tabs)/profile/my-profile')} style={[styles.headerButton, styles.closeButton]}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(main)/(protected)/(tabs)/profile/delete-account/confirm', params: { reason: selectedReason } })}
                            style={[styles.headerButton, styles.continueButton, !selectedReason && styles.disabledButton]}
                            disabled={!selectedReason}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.pageTitle}>Delete my account</Text>
                    <Text style={styles.title}>We'll be sorry to see you go</Text>
                    <Text style={styles.subtitle}>Can we change your mind? Drop us a line at <Text style={styles.email}>hello@naadi.ma</Text></Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Why do you wish to leave Naadi?</Text>
                        <Text style={styles.cardSubtitle}>Please let us know the reason for deleting your account.</Text>
                        {reasons.map((reason) => (
                            <TouchableOpacity key={reason} style={styles.radioOption} onPress={() => setSelectedReason(reason)}>
                                <View style={[styles.radio, selectedReason === reason && styles.radioSelected]}>
                                    {selectedReason === reason && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.radioLabel}>{reason}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
        borderWidth: 1,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    closeButton: {
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    continueButton: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
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
        marginBottom: 24,
    },
    email: {
        color: '#a855f7',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    radio: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioSelected: {
        borderColor: '#a855f7',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#a855f7',
    },
    radioLabel: {
        fontSize: 16,
        flex: 1,
    },
});
