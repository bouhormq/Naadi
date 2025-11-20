import React from 'react';
import { View, TextInput } from 'react-native';
import CustomText from '@/components/CustomText';
import { styles as sharedStyles } from '../../styles';
import PhoneInput, { PhoneInfo } from '@/components/PhoneInput';
import { StyleSheet } from 'react-native';

interface Step1BasicsProps {
  locationName: string;
  setLocationName: (text: string) => void;
  contactNumber: PhoneInfo | null;
  setContactNumber: (info: PhoneInfo | null) => void;
  email: string;
  setEmail: (text: string) => void;
}

export default function Step1Basics({
  locationName,
  setLocationName,
  contactNumber,
  setContactNumber,
  email,
  setEmail
}: Step1BasicsProps) {
  return (
    <View>
      <CustomText style={styles.stepTitle}>About your business</CustomText>
      <View style={styles.sectionBox}>
        <CustomText style={styles.sectionHeader}>Basics</CustomText>
        
        <CustomText style={sharedStyles.label}>Location name</CustomText>
        <View style={sharedStyles.inputWrapper}>
          <TextInput 
            style={sharedStyles.input}
            value={locationName} 
            onChangeText={setLocationName} 
            placeholder="" 
          />
        </View>

        <CustomText style={sharedStyles.label}>Location contact number</CustomText>
        <View style={{ marginBottom: 16 }}>
          <PhoneInput
            value={contactNumber}
            onChangeInfo={setContactNumber}
            placeholder="Phone number"
            defaultCountryCode="MA"
          />
        </View>

        <CustomText style={sharedStyles.label}>Location email address</CustomText>
        <View style={sharedStyles.inputWrapper}>
          <TextInput 
            style={sharedStyles.input}
            value={email} 
            onChangeText={setEmail} 
            placeholder="" 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 24,
  },
});
