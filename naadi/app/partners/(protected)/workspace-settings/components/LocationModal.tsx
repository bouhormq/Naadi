import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, StyleSheet, Animated } from 'react-native';
import CustomText from '@/components/CustomText';
import { styles as sharedStyles } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import { PhoneInfo, countriesData } from '@/components/PhoneInput';

import Step1Basics from './steps/Step1Basics';
import Step2Services from './steps/Step2Services';
import Step3Location from './steps/Step3Location';
import Step4Hours from './steps/Step4Hours';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editing: any | null;
  // Legacy props (ignored in new wizard)
  name?: string;
  setName?: (text: string) => void;
  address?: string;
  setAddress?: (text: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function LocationModal({
  visible,
  onClose,
  onSave,
  editing
}: LocationModalProps) {
  const [step, setStep] = useState(1);
  
  // Step 1: Basics
  const [locationName, setLocationName] = useState('');
  const [contactNumber, setContactNumber] = useState<PhoneInfo | null>(null);
  const [email, setEmail] = useState('');

  // Step 2: Business Type
  const [primaryService, setPrimaryService] = useState<string | undefined>();
  const [relatedServices, setRelatedServices] = useState<string[]>([]);

  // Step 3: Location
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<{ address: string | null; location: { lat: number; lng: number } | null } | null>(null);
  const [noPhysicalLocation, setNoPhysicalLocation] = useState(false);

  // Step 4: Opening Hours
  const [openingHours, setOpeningHours] = useState<any>(
    DAYS.map(day => ({
      day,
      isOpen: !['Saturday', 'Sunday'].includes(day),
      open: '09:00',
      close: '17:00'
    }))
  );

  const progressAnim = useRef(new Animated.Value(0.25)).current;

  // Animate progress bar when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / 4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  // Reset or Populate on Open
  useEffect(() => {
    if (visible) {
      setStep(1);
      if (editing) {
        setLocationName(editing.name || '');
        
        // Try to parse phone number
        let initialPhone: PhoneInfo | null = null;
        if (editing.phone) {
            const country = countriesData.find(c => editing.phone.startsWith(c.dialCode));
            if (country) {
                initialPhone = {
                    ...country,
                    number: editing.phone.replace(country.dialCode, '')
                };
            }
        }
        setContactNumber(initialPhone);

        setEmail(editing.email || '');
        // Populate other fields if available in editing object
      } else {
        setLocationName('');
        setContactNumber(null);
        setEmail('');
        setPrimaryService(undefined);
        setRelatedServices([]);
        setLocationQuery('');
        setSelectedPlace(null);
        setNoPhysicalLocation(false);
        // Reset hours
        setOpeningHours(DAYS.map(day => ({
          day,
          isOpen: !['Saturday', 'Sunday'].includes(day),
          open: '09:00',
          close: '17:00'
        })));
      }
    }
  }, [visible, editing]);

  // --- Navigation ---
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSave = () => {
    const finalData = {
      name: locationName,
      phone: contactNumber ? `${contactNumber.dialCode}${contactNumber.number}` : '',
      email,
      services: { primary: primaryService, related: relatedServices },
      location: { address: locationQuery, ...selectedPlace, noPhysicalLocation },
      openingHours
    };
    onSave(finalData);
  };

  const isStepValid = () => {
    if (step === 1) return !!locationName;
    return true;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1Basics
            locationName={locationName}
            setLocationName={setLocationName}
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            email={email}
            setEmail={setEmail}
          />
        );
      case 2:
        return (
          <Step2Services
            primaryService={primaryService}
            setPrimaryService={setPrimaryService}
            relatedServices={relatedServices}
            setRelatedServices={setRelatedServices}
          />
        );
      case 3:
        return (
          <Step3Location
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            noPhysicalLocation={noPhysicalLocation}
            setNoPhysicalLocation={setNoPhysicalLocation}
          />
        );
      case 4:
        return (
          <Step4Hours
            openingHours={openingHours}
            setOpeningHours={setOpeningHours}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={sharedStyles.fullScreenModal}>
        <View style={[sharedStyles.modalHeader, { flexDirection: 'column', alignItems: 'stretch', paddingBottom: 0, height: 'auto' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                 <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
              
              {step > 1 && (
                <>
                  <View style={{ width: 1, height: 24, backgroundColor: '#e2e8f0', marginHorizontal: 8 }} />
                  <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
                     <Ionicons name="arrow-back" size={24} color="#0f172a" />
                  </TouchableOpacity>
                </>
              )}
            </View>

            <TouchableOpacity 
              onPress={step === 4 ? handleFinalSave : handleNext}
              disabled={!isStepValid()}
              style={{ padding: 4, opacity: isStepValid() ? 1 : 0.5 }}
            >
               <CustomText style={{ color: '#4f46e5', fontWeight: '600', fontSize: 16 }}>
                 {step === 4 ? 'Save' : 'Next'}
               </CustomText>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={{ height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <Animated.View style={{ 
              height: '100%', 
              backgroundColor: '#4f46e5', 
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }) 
            }} />
          </View>
        </View>

        <ScrollView contentContainerStyle={[sharedStyles.modalContent, { paddingBottom: 40 }]}>
           {renderStepContent()}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Styles are now mostly in the step components or sharedStyles
  // Keeping empty or minimal styles here if needed for the modal container
});

