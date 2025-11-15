import React from 'react';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step10StaffSetup({ onNext, onBack }: StepProps) {
  return (
    <StepTemplate
      title="Add your staff members"
      subtitle="Manage your team members and their availability."
      onNext={onNext}
      onBack={onBack}
    >
      <CustomText>Step 10 - Staff setup coming soon</CustomText>
    </StepTemplate>
  );
}
