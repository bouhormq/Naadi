import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2CurrentSoftware({ onNext, onBack }: Step2Props) {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | undefined>(data.currentSoftware);

  const softwareOptions = [
    'Acuity',
    'Booksy',
    'Gloss Genius',
    'Janeapp',
    'Square',
    'Mindbody',
    'Ovatu',
    'Phorест',
    'Salon Iris',
    'Setmore',
    'Shortcuts',
    'Square',
    'Styleseat',
    'Timely',
    'Vagaro',
    'Zenoti',
    "I'm not using any software",
    'Other',
  ];

  const handleSelect = (option: string) => {
    setSelected(option);
    updateData('currentSoftware', option);
  };

  const handleContinue = () => {
    if (selected) {
      onNext();
    }
  };

  return (
    <StepTemplate
      title="Which software are you currently using?"
      subtitle="If you're looking to switch, we can help speed up your business setup and import your data into your new Naadi account."
      onNext={handleContinue}
      onBack={onBack}
      isNextDisabled={!selected}
    >
      <ScrollView style={styles.container}>
        {softwareOptions.map((option) => (
          <View key={option} style={styles.optionWrapper} />
        ))}
      </ScrollView>
    </StepTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionWrapper: {
    height: 40,
    marginBottom: 8,
  },
});
