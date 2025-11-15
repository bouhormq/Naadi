import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step9Photos({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Upload business photos"
      subtitle="Add photos to showcase your business and build trust with customers."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 9 - Photo upload coming soon</CustomText>
    </StepTemplate>
  );
}
