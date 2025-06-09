import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';
import SkillManager from "@/components/ui/SkillDropdown";

interface ProfessionalInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({
                                                                     data,
                                                                     updateData,
                                                                     onNext,
                                                                     onPrev
                                                                   }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!data.skills || data.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill';
    }
    if (data.experience < 0) {
      newErrors.experience = 'Experience cannot be negative';
    }
    if (!data.preferredJobType) {
      newErrors.preferredJobType = 'Please select a preferred job type';
    }
    if (!data.availability) {
      newErrors.availability = 'Please select your availability';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    updateData({ skills });
    // Clear skills error when skills are added
    if (skills.length > 0 && errors.skills) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.skills;
        return newErrors;
      });
    }
  };

  return (
      <div className="space-y-6">
        {/* Skills */}
        <div className="space-y-2">
          <SkillManager
              selectedSkills={data.skills || []}
              onSkillsChange={handleSkillsChange}
          />
          {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Years of Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience *</Label>
            <Input
                id="experience"
                type="number"
                min="0"
                value={data.experience}
                onChange={(e) => updateData({ experience: parseInt(e.target.value) || 0 })}
                className={errors.experience ? 'border-red-500' : ''}
            />
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
          </div>

          {/* Preferred Job Type */}
          <div className="space-y-2">
            <Label>Preferred Job Type *</Label>
            <Select
                value={data.preferredJobType}
                onValueChange={(value) => updateData({ preferredJobType: value })}
            >
              <SelectTrigger className={errors.preferredJobType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredJobType && <p className="text-red-500 text-sm">{errors.preferredJobType}</p>}
          </div>
        </div>

        {/* Availability / Notice Period */}
        <div className="space-y-2">
          <Label>Availability / Notice Period *</Label>
          <Select
              value={data.availability}
              onValueChange={(value) => updateData({ availability: value })}
          >
            <SelectTrigger className={errors.availability ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Available Immediately</SelectItem>
              <SelectItem value="2-weeks">2 Weeks Notice</SelectItem>
              <SelectItem value="1-month">1 Month Notice</SelectItem>
              <SelectItem value="2-months">2 Months Notice</SelectItem>
              <SelectItem value="3-months">3+ Months Notice</SelectItem>
            </SelectContent>
          </Select>
          {errors.availability && <p className="text-red-500 text-sm">{errors.availability}</p>}
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label htmlFor="education">Education & Background</Label>
          <Textarea
              id="education"
              value={data.education}
              onChange={(e) => updateData({ education: e.target.value })}
              placeholder="Tell us about your educational background, certifications, or relevant courses..."
              rows={4}
          />
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

export default ProfessionalInfoStep;