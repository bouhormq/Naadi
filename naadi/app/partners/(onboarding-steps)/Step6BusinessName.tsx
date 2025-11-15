import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step6BusinessName({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="What's your business name?"
      subtitle="This is the brand name your clients will see."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 6 - Business name input coming soon</CustomText>
    </StepTemplate>
  );
}
