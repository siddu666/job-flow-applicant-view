'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                        At Justera Group, your privacy and data protection are of the utmost importance. This Privacy Policy explains how we collect, use, and protect your personal data in compliance with Swedish and EU laws, including the General Data Protection Regulation (GDPR).
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">1. Who We Are</h2>
                    <p>
                        Justera Group is a recruitment consultancy based in Stockholm, Sweden. We provide IT talent sourcing services and handle personal data in line with Swedish data protection laws.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">2. What Personal Data We Collect</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Full name</li>
                        <li>Contact information (email, phone number)</li>
                        <li>CV and professional background</li>
                        <li>IP address and session data</li>
                        <li>Messages and inquiries sent via our platform</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">3. Why We Collect Your Data</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>To match candidates with job opportunities</li>
                        <li>To communicate with candidates and clients</li>
                        <li>To improve our services</li>
                        <li>To comply with legal obligations</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">4. Legal Basis for Processing</h2>
                    <p>
                        We process your data under the following legal grounds:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Consent (when you submit forms or upload your CV)</li>
                        <li>Contractual obligation (when engaging with our services)</li>
                        <li>Legitimate interest (improving services and communication)</li>
                        <li>Legal compliance (as required by Swedish authorities)</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">5. Security & Compliance</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>GDPR Compliant:</strong> Full compliance with Swedish and EU data protection laws.</li>
                        <li><strong>Data Encryption:</strong> End-to-end encryption protects sensitive data in transit and at rest.</li>
                        <li><strong>Audit Logging:</strong> All user and admin data operations are logged securely.</li>
                        <li><strong>Rate Limiting:</strong> Requests are rate-limited to protect against abuse and brute force attacks.</li>
                        <li><strong>Input Validation:</strong> All input is validated and sanitized to prevent injection and XSS attacks.</li>
                        <li><strong>Session Management:</strong> Secure, expiring sessions with inactivity timeouts.</li>
                        <li><strong>File Upload Security:</strong> Uploaded files are scanned for malware and validated by type.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Access your data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request data deletion</li>
                        <li>Withdraw consent at any time</li>
                        <li>File a complaint with Datainspektionen (Swedish Authority for Privacy Protection)</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900">7. Data Retention</h2>
                    <p>
                        Personal data is retained only as long as necessary to fulfill the purposes for which it was collected, or to comply with legal and regulatory obligations.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900">8. Contact Us</h2>
                    <p>
                        For any questions or requests related to your personal data, please contact:
                    </p>
                    <p>
                        <strong>Email:</strong> hrteam@justeragroup.com<br />
                        <strong>Phone:</strong> +46 76 962 4470<br />
                        <strong>Address:</strong> Stockholm, Sweden
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
