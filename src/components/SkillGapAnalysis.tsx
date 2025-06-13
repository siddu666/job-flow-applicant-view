
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Plus, X, CheckCircle, TrendingUp } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  required_skills: string[];
  preferred_skills?: string[];
  experience_required?: number;
}

interface SkillGapAnalysisProps {
  job: Job;
  userSkills: string[];
  userExperience?: number;
  onSkillsUpdated: (newSkills: string[]) => void;
  onExperienceUpdated: (experience: number) => void;
  onClose: () => void;
}

const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  job,
  userSkills,
  userExperience = 0,
  onSkillsUpdated,
  onExperienceUpdated,
  onClose
}) => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [experienceInput, setExperienceInput] = useState(userExperience.toString());
  const [experienceDescription, setExperienceDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate missing skills
  const missingRequiredSkills = job.required_skills.filter(
    skill => !userSkills.includes(skill) && !newSkills.includes(skill)
  );
  
  const missingPreferredSkills = (job.preferred_skills || []).filter(
    skill => !userSkills.includes(skill) && !newSkills.includes(skill) && !job.required_skills.includes(skill)
  );

  const hasExperienceGap = job.experience_required && userExperience < job.experience_required;

  const addNewSkill = () => {
    if (newSkillInput.trim() && !newSkills.includes(newSkillInput.trim())) {
      setNewSkills([...newSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const removeNewSkill = (skillToRemove: string) => {
    setNewSkills(newSkills.filter(skill => skill !== skillToRemove));
  };

  const addMissingSkill = (skill: string) => {
    if (!newSkills.includes(skill)) {
      setNewSkills([...newSkills, skill]);
    }
  };

  const updateProfileWithNewInfo = async () => {
    if (!user?.id) return;

    setIsUpdating(true);
    try {
      const updatedSkills = [...userSkills, ...newSkills];
      const updatedExperience = parseInt(experienceInput) || userExperience;

      await updateProfile.mutateAsync({
        userId: user.id,
        updates: {
          skills: updatedSkills,
          experience_years: updatedExperience,
          ...(experienceDescription && { bio: experienceDescription })
        }
      });

      onSkillsUpdated(updatedSkills);
      onExperienceUpdated(updatedExperience);
      
      toast.success('Profile updated successfully! You can now apply for this job.');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const hasGaps = missingRequiredSkills.length > 0 || hasExperienceGap;
  const canProceed = missingRequiredSkills.length === 0 && (!job.experience_required || parseInt(experienceInput) >= job.experience_required);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className={`text-white ${hasGaps ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
        <CardTitle className="flex items-center gap-3">
          {hasGaps ? (
            <AlertTriangle className="h-6 w-6" />
          ) : (
            <CheckCircle className="h-6 w-6" />
          )}
          {hasGaps ? 'Skill Gap Analysis' : 'Ready to Apply!'}
          <Badge variant="secondary" className="bg-white/20 text-white">
            {job.title}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {hasGaps ? (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-medium mb-2">
                We've identified some gaps between your current profile and this job's requirements.
              </p>
              <p className="text-orange-700 text-sm">
                Add the missing skills and experience to your profile to improve your application.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                Great! Your profile matches this job's requirements. You're ready to apply!
              </p>
            </div>
          )}

          {/* Missing Required Skills */}
          {missingRequiredSkills.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Missing Required Skills ({missingRequiredSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {missingRequiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="destructive"
                    className="cursor-pointer hover:bg-red-600"
                    onClick={() => addMissingSkill(skill)}
                  >
                    {skill}
                    <Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Click on a skill above to add it to your profile, or add custom skills below.
              </p>
            </div>
          )}

          {/* Missing Preferred Skills */}
          {missingPreferredSkills.length > 0 && (
            <div>
              <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Missing Preferred Skills ({missingPreferredSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {missingPreferredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => addMissingSkill(skill)}
                  >
                    {skill}
                    <Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                These skills would strengthen your application but aren't required.
              </p>
            </div>
          )}

          {/* Experience Gap */}
          {hasExperienceGap && (
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Experience Requirement
              </h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-800 mb-2">
                  <strong>Required:</strong> {job.experience_required} years
                </p>
                <p className="text-red-700">
                  <strong>Your current:</strong> {userExperience} years
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience">Update Your Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={experienceInput}
                    onChange={(e) => setExperienceInput(e.target.value)}
                    min="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="experience-desc">Describe Your Experience</Label>
                  <Textarea
                    id="experience-desc"
                    value={experienceDescription}
                    onChange={(e) => setExperienceDescription(e.target.value)}
                    placeholder="Describe your relevant experience, projects, or education that contributes to your qualifications..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Add New Skills */}
          <div>
            <h3 className="font-semibold text-blue-700 mb-3">Add Skills to Your Profile</h3>
            <div className="flex gap-2 mb-3">
              <Input
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Enter a skill (e.g., React, Python, Project Management)"
                onKeyDown={(e) => e.key === 'Enter' && addNewSkill()}
              />
              <Button onClick={addNewSkill} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {newSkills.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Skills to add to your profile:</p>
                <div className="flex flex-wrap gap-2">
                  {newSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                        onClick={() => removeNewSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {(newSkills.length > 0 || experienceInput !== userExperience.toString()) && (
                <Button
                  onClick={updateProfileWithNewInfo}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              )}
              {canProceed && (
                <Button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillGapAnalysis;
