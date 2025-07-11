import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SocialLoginsScreen = () => {
    const router = useRouter();
    const [googleConnected, setGoogleConnected] = useState(false);
    const [facebookConnected, setFacebookConnected] = useState(false);
    const [appleConnected, setAppleConnected] = useState(false);

    const socialOptions = [
        {
            name: 'Google',
            icon: <Image source={require('../../../../(assets)/google.png')} style={styles.icon} />,
            connected: googleConnected,
            onToggle: setGoogleConnected,
        },
        {
            name: 'Facebook',
            icon: <Image source={require('../../../../(assets)/facebook.png')} style={styles.icon} />,
            connected: facebookConnected,
            onToggle: setFacebookConnected,
        },
        {
            name: 'Apple',
            icon: <Image source={require('../../../../(assets)/apple.png')} style={styles.icon} />,
            connected: appleConnected,
            onToggle: setAppleConnected,
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Social logins</Text>
            <View style={styles.container}>
                {socialOptions.map((option) => (
                    <View style={styles.optionRow} key={option.name}>
                        <View style={styles.iconContainer}>{option.icon}</View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>{option.name}</Text>
                            <Text style={styles.optionSubtitle}>
                                {option.connected ? 'Connected' : 'Not connected'}
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E9E9EA', true: '#81b0ff' }}
                            thumbColor={option.connected ? '#ffffff' : '#f4f3f4'}
                            ios_backgroundColor="#E9E9EA"
                            onValueChange={option.onToggle}
                            value={option.connected}
                        />
                    </View>
                ))}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    backButton: {
        padding: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginLeft: 16,
        marginTop: 15,
        marginBottom: 25,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 10,
        marginLeft: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    doneButton: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SocialLoginsScreen;
