import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

const statements = [
    "I know I won't be able to access my appointments, gift cards or memberships.",
    "I know I will no longer be able to book appointments via Naadi's Marketplace.",
];

export default function DeleteAccountConfirmScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [checked, setChecked] = useState<boolean[]>(Array(statements.length).fill(false));

    const allChecked = checked.every(Boolean);

    const handleCheck = (index: number) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, styles.progressStepFilled]} />
                    <View style={[styles.progressBar, styles.progressStepFilled]} />
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
                            onPress={() => router.push({ pathname: '/(main)/(protected)/(tabs)/profile/delete-account/final', params })}
                            style={[styles.headerButton, styles.continueButton, !allChecked && styles.disabledButton]}
                            disabled={!allChecked}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.pageTitle}>Delete my account</Text>
                    <Text style={styles.title}>Delete your Naadi account</Text>
                    <Text style={styles.subtitle}>This action will delete your account and you won't be able to retrieve it. Please confirm you understand by ticking the below statements:</Text>

                    <View style={styles.card}>
                        {statements.map((statement, index) => (
                            <TouchableOpacity key={statement} style={styles.checkboxContainer} onPress={() => handleCheck(index)}>
                                <Checkbox
                                    value={checked[index]}
                                    onValueChange={() => handleCheck(index)}
                                    color={checked[index] ? '#a855f7' : undefined}
                                    style={styles.checkbox}
                                />
                                <Text style={styles.checkboxLabel}>{statement}</Text>
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    checkbox: {
        marginRight: 12,
        marginTop: 2,
        width: 22,
        height: 22,
        borderRadius: 4,
    },
    checkboxLabel: {
        fontSize: 16,
        flex: 1,
    },
});
