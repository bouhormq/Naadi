import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Services({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="What services do you offer?"
      subtitle="Choose your primary and up to 3 related service types."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 5 - Services selection coming soon</CustomText>
    </StepTemplate>
  );
}
