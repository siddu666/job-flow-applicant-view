import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                         children,
                                                         requireAuth = true,
                                                         allowedRoles = []
                                                       }) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (loading || profileLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
    );
  }

  if (requireAuth && !user) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

    if (allowedRoles.length > 0  && allowedRoles[0] != user.id || '') {
        console.log(`User role not allowed, redirecting to /`);
        return <Navigate to="/" replace />;
    }

  /*// If allowedRoles is specified, check if user has the required role
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role || '')) {
    console.log(`User role ${profile.role} not allowed, redirecting to /`);
    return <Navigate to="/" replace />;
  }

  console.log(`User role ${profile.role} allowed, rendering children`); */
  return <>{children}</>;
};

export default ProtectedRoute;
