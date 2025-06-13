
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Code, Heart, Languages, Plus, X, Save, Edit, 
  FileText, Github, Linkedin 
} from 'lucide-react';
import { Profile } from '@/interfaces/Profile';
import { useUpdateProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface ProfileEditorProps {
  profile: Profile;
  onProfileUpdated: (updatedProfile: Profile) => void;
  onClose?: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ 
  profile, 
  onProfileUpdated, 
  onClose 
}) => {
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTool, setNewTool] = useState('');

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: string, value: string, setter: (value: string) => void) => {
    if (!value.trim()) return;
    
    const currentArray = formData[field as keyof Profile] as string[] || [];
    if (!currentArray.includes(value.trim())) {
      handleInputChange(field, [...currentArray, value.trim()]);
    }
    setter('');
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = formData[field as keyof Profile] as string[] || [];
    handleInputChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!profile.id) return;

    try {
      await updateProfile.mutateAsync({
        userId: profile.id,
        updates: formData
      });
      
      onProfileUpdated({ ...profile, ...formData } as Profile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const ArrayField = ({ 
    field, 
    label, 
    icon: Icon, 
    newValue, 
    setNewValue, 
    placeholder 
  }: {
    field: string;
    label: string;
    icon: React.ElementType;
    newValue: string;
    setNewValue: (value: string) => void;
    placeholder: string;
  }) => {
    const items = (formData[field as keyof Profile] as string[]) || [];
    
    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="h-4 w-4" />
          {label}
        </Label>
        <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 border rounded-md">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {item}
              {isEditing && (
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayRemove(field, index)}
                />
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleArrayAdd(field, newValue, setNewValue);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleArrayAdd(field, newValue, setNewValue)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Editor
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateProfile.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="current_location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="current_location"
                value={formData.current_location || ''}
                onChange={(e) => handleInputChange('current_location', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years || ''}
                onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Professional Summary</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Write a brief professional summary..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_position">Current Position</Label>
              <Input
                id="current_position"
                value={formData.current_position || ''}
                onChange={(e) => handleInputChange('current_position', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="current_company">Current Company</Label>
              <Input
                id="current_company"
                value={formData.current_company || ''}
                onChange={(e) => handleInputChange('current_company', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="github_url" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub URL
              </Label>
              <Input
                id="github_url"
                value={formData.github_url || ''}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="project_summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Project Summary
            </Label>
            <Textarea
              id="project_summary"
              value={formData.project_summary || ''}
              onChange={(e) => handleInputChange('project_summary', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Describe your key projects and achievements..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Technical Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Technical Skills & Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ArrayField
            field="skills"
            label="Technical Skills"
            icon={Code}
            newValue={newSkill}
            setNewValue={setNewSkill}
            placeholder="Add a skill (e.g., JavaScript, Python, React)"
          />
          <ArrayField
            field="tools"
            label="Tools & Software"
            icon={Code}
            newValue={newTool}
            setNewValue={setNewTool}
            placeholder="Add a tool (e.g., Docker, AWS, Git)"
          />
        </CardContent>
      </Card>

      {/* Education & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ArrayField
            field="education"
            label="Education"
            icon={GraduationCap}
            newValue={newEducation}
            setNewValue={setNewEducation}
            placeholder="Add education (e.g., Bachelor's in Computer Science, XYZ University)"
          />
          <ArrayField
            field="certifications"
            label="Certifications"
            icon={Award}
            newValue={newCert}
            setNewValue={setNewCert}
            placeholder="Add certification (e.g., AWS Solutions Architect)"
          />
        </CardContent>
      </Card>

      {/* Personal Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Personal Interests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ArrayField
            field="hobbies"
            label="Hobbies & Interests"
            icon={Heart}
            newValue={newHobby}
            setNewValue={setNewHobby}
            placeholder="Add hobby (e.g., Photography, Travel, Music)"
          />
          <ArrayField
            field="languages"
            label="Languages"
            icon={Languages}
            newValue={newLanguage}
            setNewValue={setNewLanguage}
            placeholder="Add language (e.g., English (Native), Spanish (Fluent))"
          />
        </CardContent>
      </Card>

      {onClose && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;
