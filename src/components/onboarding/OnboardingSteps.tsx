
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BasicInfoStep from './BasicInfoStep';
import PersonalInfoStep from './PersonalInfoStep';
import VisaWorkEligibilityStep from './VisaWorkEligibilityStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import ResumeLinksStep from './ResumeLinksStep';
import ReviewSubmitStep from './ReviewSubmitStep';

export interface OnboardingData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  
  // Personal Info
  phone: string;
  address: string;
  city: string;
  
  // Visa & Work Eligibility
  visaStatus: string;
  visaStatusOther?: string;
  authorizedToWork: boolean;
  
  // Professional Info
  skills: string[];
  experience: number;
  education: string;
  preferredJobType: string;
  availability: string;
  
  // Resume & Links
  cvFile?: File;
  linkedinUrl: string;
  portfolioUrl: string;
}

const steps = [
  { id: 1, title: 'Basic Info', description: 'Name, Email, Password' },
  { id: 2, title: 'Personal Information', description: 'Contact & Location' },
  { id: 3, title: 'Visa & Work Eligibility', description: 'Work Authorization' },
  { id: 4, title: 'Professional Info', description: 'Skills & Experience' },
  { id: 5, title: 'Resume & Links', description: 'CV Upload & Social Links' },
  { id: 6, title: 'Review & Submit', description: 'Final Review' },
];

const OnboardingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    visaStatus: '',
    authorizedToWork: false,
    skills: [],
    experience: 0,
    education: '',
    preferredJobType: '',
    availability: 'immediately',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={data} updateData={updateData} onNext={nextStep} />;
      case 2:
        return <PersonalInfoStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <VisaWorkEligibilityStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <ProfessionalInfoStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <ResumeLinksStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <ReviewSubmitStep data={data} onPrev={prevStep} goToStep={goToStep} />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of {steps.length}</span>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-4" />
          
          {/* Step Tracker */}
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer ${
                  step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => step.id < currentStep && goToStep(step.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.id < currentStep
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                <span className="text-xs mt-1 text-center hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingSteps;
