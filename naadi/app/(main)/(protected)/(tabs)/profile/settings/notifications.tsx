import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NotificationSettingsScreen = () => {
    const router = useRouter();
    const [textMessageNotifications, setTextMessageNotifications] = useState(true);
    const [emailMarketingNotifications, setEmailMarketingNotifications] = useState(false);
    const [textMessageMarketingNotifications, setTextMessageMarketingNotifications] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Notification settings</Text>
            <View style={styles.container}>
                <View style={styles.optionRow}>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Text message appointment notifications</Text>
                        <Text style={styles.optionSubtitle}>Receive texts based on your sender's settings</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#E9E9EA', true: '#81b0ff' }}
                        thumbColor={textMessageNotifications ? '#ffffff' : '#f4f3f4'}
                        ios_backgroundColor="#E9E9EA"
                        onValueChange={setTextMessageNotifications}
                        value={textMessageNotifications}
                    />
                </View>
                <View style={styles.optionRow}>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Email marketing notifications</Text>
                        <Text style={styles.optionSubtitle}>Receive offers and news via email</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#E9E9EA', true: '#81b0ff' }}
                        thumbColor={emailMarketingNotifications ? '#ffffff' : '#f4f3f4'}
                        ios_backgroundColor="#E9E9EA"
                        onValueChange={setEmailMarketingNotifications}
                        value={emailMarketingNotifications}
                    />
                </View>
                <View style={styles.optionRow}>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Text message marketing notifications</Text>
                        <Text style={styles.optionSubtitle}>If you opted out previously by texting STOP, please reply with START to opt back in</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#E9E9EA', true: '#81b0ff' }}
                        thumbColor={textMessageMarketingNotifications ? '#ffffff' : '#f4f3f4'}
                        ios_backgroundColor="#E9E9EA"
                        onValueChange={setTextMessageMarketingNotifications}
                        value={textMessageMarketingNotifications}
                    />
                </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    optionTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default NotificationSettingsScreen;
