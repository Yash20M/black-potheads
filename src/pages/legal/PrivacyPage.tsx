import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalSection } from '@/components/legal/LegalSection';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="February 28, 2026">
      <div className="mb-8">
        <p className="text-foreground leading-relaxed">
          At BlackPotHeads, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{' '}
          <a href="https://blackpotheads.com" className="text-primary hover:underline">
            https://blackpotheads.com
          </a>{' '}
          and make purchases from us.
        </p>
      </div>

      <LegalSection number="1" title="Information We Collect">
        <h3 className="font-medium text-foreground text-lg mb-3">1.1 Personal Information</h3>
        <p>We collect personal information that you voluntarily provide to us when you:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create an account on our website</li>
          <li>Place an order for products</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact us for customer support</li>
          <li>Participate in surveys or promotions</li>
        </ul>
        <p className="mt-4">This information may include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Shipping and billing address</li>
          <li>Payment information (processed securely through Razorpay)</li>
        </ul>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">1.2 Automatically Collected Information</h3>
        <p>When you visit our website, we automatically collect certain information about your device, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Device identifiers</li>
        </ul>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">1.3 Cookies and Tracking Technologies</h3>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.
        </p>
      </LegalSection>

      <LegalSection number="2" title="How We Use Your Information">
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Improve our website, products, and services</li>
          <li>Send promotional emails and marketing communications (with your consent)</li>
          <li>Detect and prevent fraud or unauthorized transactions</li>
          <li>Comply with legal obligations and enforce our terms</li>
          <li>Analyze website usage and user behavior to enhance user experience</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="How We Share Your Information">
        <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:</p>
        
        <h3 className="font-medium text-foreground text-lg mb-3 mt-4">3.1 Service Providers</h3>
        <p>We share information with trusted third-party service providers who assist us in operating our website and conducting our business, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Payment processors (Razorpay) for secure payment processing</li>
          <li>Shipping and logistics partners for order delivery</li>
          <li>Email service providers for communication</li>
          <li>Analytics providers for website performance analysis</li>
        </ul>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">3.2 Legal Requirements</h3>
        <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities, such as:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Compliance with legal obligations</li>
          <li>Protection of our rights and property</li>
          <li>Prevention of fraud or illegal activities</li>
          <li>Protection of the safety of our users or the public</li>
        </ul>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">3.3 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, or sale of assets, your personal information may be transferred to the acquiring entity. We will notify you of any such change in ownership or control of your personal information.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Data Security">
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Secure Socket Layer (SSL) encryption for data transmission</li>
          <li>Secure payment processing through PCI-DSS compliant payment gateways</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Employee training on data protection practices</li>
        </ul>
        <p className="mt-4">
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Data Retention">
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
        </p>
        <p>
          When your information is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Your Rights and Choices">
        <p>You have the following rights regarding your personal information:</p>
        
        <h3 className="font-medium text-foreground text-lg mb-3 mt-4">6.1 Access and Correction</h3>
        <p>You have the right to access and update your personal information at any time by logging into your account or contacting us.</p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">6.2 Deletion</h3>
        <p>You may request deletion of your personal information, subject to certain legal obligations that may require us to retain certain data.</p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">6.3 Marketing Communications</h3>
        <p>You can opt out of receiving promotional emails by clicking the unsubscribe link in any marketing email or by contacting us directly.</p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">6.4 Cookies</h3>
        <p>You can manage cookie preferences through your browser settings. Note that disabling cookies may affect the functionality of our website.</p>
      </LegalSection>

      <LegalSection number="7" title="Third-Party Links">
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Children's Privacy">
        <p>
          Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete that information.
        </p>
      </LegalSection>

      <LegalSection number="9" title="International Data Transfers">
        <p>
          Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our website, you consent to such transfers.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date.
        </p>
        <p>
          Your continued use of our website after any changes constitutes your acceptance of the updated Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contact Us">
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg mt-4">
          <p className="font-medium text-foreground">BlackPotHeads</p>
          <p>Email: privacy@blackpotheads.com</p>
          <p>Support: support@blackpotheads.com</p>
          <p>Website: https://blackpotheads.com</p>
        </div>
      </LegalSection>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="font-display text-xl mb-4">Related Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/legal/terms"
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium text-foreground">Terms & Conditions</p>
            <p className="text-sm text-muted-foreground mt-1">Our terms of service</p>
          </Link>
          <Link
            to="/legal/refund-policy"
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium text-foreground">Refund Policy</p>
            <p className="text-sm text-muted-foreground mt-1">Returns and refunds</p>
          </Link>
          <Link
            to="/legal/shipping-policy"
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium text-foreground">Shipping Policy</p>
            <p className="text-sm text-muted-foreground mt-1">Delivery information</p>
          </Link>
        </div>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPage;
