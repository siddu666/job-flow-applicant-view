
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import JobPostForm from "@/components/JobPostForm";
import ApplicationReview from "@/components/ApplicationReview";
import EnhancedCandidateSearch from "@/components/admin/EnhancedCandidateSearch";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import { Users, Briefcase, FileText, Settings, Plus } from "lucide-react";
import { useJobStats } from "@/hooks/useJobs";
import { useApplicationStats } from "@/hooks/useApplications";
import { useAllCandidates } from "@/hooks/useProfile";

const Admin = () => {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const [showJobForm, setShowJobForm] = useState(false);
  const [deleteDialogUser, setDeleteDialogUser] = useState<{id: string, name: string} | null>(null);

  const { data: jobStats } = useJobStats();
  const { data: applicationStats } = useApplicationStats();
  const { data: candidates } = useAllCandidates();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  // Only admin, hr, and hiring_manager roles can access admin panel
  if (profile?.role === 'applicant') {
    window.location.href = '/';
    return null;
  }
  
  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteDialogUser({ id: userId, name: userName });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.first_name} {profile?.last_name} ({profile?.role})
              </span>
              <Button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobStats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {jobStats?.published || 0} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applicationStats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {applicationStats?.pending || 0} pending review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {candidates?.filter(c => c.job_seeking_status === 'actively_looking').length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {candidates?.length || 0} total candidates
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {applicationStats?.interview_scheduled || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {applicationStats?.under_review || 0} under review
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationReview />
          </TabsContent>

          <TabsContent value="candidates">
            <EnhancedCandidateSearch onDeleteUser={handleDeleteUser} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Post Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <JobPostForm onClose={() => setShowJobForm(false)} />
          </div>
        </div>
      )}

      {/* Delete User Dialog */}
      {deleteDialogUser && (
        <DeleteUserDialog
          userId={deleteDialogUser.id}
          userName={deleteDialogUser.name}
          isOpen={!!deleteDialogUser}
          onClose={() => setDeleteDialogUser(null)}
          isCurrentUser={false}
        />
      )}
    </div>
  );
};

export default Admin;
