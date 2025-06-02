'use client'

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

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  data,
  onPrev,
  goToStep,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let userId = user?.id;

      // If no user (signup flow), create account first
      if (!userId) {
        await signUp(data.email, data.password, {
          role: 'applicant',
          first_name: data.firstName,
          last_name: data.lastName
        });

        // Get the newly created user
        const { data: { user: newUser } } = await supabase.auth.getUser();
        userId = newUser?.id;
      }

      if (!userId) {
        throw new Error('Failed to get user ID');
      }

      // Upload CV if provided
      let cvUrl = null;
      if (data.cvFile) {
        const fileExt = data.cvFile.name.split('.').pop();
        const fileName = `${userId}/cv.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, data.cvFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        cvUrl = publicUrl;
      }

      // Update or create complete profile
      const profileData = {
        id: userId,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        current_location: `${data.address}, ${data.city}`,
        work_authorization: data.authorizedToWork ? 'authorized' : 'not_authorized',
        visa_status: data.visaStatus === 'other' ? data.visaStatusOther : data.visaStatus,
        skills: data.skills,
        experience_years: data.experience,
        education: data.education,
        availability: data.availability,
        cv_url: cvUrl,
        linkedin_url: data.linkedinUrl,
        portfolio_url: data.portfolioUrl,
        role: 'applicant',
        job_seeking_status: 'actively_looking',
        willing_to_relocate: false,
        is_active: true,
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) throw profileError;

      toast.success('Profile completed successfully!');
      router.push('/profile');

    } catch (error: unknown) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h3>
        <p className="text-gray-600">Please review all information before submitting</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Name:</span> {data.firstName} {data.lastName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {data.email}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Contact Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => goToStep(2)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <div><span className="font-medium">Phone:</span> {data.phone}</div>
            <div><span className="font-medium">Address:</span> {data.address}</div>
            <div><span className="font-medium">City:</span> {data.city}</div>
          </div>
        </CardContent>
      </Card>

      {/* Work Authorization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Work Authorization</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><span className="font-medium">Visa Status:</span> {data.visaStatusOther || data.visaStatus}</div>
          <div><span className="font-medium">Authorized to Work:</span> {data.authorizedToWork ? 'Yes' : 'No'}</div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Professional Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => goToStep(4)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-medium">Experience:</span> {data.experience} years</div>
            <div><span className="font-medium">Education:</span> {data.education}</div>
          </div>
          <div><span className="font-medium">Preferred Job Type:</span> {data.preferredJobType}</div>
          <div><span className="font-medium">Availability:</span> {data.availability}</div>
          <div>
            <span className="font-medium">Skills:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume & Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Resume & Links</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => goToStep(5)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">CV:</span> 
            {data.cvFile ? data.cvFile.name : 'No file selected'}
          </div>
          {data.linkedinUrl && (
            <div><span className="font-medium">LinkedIn:</span> {data.linkedinUrl}</div>
          )}
          {data.portfolioUrl && (
            <div><span className="font-medium">Portfolio:</span> {data.portfolioUrl}</div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;