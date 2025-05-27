
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import CandidateProfile from "@/components/CandidateProfile";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only applicants can access this profile page
  if (profile?.role !== 'applicant') {
    return <Navigate to="/admin" replace />;
  }

  return <CandidateProfile />;
};

export default Profile;
