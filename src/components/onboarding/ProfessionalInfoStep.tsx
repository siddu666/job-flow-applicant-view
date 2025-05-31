
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, X } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';

interface ProfessionalInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const skillSuggestions = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Angular', 'Vue.js',
  'PHP', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'AWS',
  'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
  'CI/CD', 'Git', 'Linux', 'DevOps', 'Machine Learning', 'Data Science', 'UI/UX Design',
  'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'
];

const jobTypes = [
  'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote', 'Hybrid'
];

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (data.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill';
    }
    if (!data.experience && data.experience !== 0) {
      newErrors.experience = 'Please specify years of experience';
    }
    if (!data.education.trim()) {
      newErrors.education = 'Please provide education information';
    }
    if (!data.preferredJobType) {
      newErrors.preferredJobType = 'Please select preferred job type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleSkillInputChange = (value: string) => {
    setSkillInput(value);
    if (value.trim()) {
      const filtered = skillSuggestions.filter(
        skill => 
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !data.skills.includes(skill)
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  const addSkill = (skill: string) => {
    if (!data.skills.includes(skill)) {
      updateData({ skills: [...data.skills, skill] });
    }
    setSkillInput('');
    setFilteredSkills([]);
  };

  const removeSkill = (skillToRemove: string) => {
    updateData({ skills: data.skills.filter(skill => skill !== skillToRemove) });
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="skills">Key Skills *</Label>
        <div className="relative">
          <Input
            id="skills"
            value={skillInput}
            onChange={(e) => handleSkillInputChange(e.target.value)}
            onKeyDown={handleSkillInputKeyDown}
            placeholder="Type skills and press Enter"
            className={errors.skills ? 'border-red-500' : ''}
          />
          {filteredSkills.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience *</Label>
        <Select 
          value={data.experience.toString()} 
          onValueChange={(value) => updateData({ experience: parseInt(value) })}
        >
          <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 years (Entry level)</SelectItem>
            <SelectItem value="1">1 year</SelectItem>
            <SelectItem value="2">2 years</SelectItem>
            <SelectItem value="3">3 years</SelectItem>
            <SelectItem value="4">4 years</SelectItem>
            <SelectItem value="5">5 years</SelectItem>
            <SelectItem value="6">6+ years</SelectItem>
            <SelectItem value="10">10+ years</SelectItem>
            <SelectItem value="15">15+ years</SelectItem>
          </SelectContent>
        </Select>
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education *</Label>
        <Textarea
          id="education"
          value={data.education}
          onChange={(e) => updateData({ education: e.target.value })}
          placeholder="e.g., Bachelor's in Computer Science, University of Stockholm"
          className={errors.education ? 'border-red-500' : ''}
        />
        {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredJobType">Preferred Job Type *</Label>
        <Select 
          value={data.preferredJobType} 
          onValueChange={(value) => updateData({ preferredJobType: value })}
        >
          <SelectTrigger className={errors.preferredJobType ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.preferredJobType && <p className="text-red-500 text-sm">{errors.preferredJobType}</p>}
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
