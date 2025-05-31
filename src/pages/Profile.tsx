
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import CandidateProfile from "@/components/CandidateProfile";
import JobRecommendations from "@/components/JobRecommendations";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CandidateProfile />
        </div>
        <div>
          <JobRecommendations />
        </div>
      </div>

      <DeleteUserDialog
        userId={user.id}
        userName={`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User'}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        isCurrentUser={true}
      />
    </div>
  );
};

export default Profile;
