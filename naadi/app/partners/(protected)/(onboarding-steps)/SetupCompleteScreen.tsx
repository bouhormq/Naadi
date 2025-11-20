import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import CustomText from '@/components/CustomText';

interface SetupCompleteScreenProps {
  onNext: () => void;
  loading: boolean;
}

export default function SetupCompleteScreen({ onNext, loading }: SetupCompleteScreenProps) {
  const hasCalledNext = React.useRef(false);

  useEffect(() => {
    // Auto-proceed after 2 seconds
    const timer = setTimeout(() => {
      if (!loading && !hasCalledNext.current) {
        hasCalledNext.current = true;
        onNext();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, onNext]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* Success checkmark */}
        <View style={styles.checkmarkContainer}>
          <CustomText style={styles.checkmark}>✓</CustomText>
        </View>

        {/* Main message */}
        <CustomText style={styles.title}>Your business is set up</CustomText>

        {/* Subtitle */}
        <CustomText style={styles.subtitle}>
          Great! Your business profile is ready. You can now access your dashboard.
        </CustomText>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563eb" />
            <CustomText style={styles.loadingText}>Redirecting to dashboard...</CustomText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d4edda',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 40,
    color: '#28a745',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 21,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748b',
  },
  onboardingGif: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});
