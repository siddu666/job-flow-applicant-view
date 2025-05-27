
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useHandlePeriodicResponse } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Briefcase } from "lucide-react";

const AccountResponse = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const response = searchParams.get("response") as "keep" | "remove";
  const [processed, setProcessed] = useState(false);
  const handleResponse = useHandlePeriodicResponse();

  useEffect(() => {
    if (token && response && !processed) {
      handleResponse.mutate({ token, response });
      setProcessed(true);
    }
  }, [token, response, processed, handleResponse]);

  if (!token || !response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Justera Group Careers</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <AlertCircle className="h-16 w-16 text-yellow-600" />
              </div>
              <CardTitle className="text-yellow-600">Invalid Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This link appears to be invalid or has expired.
              </p>
              <Link to="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Go to Homepage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isKeep = response === "keep";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Justera Group Careers</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              {isKeep ? (
                <CheckCircle className="h-16 w-16 text-green-600" />
              ) : (
                <XCircle className="h-16 w-16 text-red-600" />
              )}
            </div>
            <CardTitle className={isKeep ? "text-green-600" : "text-red-600"}>
              {isKeep ? "Account Kept Active" : "Account Deletion Scheduled"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {isKeep
                ? "Thank you for confirming! Your account will remain active and you'll continue to receive job opportunities that match your profile."
                : "We've received your request to delete your account. Your data will be permanently removed within 30 days as per GDPR requirements."
              }
            </p>
            
            {isKeep ? (
              <div className="space-y-2">
                <Link to="/auth">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign In to Your Account
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="w-full">
                    Browse Current Opportunities
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> If you change your mind, please contact us at{" "}
                  <a href="mailto:privacy@justeragroup.com" className="underline">
                    privacy@justeragroup.com
                  </a>{" "}
                  within 30 days.
                </p>
              </div>
            )}

            <Link to="/">
              <Button variant="ghost" className="w-full">
                Return to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountResponse;
