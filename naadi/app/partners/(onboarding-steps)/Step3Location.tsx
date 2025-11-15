import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Location({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Set your location"
      subtitle="Add your business location so your clients can easily find you."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 3 - Location setup coming soon</CustomText>
    </StepTemplate>
  );
}
