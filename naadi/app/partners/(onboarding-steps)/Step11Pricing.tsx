import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step11Pricing({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Set your pricing"
      subtitle="Define your service packages and pricing."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 11 - Pricing setup coming soon</CustomText>
    </StepTemplate>
  );
}
