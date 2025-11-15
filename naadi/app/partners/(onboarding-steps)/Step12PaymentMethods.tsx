import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step12PaymentMethods({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Add payment methods"
      subtitle="Connect your payment methods to receive payments."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 12 - Payment methods coming soon</CustomText>
    </StepTemplate>
  );
}
