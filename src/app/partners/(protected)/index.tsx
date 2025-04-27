import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText'; // Assuming you have this component

export default function PartnerProtectedIndex() {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Partner Dashboard</CustomText>
      <CustomText>Welcome to the protected partner area.</CustomText>
      {/* Add your partner dashboard components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 