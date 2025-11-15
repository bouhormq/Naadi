import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4TeamSize({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="What's your team size?"
      subtitle="This will help us set up your calendar correctly."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 4 - Team size selection coming soon</CustomText>
    </StepTemplate>
  );
}
