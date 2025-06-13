
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Loader2 } from 'lucide-react';
import { CVGenerator, CVGenerationData } from '@/lib/cv-generator';
import { Profile } from '@/interfaces/Profile';
import { toast } from 'sonner';

interface CVGeneratorProps {
  candidate: Profile;
  onClose: () => void;
}

const CVGeneratorComponent: React.FC<CVGeneratorProps> = ({ candidate, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<string | null>(null);

  const generateCV = async () => {
    setIsGenerating(true);
    try {
      // Transform profile data to CV generation format
      const cvData: CVGenerationData = {
        personalInfo: {
          fullName: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
          email: candidate.email || '',
          phone: candidate.phone || undefined,
          location: candidate.current_location || undefined,
          linkedinUrl: candidate.linkedin_url || undefined,
          githubUrl: candidate.github_url || undefined,
          portfolioUrl: candidate.portfolio_url || undefined,
        },
        professionalSummary: {
          bio: candidate.bio || undefined,
          experienceYears: candidate.experience_years || undefined,
          currentPosition: candidate.current_position || undefined,
          currentCompany: candidate.current_company || undefined,
        },
        skills: candidate.skills || [],
        certifications: candidate.certifications || [],
        projects: candidate.project_summary ? [
          {
            name: 'Key Projects',
            description: candidate.project_summary,
          }
        ] : undefined,
      };

      const htmlCV = CVGenerator.generateJusterGroupCV(cvData);
      setGeneratedCV(htmlCV);
      toast.success('CV generated successfully!');
    } catch (error) {
      console.error('Error generating CV:', error);
      toast.error('Failed to generate CV');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCV = () => {
    if (!generatedCV) return;

    const blob = new Blob([generatedCV], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidate.first_name}_${candidate.last_name}_CV_JusterGroup.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const previewCV = () => {
    if (!generatedCV) return;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(generatedCV);
      newWindow.document.close();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          Generate Juster Group AB CV
          <Badge variant="secondary" className="bg-white/20 text-white">
            {candidate.first_name} {candidate.last_name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Candidate Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Candidate Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {candidate.first_name} {candidate.last_name}</p>
                <p><strong>Email:</strong> {candidate.email}</p>
                {candidate.phone && <p><strong>Phone:</strong> {candidate.phone}</p>}
                {candidate.current_location && <p><strong>Location:</strong> {candidate.current_location}</p>}
                {candidate.experience_years && <p><strong>Experience:</strong> {candidate.experience_years} years</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Skills Overview</h3>
              <div className="flex flex-wrap gap-1">
                {candidate.skills?.slice(0, 6).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {(candidate.skills?.length || 0) > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{(candidate.skills?.length || 0) - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* CV Generation Status */}
          <div className="text-center">
            {!generatedCV ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Generate a professional CV in Juster Group AB format using the candidate's profile information.
                </p>
                <Button
                  onClick={generateCV}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating CV...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Generate CV
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">CV Generated Successfully!</span>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={previewCV}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview CV
                  </Button>
                  <Button
                    onClick={downloadCV}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                </div>
                <Button
                  onClick={generateCV}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Regenerate CV
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVGeneratorComponent;
