import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import CustomText from './CustomText';
import { Ionicons } from '@expo/vector-icons';

interface PartnerOnboardingStepsProps {
    steps: {
        address: boolean;
        website: boolean;
        services: boolean;
        team: boolean;
        hours: boolean;
    };
    onPressStep: (step: string) => void;
    isVisible: boolean;
    onClose: () => void;
}

export default function PartnerOnboardingSteps({ steps, onPressStep, isVisible, onClose }: PartnerOnboardingStepsProps) {
    const totalTasks = 5;
    const completedTasks = Object.values(steps).filter(Boolean).length;
    const progress = completedTasks / totalTasks;

    if (!isVisible || completedTasks === totalTasks) {
        return null;
    }

    const renderStep = (key: keyof typeof steps, label: string) => {
        const isCompleted = steps[key];
        return (
            <View style={styles.stepContainer} key={key}>
                <CustomText style={[
                    styles.stepLabel,
                    Platform.OS === 'web' ? ({ whiteSpace: 'nowrap' } as any) : undefined,
                ]}>{label}</CustomText>
                {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                ) : (
                    <TouchableOpacity style={styles.startButton} onPress={() => onPressStep(key)}>
                        <CustomText style={styles.startButtonText}>Start</CustomText>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flex: 1}}>
                        <CustomText style={styles.headerTitle}>Hi Partner, continue setting up</CustomText>
                        <CustomText style={styles.headerSubtitle}>your new account</CustomText>
                        <CustomText style={styles.headerProgress}>{completedTasks} of {totalTasks} tasks completed</CustomText>
                    </View>
                    <View style={styles.progressCircle}>
                        <CustomText style={styles.progressText}>{Math.round(progress * 100)}%</CustomText>
                    </View>
                </View>

                <View style={styles.stepsList}>
                    {renderStep('address', 'Add your business address')}
                    {renderStep('website', 'Add your business website')}
                    {renderStep('services', 'Set up your service list')}
                    {renderStep('team', 'Set up your team members')}
                    {renderStep('hours', 'Set your working hours for all locations')}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        zIndex: 1000,
        // Allow the panel to expand on wider screens to fit long step descriptions
        ...Platform.select({ web: { maxWidth: 900 }, default: { maxWidth: '95%' } as any }),
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#94a3b8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6366f1', // Indigo-500
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerProgress: {
        color: '#e0e7ff',
        fontSize: 12,
        marginTop: 4,
    },
    progressCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    stepsList: {
        gap: 12,
    },
    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
    },
    stepLabel: {
        fontSize: 14,
        color: '#334155',
        flexShrink: 0, // Prevent wrapping by letting the label keep its width
        flexGrow: 0,
        marginRight: 12,
        // On mobile, allow content to expand as needed; on web, non-wrapping is enforced in inline styles
    },
    startButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    startButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
});
