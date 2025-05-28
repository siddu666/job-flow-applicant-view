
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHandlePeriodicResponse } from "@/hooks/useProfile";

const AccountResponse = () => {
  const { handleResponse } = useHandlePeriodicResponse();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Response</CardTitle>
          <CardDescription>
            Thank you for your response regarding your account status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleResponse} className="w-full">
            Confirm Response
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountResponse;
