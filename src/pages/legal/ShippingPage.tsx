import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalSection } from '@/components/legal/LegalSection';
import { Link } from 'react-router-dom';

const ShippingPage = () => {
  return (
    <LegalLayout title="Shipping Policy" lastUpdated="February 28, 2026">
      <div className="mb-8">
        <p className="text-foreground leading-relaxed">
          At BlackPotHeads, we are committed to delivering your orders quickly and safely. This Shipping Policy outlines our shipping methods, delivery times, and related information for orders within India.
        </p>
      </div>

      <LegalSection number="1" title="Shipping Coverage">
        <p>
          We currently ship to all serviceable locations across India. During checkout, you can enter your PIN code to verify if we deliver to your area.
        </p>
        <p>
          If your location is not serviceable, we will notify you before you complete your order. We are continuously expanding our delivery network to reach more customers.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Processing Time">
        <p>
          Orders are typically processed within 1-2 business days (Monday to Saturday, excluding public holidays) after payment confirmation.
        </p>
        <p>Processing time includes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Payment verification</li>
          <li>Quality check of products</li>
          <li>Packaging and labeling</li>
          <li>Handover to courier partner</li>
        </ul>
        <p className="mt-4">
          During peak seasons (festivals, sales events), processing time may extend to 3-4 business days. We will notify you of any delays via email or SMS.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Shipping Methods and Delivery Time">
        <p>We offer the following shipping options:</p>
        
        <h3 className="font-medium text-foreground text-lg mb-3 mt-4">3.1 Standard Shipping</h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="font-medium text-foreground">Delivery Time: 5-7 business days</p>
          <p className="text-sm mt-2">Available for all serviceable locations across India</p>
          <p className="text-sm">Shipping charges vary based on order value and location</p>
        </div>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">3.2 Express Shipping</h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="font-medium text-foreground">Delivery Time: 2-4 business days</p>
          <p className="text-sm mt-2">Available for major cities and metro areas</p>
          <p className="text-sm">Additional charges apply</p>
        </div>

        <p className="mt-6">
          Delivery times are estimates and may vary based on your location, courier availability, and unforeseen circumstances. Remote or rural areas may experience longer delivery times.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Shipping Charges">
        <p>Shipping charges are calculated based on:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Order value</li>
          <li>Delivery location</li>
          <li>Shipping method selected</li>
          <li>Product weight and dimensions</li>
        </ul>

        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mt-4">
          <p className="font-medium text-foreground">Free Shipping</p>
          <p className="text-sm mt-2">
            Enjoy free standard shipping on orders above ₹999 to most locations in India. Express shipping charges still apply.
          </p>
        </div>

        <p className="mt-4">
          Exact shipping charges will be displayed at checkout before you complete your purchase.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Order Tracking">
        <p>
          Once your order is shipped, you will receive a shipping confirmation email with a tracking number and a link to track your package.
        </p>
        <p>You can also track your order by:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Logging into your account on our website</li>
          <li>Visiting the "My Orders" section</li>
          <li>Using the tracking number on the courier partner's website</li>
        </ul>
        <p className="mt-4">
          Tracking information is typically updated within 24 hours of shipment. If you experience any issues with tracking, please contact our support team.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Delivery Attempts">
        <p>
          Our courier partners will make up to 3 delivery attempts at the address provided. If delivery is unsuccessful after 3 attempts, the package will be returned to us.
        </p>
        <p>Please ensure:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The shipping address provided is accurate and complete</li>
          <li>Someone is available to receive the package</li>
          <li>The contact number provided is reachable</li>
          <li>You respond to delivery notifications from the courier</li>
        </ul>
        <p className="mt-4">
          If the package is returned to us due to failed delivery attempts, you may be charged for re-shipment or you can request a refund as per our{' '}
          <Link to="/legal/refund-policy" className="text-primary hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection number="7" title="Address Changes">
        <p>
          Once an order is placed, the shipping address cannot be changed. Please ensure you provide the correct address during checkout.
        </p>
        <p>
          If you need to change the address after placing an order, you must cancel the order (if not yet shipped) and place a new order with the correct address.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Delivery Issues">
        <h3 className="font-medium text-foreground text-lg mb-3">8.1 Delayed Delivery</h3>
        <p>
          While we strive to meet estimated delivery times, delays may occur due to factors beyond our control, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Natural disasters or extreme weather conditions</li>
          <li>Political unrest or strikes</li>
          <li>Courier service disruptions</li>
          <li>Incorrect or incomplete address information</li>
          <li>Customs or regulatory delays</li>
        </ul>
        <p className="mt-4">
          We are not liable for delays caused by such circumstances. However, we will do our best to keep you informed and resolve any issues promptly.
        </p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">8.2 Lost or Damaged Packages</h3>
        <p>
          If your package is lost or damaged during transit, please contact us immediately at support@blackpotheads.com with your order number and details of the issue.
        </p>
        <p>
          We will investigate the matter with our courier partner and arrange for a replacement or full refund, including shipping charges.
        </p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">8.3 Incorrect Items</h3>
        <p>
          If you receive an incorrect item, please contact us within 48 hours of delivery. We will arrange for the correct item to be shipped at no additional cost and provide a return label for the incorrect item.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Undeliverable Packages">
        <p>
          Packages may be deemed undeliverable if:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The address is incorrect or incomplete</li>
          <li>The recipient refuses delivery</li>
          <li>Multiple delivery attempts fail</li>
          <li>The location is not serviceable</li>
        </ul>
        <p className="mt-4">
          Undeliverable packages will be returned to us. You will be notified via email, and you can choose to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide a corrected address for re-shipment (additional charges may apply)</li>
          <li>Request a refund (shipping charges are non-refundable)</li>
        </ul>
      </LegalSection>

      <LegalSection number="10" title="International Shipping">
        <p>
          We currently do not offer international shipping. Our services are limited to addresses within India only.
        </p>
        <p>
          We are working on expanding our shipping capabilities to serve international customers in the future. Please check back for updates.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Packaging">
        <p>
          All products are carefully packaged to ensure they reach you in perfect condition. We use:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Durable, tamper-proof packaging materials</li>
          <li>Protective wrapping for individual items</li>
          <li>Branded packaging for a premium unboxing experience</li>
          <li>Eco-friendly materials wherever possible</li>
        </ul>
      </LegalSection>

      <LegalSection number="12" title="Contact Us">
        <p>
          If you have any questions about our Shipping Policy or need assistance with your order, please contact us:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg mt-4">
          <p className="font-medium text-foreground">BlackPotHeads</p>
          <p>Shipping Inquiries: shipping@blackpotheads.com</p>
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
        </div>
      </div>
    </LegalLayout>
  );
};

export default ShippingPage;
