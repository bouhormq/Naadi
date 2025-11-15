import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step7BusinessDescription({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Describe your business"
      subtitle="Tell potential clients about your business and what makes you special."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 7 - Business description coming soon</CustomText>
    </StepTemplate>
  );
}
