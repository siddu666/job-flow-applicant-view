
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Edit, 
  User, 
  Briefcase, 
  Code, 
  GraduationCap,
  Award,
  Heart
} from 'lucide-react';
import { Profile } from '@/interfaces/Profile';
import { CVDataValidator } from '@/lib/cv-data-validator';

interface ProfileCompletionGuideProps {
  profile: Profile;
  onEdit: () => void;
}

const ProfileCompletionGuide: React.FC<ProfileCompletionGuideProps> = ({ 
  profile, 
  onEdit 
}) => {
  const validationResult = CVDataValidator.validateCVData(profile as any);
  const fieldCompleteness = CVDataValidator.getFieldCompleteness(profile as any);
  
  const completedFields = fieldCompleteness.filter(f => f.completed).length;
  const totalFields = fieldCompleteness.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'full_name':
      case 'email':
      case 'phone':
      case 'bio':
        return User;
      case 'current_position':
      case 'current_company':
      case 'work_experience':
      case 'project_summary':
        return Briefcase;
      case 'skills':
      case 'tools':
        return Code;
      case 'education':
        return GraduationCap;
      case 'certifications':
        return Award;
      case 'hobbies':
      case 'languages':
        return Heart;
      default:
        return Info;
    }
  };

  const getSectionStatus = (fields: string[]) => {
    const sectionFields = fieldCompleteness.filter(f => fields.includes(f.field));
    const completed = sectionFields.filter(f => f.completed).length;
    return { completed, total: sectionFields.length };
  };

  const sections = [
    {
      title: 'Personal Information',
      fields: ['full_name', 'email', 'phone', 'bio'],
      color: 'blue'
    },
    {
      title: 'Professional Profile',
      fields: ['current_position', 'current_company', 'work_experience', 'project_summary'],
      color: 'green'
    },
    {
      title: 'Technical Skills',
      fields: ['skills', 'tools'],
      color: 'purple'
    },
    {
      title: 'Education & Certifications',
      fields: ['education', 'certifications'],
      color: 'orange'
    },
    {
      title: 'Personal Interests',
      fields: ['hobbies', 'languages'],
      color: 'pink'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Profile Completion Guide
          </div>
          <Badge variant={completionPercentage >= 80 ? 'default' : 'secondary'}>
            {completionPercentage}% Complete
          </Badge>
        </CardTitle>
        <Progress value={completionPercentage} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Status */}
        {!validationResult.isValid && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Required Information Missing</span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validationResult.missingFields.map(field => (
                <li key={field}>• {field.replace('_', ' ').toUpperCase()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {validationResult.warnings.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Recommendations</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(section => {
            const status = getSectionStatus(section.fields);
            const isComplete = status.completed === status.total;
            
            return (
              <div key={section.title} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{section.title}</h4>
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="text-xs text-gray-500">
                      {status.completed}/{status.total}
                    </div>
                  )}
                </div>
                <Progress 
                  value={(status.completed / status.total) * 100} 
                  className="h-2" 
                />
              </div>
            );
          })}
        </div>

        {/* Field Details */}
        <div className="space-y-3">
          <h4 className="font-medium">Field Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {fieldCompleteness.map(field => {
              const Icon = getFieldIcon(field.field);
              return (
                <div 
                  key={field.field}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    field.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${
                    field.completed ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {field.field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {!field.completed && field.suggestion && (
                      <div className="text-xs text-gray-600">{field.suggestion}</div>
                    )}
                  </div>
                  {field.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions */}
        {validationResult.suggestions.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Suggestions to Improve Your Profile</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1 mb-3">
              {validationResult.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionGuide;
