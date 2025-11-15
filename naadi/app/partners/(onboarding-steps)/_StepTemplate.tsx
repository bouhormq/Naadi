import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from '@/components/CustomText';
import { Ionicons } from '@expo/vector-icons';

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nextButtonText?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export default function StepTemplate({
  onNext,
  onBack,
  title,
  subtitle,
  children,
  nextButtonText = 'Continue',
  isNextDisabled = false,
  isLoading = false,
}: StepProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText style={styles.title}>{title}</CustomText>
        {subtitle && <CustomText style={styles.subtitle}>{subtitle}</CustomText>}
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>{children}</View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {onBack && (
          <TouchableOpacity 
            style={[styles.backButton, isLoading && styles.buttonDisabled]} 
            onPress={onBack}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={20} color="#64748b" />
            <CustomText style={styles.backButtonText}>Back</CustomText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            (isNextDisabled || isLoading) && styles.buttonDisabled,
          ]}
          onPress={onNext}
          disabled={isNextDisabled || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <CustomText style={styles.nextButtonText}>{nextButtonText}</CustomText>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  mainContent: {
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
});
