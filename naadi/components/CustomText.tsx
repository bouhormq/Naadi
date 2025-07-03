import React from 'react';
import { Text, StyleSheet, Platform, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFonts } from 'expo-font';

const fontWeightToFontFamily: { [key: string]: string } = {
  'normal': 'SFProDisplay-Semibold',
  'bold': 'SFProDisplay-Bold',
  '100': 'SFProDisplay-Regular',
  '200': 'SFProDisplay-Regular',
  '300': 'SFProDisplay-Regular',
  '400': 'SFProDisplay-Regular',
  '500': 'SFProDisplay-Medium',
  '600': 'SFProDisplay-Semibold',
  '700': 'SFProDisplay-Bold',
  '800': 'SFProDisplay-Bold',
  '900': 'SFProDisplay-Bold',
};

const EMOJI_FONT = Platform.select({
  ios: 'AppleColorEmoji',
  android: 'AppleColorEmoji',
  web: 'AppleColorEmoji',
  default: 'AppleColorEmoji',
});

const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
const isEmoji = (text: string): boolean => {
  if (typeof text !== 'string') return false;
  return emojiRegex.test(text);
};

interface CustomTextProps extends TextProps {
  children?: React.ReactNode;
  fontWeight?: string | number;
  customEmojiFont?: string;
  [key: string]: any;
}

// Helper function to process children recursively (optional, but cleaner)
const processChildrenForTranslation = (children: React.ReactNode, t: Function): React.ReactNode => {
  return React.Children.map(children, (child) => {
    // If the child is a string, translate it
    if (typeof child === 'string') {
      return t(child);
    }
    // If the child is a React element with its own children, process them recursively
    // (This handles nested structures but might become complex)
    // if (React.isValidElement(child) && child.props.children) {
    //   return React.cloneElement(child, {
    //     ...child.props,
    //     children: processChildrenForTranslation(child.props.children, t),
    //   });
    // }
    // Otherwise, return the child as is (e.g., components like Animated.Text, null, numbers)
    return child;
  });
};

const CustomText: React.FC<CustomTextProps> = (props) => {
  const { style, children, fontWeight, customEmojiFont, ...otherProps } = props;
  const { t, i18n } = useTranslation();

  const [fontsLoaded, fontError] = useFonts({
    'SFProDisplay-Regular': require('../assets/fonts/SF-Pro-Display-Regular.otf'),
    'SFProDisplay-Medium': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    'SFProDisplay-Semibold': require('../assets/fonts/SF-Pro-Display-Semibold.otf'),
    'SFProDisplay-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
  });

  const weightKey = typeof fontWeight === 'number' ? String(fontWeight) : (fontWeight || 'normal');
  const fontFamily = fontWeightToFontFamily[weightKey] || fontWeightToFontFamily['normal'];

  // Process children: translate strings, leave others
  const processedChildren = processChildrenForTranslation(children, t);

  // Debugging: Log current language and children being processed
  if (typeof children === 'string' && children.trim() === 'for') { // Log specifically for " for "
      console.log(`CustomText Debug: Language='${i18n.language}', Processing child='${children}', Translation='${t(children)}'`);
  }

  const fontStyle = fontsLoaded && !fontError ? { fontFamily } : {};
  const combinedStyle = StyleSheet.flatten([style, fontStyle]);

  return (
    <Text style={combinedStyle} {...otherProps}>
      {processedChildren}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    color: '#000',
  },
});

export default CustomText;