
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Edit, CheckCircle, FileText } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ReviewSubmitStepProps {
  data: OnboardingData;
  onPrev: () => void;
  goToStep: (step: number) => void;
}

const visaStatusLabels: Record<string, string> = {
  citizen: 'Citizen of Sweden/EU',
  permanent: 'Permanent Residency (PUT)',
  work_permit: 'Work Permit (Arbetstillstånd)',
  job_seeker: 'Job Seeker Visa',
  dependent: 'Dependent Visa',
  student: 'Student Visa',
  asylum: 'Asylum Seeker',
  other: 'Other',
};

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data, onPrev, goToStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let cvUrl = '';
      
      // Upload CV if provided
      if (data.cvFile) {
        const fileExt = data.cvFile.name.split('.').pop();
        const fileName = `${user.id}/cv.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, data.cvFile);
        
        if (uploadError) {
          console.error('CV upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
          cvUrl = publicUrl;
        }
      }

      // Update the user profile with all the collected data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          current_location: `${data.address}, ${data.city}`,
          skills: data.skills,
          experience_years: data.experience,
          bio: data.education,
          cv_url: cvUrl || null,
          linkedin_url: data.linkedinUrl || null,
          portfolio_url: data.portfolioUrl || null,
          job_seeking_status: 'actively_looking',
          willing_to_relocate: false,
          availability: data.availability || 'immediately',
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      toast.success('Profile completed successfully!');
      router.push('/profile');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred while updating your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>
        <p className="text-gray-600">Please review all details before submitting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
            <p><strong>Email:</strong> {data.email}</p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(2)}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>City:</strong> {data.city}</p>
          </CardContent>
        </Card>

        {/* Visa & Work Eligibility */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Eligibility</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong>Status:</strong> {visaStatusLabels[data.visaStatus] || data.visaStatus}</p>
            {data.visaStatusOther && (
              <p><strong>Details:</strong> {data.visaStatusOther}</p>
            )}
            <p><strong>Work Authorization:</strong> {data.authorizedToWork ? 'Yes' : 'No'}</p>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professional Info</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(4)}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Experience:</strong> {data.experience} years</p>
            <p><strong>Job Type:</strong> {data.preferredJobType}</p>
            <p><strong>Availability:</strong> {data.availability}</p>
            <div>
              <strong>Skills:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {data.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume & Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resume & Links</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => goToStep(5)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {data.cvFile && (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-green-600" />
              <span><strong>CV:</strong> {data.cvFile.name}</span>
            </div>
          )}
          {data.linkedinUrl && (
            <p><strong>LinkedIn:</strong> {data.linkedinUrl}</p>
          )}
          {data.portfolioUrl && (
            <p><strong>Portfolio:</strong> {data.portfolioUrl}</p>
          )}
          {!data.cvFile && !data.linkedinUrl && !data.portfolioUrl && (
            <p className="text-gray-500">No files or links added</p>
          )}
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Ready to submit!</strong> Your profile will be updated and you can start 
          applying for jobs immediately.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Updating Profile...' : 'Complete Profile'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
