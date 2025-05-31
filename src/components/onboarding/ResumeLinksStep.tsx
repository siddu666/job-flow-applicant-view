
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Upload, FileText } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';

interface ResumeLinksStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ResumeLinksStep: React.FC<ResumeLinksStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (data.linkedinUrl && !isValidUrl(data.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }
    if (data.portfolioUrl && !isValidUrl(data.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid portfolio URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ cvFile: 'Please upload a PDF or Word document' });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ cvFile: 'File size must be less than 10MB' });
        return;
      }

      updateData({ cvFile: file });
      setErrors({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cvUpload">CV/Resume Upload</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="cvUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="cvUpload" className="cursor-pointer">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload your CV/Resume
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, or DOCX (max 10MB)
            </p>
          </label>
          {data.cvFile && (
            <div className="mt-3 flex items-center justify-center text-green-600">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm">{data.cvFile.name}</span>
            </div>
          )}
        </div>
        {errors.cvFile && <p className="text-red-500 text-sm">{errors.cvFile}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
        <Input
          id="linkedinUrl"
          type="url"
          value={data.linkedinUrl}
          onChange={(e) => updateData({ linkedinUrl: e.target.value })}
          placeholder="https://linkedin.com/in/yourprofile"
          className={errors.linkedinUrl ? 'border-red-500' : ''}
        />
        {errors.linkedinUrl && <p className="text-red-500 text-sm">{errors.linkedinUrl}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl">Portfolio URL (Optional)</Label>
        <Input
          id="portfolioUrl"
          type="url"
          value={data.portfolioUrl}
          onChange={(e) => updateData({ portfolioUrl: e.target.value })}
          placeholder="https://yourportfolio.com"
          className={errors.portfolioUrl ? 'border-red-500' : ''}
        />
        {errors.portfolioUrl && <p className="text-red-500 text-sm">{errors.portfolioUrl}</p>}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong> Having a complete profile with CV and LinkedIn helps employers 
          find and evaluate you more effectively.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Review & Submit
        </Button>
      </div>
    </div>
  );
};

export default ResumeLinksStep;
