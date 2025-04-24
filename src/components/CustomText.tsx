import React, { useEffect } from 'react';
import { Text, StyleSheet, Platform, View } from 'react-native';

const fontWeightToFontFamily = {
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
const splitTextByEmoji = (text: string) => {
  if (typeof text !== 'string') return [{ text, isEmoji: false }];
  const segments = text.split(emojiRegex).filter(Boolean);
  return segments.map(segment => ({
    text: segment,
    isEmoji: isEmoji(segment)
  }));
};

interface CustomTextProps {
  style?: any;
  children: React.ReactNode;
  fontWeight?: string | number;
  customEmojiFont?: string;
  [key: string]: any;
}

const CustomText: React.FC<CustomTextProps> = (props) => {
  const { style, children, fontWeight, customEmojiFont, ...otherProps } = props;
  const weightKey = typeof fontWeight === 'number' ? String(fontWeight) : (fontWeight || 'normal');
  const baseFontFamily = fontWeightToFontFamily[weightKey as keyof typeof fontWeightToFontFamily] || fontWeightToFontFamily['normal'];
  const emojiFont = customEmojiFont || EMOJI_FONT;
  const fontWeightStyle = fontWeight ? { fontWeight } : {};
  const baseTextStyle = { fontFamily: baseFontFamily, ...fontWeightStyle };
  const combinedStyle = StyleSheet.flatten([baseTextStyle, style]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof children === 'string' && isEmoji(children)) {
      console.log('Rendering emoji with font:', EMOJI_FONT);
    }
  }, [children]);

  if (typeof children !== 'string') {
    return (
      <Text style={combinedStyle} {...otherProps}>
        {children}
      </Text>
    );
  }

  const segments = splitTextByEmoji(children);

  if (Platform.OS === 'web') {
    const webStyle = StyleSheet.flatten([
      style,
      {
        fontFamily: `${baseFontFamily}, ${emojiFont}`,
        fontWeight: fontWeight // Apply fontWeight on web
      }
    ]);
    return (
      <Text style={webStyle} {...otherProps}>
        {children}
      </Text>
    );
  }

  if (segments.length === 1 && !segments[0].isEmoji) {
    return (
      <Text style={combinedStyle} {...otherProps}>
        {children}
      </Text>
    );
  }

  return (
    <Text style={StyleSheet.flatten([style, fontWeightStyle])} {...otherProps}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={{ fontFamily: segment.isEmoji ? emojiFont : baseFontFamily }}
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
};


export default CustomText;