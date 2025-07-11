import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../utils/languageDetector/i18n';
import CustomText from './CustomText';

export interface Language {
    code: string;
    name: string;
    emoji: string;
}

export const languages: Language[] = [
    { code: 'en', name: 'English', emoji: '🇬🇧' },
    { code: 'fr', name: 'Français', emoji: '🇫🇷' },
    { code: 'ma', name: 'Darija', emoji: '🇲🇦' },
    { code: 'es', name: 'Español', emoji: '🇪🇸' },
];

interface LanguageSelectorProps {
  onSelectLanguage: (language: Language) => void;
  header?: React.ComponentType<any> | React.ReactElement | null | undefined;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage, header }) => {
    const selectedLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            ListHeaderComponent={header}
            renderItem={({ item: lang }) => (
                <TouchableOpacity
                    key={lang.code}
                    style={[
                        styles.languageOption,
                        selectedLanguage.code === lang.code && styles.selectedLanguage,
                    ]}
                    onPress={() => onSelectLanguage(lang)}
                >
                    <CustomText style={styles.languageOptionText}> {lang.emoji}  {lang.name}</CustomText>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
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

export default LanguageSelector;
