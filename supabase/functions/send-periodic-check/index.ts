
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

const generatePeriodicCheckEmail = (fullName: string, token: string): EmailData => {
  const baseUrl = Deno.env.get("SITE_URL") || "https://your-domain.com";
  
  return {
    to: "",
    subject: "Account Activity Check - Justera Group Careers",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Account Activity Check</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; margin: 10px; background: #1e40af; color: white; text-decoration: none; border-radius: 6px; }
            .button.secondary { background: #dc2626; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Justera Group Careers</h1>
              <p>Account Activity Check</p>
            </div>
            
            <div class="content">
              <p>Hello ${fullName},</p>
              
              <p>We hope this email finds you well. As part of our commitment to data protection and GDPR compliance, we're reaching out to check if you're still interested in keeping your account active with Justera Group Careers.</p>
              
              <p>Your account contains your professional profile, CV, and application history. To help us maintain up-to-date records, please let us know your preference:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/account-response?token=${token}&response=keep" class="button">
                  Keep My Account Active
                </a>
                <a href="${baseUrl}/account-response?token=${token}&response=remove" class="button secondary">
                  Remove My Account
                </a>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>If you choose to keep your account active, no action is needed beyond clicking the button above</li>
                <li>If you choose to remove your account, all your data will be permanently deleted within 30 days</li>
                <li>If we don't hear from you within 30 days, we'll send one more reminder</li>
              </ul>
              
              <p>This email is sent in compliance with GDPR regulations to ensure we only keep data for users who wish to remain active on our platform.</p>
              
              <p>Thank you for your time.</p>
              
              <p>Best regards,<br>
              The Justera Group Careers Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>For questions, contact us at privacy@justeragroup.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active candidates (not checked in last 2 months)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const { data: candidates, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "applicant")
      .eq("anonymized", false)
      .or(`last_activity_check.is.null,last_activity_check.lt.${twoMonthsAgo.toISOString()}`);

    if (error) {
      throw new Error(`Failed to fetch candidates: ${error.message}`);
    }

    let emailsSent = 0;

    for (const candidate of candidates) {
      const token = crypto.randomUUID();
      
      // Store the token for this check
      await supabase
        .from("activity_check_tokens")
        .insert({
          user_id: candidate.id,
          token: token,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      const emailData = generatePeriodicCheckEmail(candidate.full_name || "User", token);
      emailData.to = candidate.email;

      // In a real implementation, you would send the email here
      // For now, we'll just log it
      console.log(`Would send periodic check email to: ${candidate.email}`);
      
      // Update last activity check date
      await supabase
        .from("profiles")
        .update({ last_activity_check: new Date().toISOString() })
        .eq("id", candidate.id);

      emailsSent++;
    }

    return new Response(JSON.stringify({ sent: emailsSent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-periodic-check function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
