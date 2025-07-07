import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Modal,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';
import i18n from '../utils/languageDetector/i18n';

interface Language {
    code: string;
    name: string;
    emoji: string;
}

const Footer: React.FC = () => {
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

    const languages: Language[] = [
        { code: 'en', name: 'English', emoji: '🇬🇧' },
        { code: 'fr', name: 'Français', emoji: '🇫🇷' },
        { code: 'ma', name: 'Darija', emoji: '🇲🇦' },
        { code: 'es', name: 'Español', emoji: '🇪🇸' },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
        const currentLangCode = i18n.language;
        return languages.find(lang => lang.code === currentLangCode) || languages[0];
    });

    const changeLanguage = (language: Language) => {
        setSelectedLanguage(language);
        setIsLanguageModalVisible(false);
        i18n.changeLanguage(language.code);
    };

    const toggleLanguageModal = () => {
        setIsLanguageModalVisible(!isLanguageModalVisible);
    };

    return (
        <>
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
        </>
    );
};

const styles = StyleSheet.create({
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

export default Footer;
