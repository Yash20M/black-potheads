import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalSection } from '@/components/legal/LegalSection';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="February 28, 2026">
      <div className="mb-8">
        <p className="text-foreground leading-relaxed">
          Welcome to BlackPotHeads. By accessing or using our website{' '}
          <a href="https://blackpotheads.com" className="text-primary hover:underline">
            https://blackpotheads.com
          </a>
          , you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchase.
        </p>
      </div>

      <LegalSection number="1" title="Acceptance of Terms">
        <p>
          By accessing and placing an order with BlackPotHeads, you confirm that you are in agreement with and bound by the terms and conditions contained in these Terms. If you do not agree to these terms, please do not use this website.
        </p>
        <p>
          You must be at least 18 years of age to use our services and make purchases on our platform.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Use of Website">
        <p>You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the website.</p>
        <p>Prohibited activities include but are not limited to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Using the website in any way that causes damage to the website or impairs its availability</li>
          <li>Using the website in any fraudulent manner or in connection with any criminal offense</li>
          <li>Copying, reproducing, or exploiting any part of the website without our express written permission</li>
          <li>Attempting to gain unauthorized access to our systems or networks</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Product Information">
        <p>
          We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, colors, or other content available on the website are accurate, complete, reliable, current, or error-free.
        </p>
        <p>
          All products are subject to availability. We reserve the right to discontinue any product at any time without prior notice.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Pricing and Payment">
        <p>
          All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated.
        </p>
        <p>
          We reserve the right to change prices at any time without prior notice. However, changes will not affect orders that have already been confirmed.
        </p>
        <p>
          Payment is processed securely through Razorpay. We accept credit cards, debit cards, UPI, net banking, and other payment methods supported by Razorpay.
        </p>
        <p>
          By providing payment information, you represent and warrant that you are authorized to use the payment method and authorize us to charge the total amount of your order.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Order Acceptance">
        <p>
          Your order constitutes an offer to purchase products from us. All orders are subject to acceptance by us, and we reserve the right to refuse or cancel any order for any reason, including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Product unavailability</li>
          <li>Errors in product or pricing information</li>
          <li>Suspected fraudulent or unauthorized transactions</li>
          <li>Inability to verify customer information</li>
        </ul>
        <p>
          If your order is cancelled after payment has been processed, we will issue a full refund to your original payment method.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Shipping and Delivery">
        <p>
          We ship across India. Delivery times and shipping charges vary based on your location and the shipping method selected at checkout.
        </p>
        <p>
          While we strive to meet estimated delivery times, we are not responsible for delays caused by courier services, natural disasters, or other circumstances beyond our control.
        </p>
        <p>
          For detailed shipping information, please refer to our{' '}
          <Link to="/legal/shipping-policy" className="text-primary hover:underline">
            Shipping Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection number="7" title="Returns and Refunds">
        <p>
          We offer a 7-day return policy for unused and unwashed products in their original condition with all tags attached.
        </p>
        <p>
          Refunds are processed within 7-10 business days after we receive and inspect the returned item.
        </p>
        <p>
          For complete details, please review our{' '}
          <Link to="/legal/refund-policy" className="text-primary hover:underline">
            Refund & Return Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection number="8" title="Intellectual Property">
        <p>
          All content on this website, including but not limited to text, graphics, logos, images, designs, and software, is the property of BlackPotHeads and is protected by Indian and international copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from our website without our express written permission.
        </p>
      </LegalSection>

      <LegalSection number="9" title="User Accounts">
        <p>
          When you create an account with us, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <p>
          You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your account information.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, BlackPotHeads shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your use or inability to use our services</li>
          <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
          <li>Any interruption or cessation of transmission to or from our website</li>
          <li>Any bugs, viruses, or other harmful code that may be transmitted through our website</li>
        </ul>
      </LegalSection>

      <LegalSection number="11" title="Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless BlackPotHeads, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of our website or your violation of these Terms.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Governing Law and Jurisdiction">
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
        </p>
        <p>
          Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes your acceptance of the new Terms.
        </p>
        <p>
          We encourage you to review these Terms periodically to stay informed of any updates.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Contact Information">
        <p>
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg mt-4">
          <p className="font-medium text-foreground">BlackPotHeads</p>
          <p>Email: support@blackpotheads.com</p>
          <p>Website: https://blackpotheads.com</p>
        </div>
      </LegalSection>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="font-display text-xl mb-4">Related Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/legal/privacy-policy"
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium text-foreground">Privacy Policy</p>
            <p className="text-sm text-muted-foreground mt-1">How we handle your data</p>
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

export default TermsPage;
