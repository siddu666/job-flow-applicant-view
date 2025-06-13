import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';
import { CVProcessingService } from '@/lib/cv-processing-service';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'rejected' | 'error'>('idle');
  const [extractedData, setExtractedData] = useState<any>(null);
  const { user } = useAuth();

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsProcessing(true);
    setProcessingStatus('processing');
    setErrors({});

    try {
      const cvProcessor = new CVProcessingService();
      const result = await cvProcessor.processCV(file, user.id);

      if (result.success && result.data) {
        setProcessingStatus('success');
        setExtractedData(result.data);
        updateData({ cvFile: file });
        toast.success('CV processed successfully! Profile information extracted.');
      } else if (result.rejected) {
        setProcessingStatus('rejected');
        setErrors({ 
          cvFile: `CV rejected: ${result.rejectionReason}. Please upload a CV with more detailed information about your skills and experience.`
        });
        toast.error('CV does not meet minimum requirements');
      } else {
        setProcessingStatus('error');
        setErrors({ cvFile: result.error || 'Failed to process CV' });
        toast.error('Failed to process CV');
      }
    } catch (error) {
      setProcessingStatus('error');
      setErrors({ cvFile: 'Failed to process CV. Please try again.' });
      toast.error('An error occurred while processing your CV');
      console.error('CV processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cvUpload">CV/Resume Upload</Label>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          processingStatus === 'success' ? 'border-green-300 bg-green-50' :
          processingStatus === 'rejected' ? 'border-red-300 bg-red-50' :
          processingStatus === 'error' ? 'border-red-300 bg-red-50' :
          'border-gray-300'
        }`}>
          <input
            type="file"
            id="cvUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
          <label htmlFor="cvUpload" className={`cursor-pointer ${isProcessing ? 'pointer-events-none' : ''}`}>
            {isProcessing ? (
              <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
            ) : processingStatus === 'success' ? (
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            ) : processingStatus === 'rejected' || processingStatus === 'error' ? (
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            )}
            
            <p className="text-sm text-gray-600">
              {isProcessing ? 'Processing your CV...' :
               processingStatus === 'success' ? 'CV processed successfully!' :
               processingStatus === 'rejected' ? 'CV rejected - please try another' :
               processingStatus === 'error' ? 'Processing failed - click to retry' :
               'Click to upload your CV/Resume'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, or DOCX (max 10MB)
            </p>
          </label>
          {data.cvFile && processingStatus === 'success' && (
            <div className="mt-3 flex items-center justify-center text-green-600">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm">{data.cvFile.name}</span>
            </div>
          )}
        </div>
        {errors.cvFile && <p className="text-red-500 text-sm">{errors.cvFile}</p>}
        
        {extractedData && processingStatus === 'success' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Extracted Information:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Name:</strong> {extractedData.full_name}</p>
              <p><strong>Email:</strong> {extractedData.email}</p>
              {extractedData.skills?.length > 0 && (
                <p><strong>Skills:</strong> {extractedData.skills.slice(0, 5).join(', ')}{extractedData.skills.length > 5 ? '...' : ''}</p>
              )}
              {extractedData.experience_years && (
                <p><strong>Experience:</strong> {extractedData.experience_years} years</p>
              )}
            </div>
          </div>
        )}
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