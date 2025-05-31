
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';

interface VisaWorkEligibilityStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const visaOptions = [
  { value: 'citizen', label: 'Citizen of Sweden/EU' },
  { value: 'permanent', label: 'Permanent Residency (PUT)' },
  { value: 'work_permit', label: 'Work Permit (Arbetstillstånd)' },
  { value: 'job_seeker', label: 'Job Seeker Visa' },
  { value: 'dependent', label: 'Dependent Visa' },
  { value: 'student', label: 'Student Visa' },
  { value: 'asylum', label: 'Asylum Seeker' },
  { value: 'other', label: 'Other' },
];

const VisaWorkEligibilityStep: React.FC<VisaWorkEligibilityStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!data.visaStatus) {
      newErrors.visaStatus = 'Please select your visa status';
    }
    if (data.visaStatus === 'other' && !data.visaStatusOther?.trim()) {
      newErrors.visaStatusOther = 'Please specify your visa status';
    }
    if (!data.authorizedToWork) {
      newErrors.authorizedToWork = 'Please confirm your work authorization';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="visaStatus">Visa/Residency Status *</Label>
        <Select 
          value={data.visaStatus} 
          onValueChange={(value) => updateData({ visaStatus: value })}
        >
          <SelectTrigger className={errors.visaStatus ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your status" />
          </SelectTrigger>
          <SelectContent>
            {visaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.visaStatus && <p className="text-red-500 text-sm">{errors.visaStatus}</p>}
      </div>

      {data.visaStatus === 'other' && (
        <div className="space-y-2">
          <Label htmlFor="visaStatusOther">Please specify *</Label>
          <Textarea
            id="visaStatusOther"
            value={data.visaStatusOther || ''}
            onChange={(e) => updateData({ visaStatusOther: e.target.value })}
            placeholder="Describe your visa/residency status"
            className={errors.visaStatusOther ? 'border-red-500' : ''}
          />
          {errors.visaStatusOther && <p className="text-red-500 text-sm">{errors.visaStatusOther}</p>}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="authorizedToWork"
            checked={data.authorizedToWork}
            onCheckedChange={(checked) => updateData({ authorizedToWork: !!checked })}
          />
          <Label htmlFor="authorizedToWork" className="text-sm">
            I am authorized to work in Sweden *
          </Label>
        </div>
        {errors.authorizedToWork && <p className="text-red-500 text-sm">{errors.authorizedToWork}</p>}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This information helps employers understand your work eligibility status. 
          All visa statuses are welcome to apply for positions that match their authorization level.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default VisaWorkEligibilityStep;
