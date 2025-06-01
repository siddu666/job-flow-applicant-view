
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  user: {
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const generateCustomEmailTemplate = (data: EmailData) => {
  const { user, email_data } = data;
  const confirmationUrl = `${email_data.site_url}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Justera Group AB - Confirm Your Registration</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">JUSTERA GROUP AB</h1>
                <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Future Ready IT Solutions for Smarter Businesses</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Welcome${user.user_metadata.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h2>
                
                <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for joining our careers platform. We're excited to help you discover amazing opportunities with our innovative IT solutions company.
                </p>
                
                <p style="color: #475569; line-height: 1.6; margin: 0 0 30px 0;">
                    To complete your registration and start exploring career opportunities, please confirm your email address by clicking the button below:
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                        Confirm Your Email
                    </a>
                </div>
                
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                    If the button doesn't work, you can copy and paste this link into your browser:<br>
                    <a href="${confirmationUrl}" style="color: #2563eb; word-break: break-all;">${confirmationUrl}</a>
                </p>
                
                <!-- Company Info -->
                <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 40px;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">About Justera Group AB</h3>
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                        We are driven by our belief that smarter businesses make the world a better place. At Justera Group, we deliver intelligent IT solutions that propel businesses into the future.
                    </p>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1; min-width: 200px;">
                            <strong style="color: #1e293b;">Our Services:</strong>
                            <ul style="color: #475569; margin: 10px 0; padding-left: 20px;">
                                <li>IT Infrastructure & Integration</li>
                                <li>Cloud Solutions and Services</li>
                                <li>Software Development</li>
                                <li>IT Consultancy Services</li>
                                <li>Information Security Services</li>
                                <li>Industry Cyber Security</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px;">
                    <strong>Contact Us:</strong><br>
                    📧 shruti@justeragroup.com<br>
                    📞 +46734852217<br>
                    📍 Johannesbergsvagen 60, 191 38 Sollentuna, Sweden
                </p>
                
                <p style="color: #64748b; margin: 0; font-size: 12px;">
                    This email was sent because you signed up for a career account with Justera Group AB.<br>
                    If you didn't request this, you can safely ignore this email.
                </p>
                
                <div style="margin-top: 20px;">
                    <a href="https://justeragroup.com" style="color: #2563eb; text-decoration: none; font-size: 14px; margin: 0 10px;">Visit Our Website</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="https://justeragroup.com/careers" style="color: #2563eb; text-decoration: none; font-size: 14px; margin: 0 10px;">View All Jobs</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // For webhook verification, you'd typically verify the signature here
    const emailData: EmailData = JSON.parse(payload);
    
    // Generate custom email template
    const customTemplate = generateCustomEmailTemplate(emailData);
    
    // You would send this via your email provider (Resend, SendGrid, etc.)
    // For now, we'll just log it and return success
    console.log("Custom email template generated for:", emailData.user.email);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in custom-email function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
