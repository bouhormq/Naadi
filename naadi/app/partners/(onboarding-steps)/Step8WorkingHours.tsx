import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step8WorkingHours({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Set your working hours"
      subtitle="Let customers know when you're available for bookings."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 8 - Working hours setup coming soon</CustomText>
    </StepTemplate>
  );
}
