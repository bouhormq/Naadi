import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import LanguageSelector, { Language } from '@naadi/components/LanguageSelector';
import i18n from '@naadi/utils/languageDetector/i18n';
import { Ionicons } from '@expo/vector-icons';

const LanguageScreen = () => {
    const router = useRouter();

    const handleSelectLanguage = (language: Language) => {
        i18n.changeLanguage(language.code);
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <LanguageSelector
                onSelectLanguage={handleSelectLanguage}
                header={
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Languages</Text>
                    </>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 15,
    },
});

export default LanguageScreen;
