import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalSection } from '@/components/legal/LegalSection';
import { Link } from 'react-router-dom';

const RefundPage = () => {
  return (
    <LegalLayout title="Refund & Return Policy" lastUpdated="February 28, 2026">
      <div className="mb-8">
        <p className="text-foreground leading-relaxed">
          At BlackPotHeads, we want you to be completely satisfied with your purchase. If you are not happy with your order, we offer a straightforward return and refund process. Please read this policy carefully to understand your rights and our procedures.
        </p>
      </div>

      <LegalSection number="1" title="Return Eligibility">
        <p>We accept returns within 7 days from the date of delivery, subject to the following conditions:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The product must be unused, unwashed, and in its original condition</li>
          <li>All original tags, labels, and packaging must be intact</li>
          <li>The product must not show any signs of wear, damage, or alteration</li>
          <li>The product must be in a resalable condition</li>
        </ul>
        
        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">Non-Returnable Items</h3>
        <p>The following items cannot be returned:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Products that have been worn, washed, or used</li>
          <li>Products with removed or damaged tags</li>
          <li>Products purchased during final sale or clearance events (unless defective)</li>
          <li>Customized or personalized products</li>
        </ul>
      </LegalSection>

      <LegalSection number="2" title="How to Initiate a Return">
        <p>To initiate a return, please follow these steps:</p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <span className="font-medium text-foreground">Contact Us:</span> Email us at returns@blackpotheads.com within 7 days of receiving your order with your order number and reason for return.
          </li>
          <li>
            <span className="font-medium text-foreground">Await Confirmation:</span> Our team will review your request and provide you with return instructions and a return authorization number within 24-48 hours.
          </li>
          <li>
            <span className="font-medium text-foreground">Pack the Item:</span> Securely pack the product in its original packaging with all tags attached. Include the return authorization number in the package.
          </li>
          <li>
            <span className="font-medium text-foreground">Ship the Item:</span> Send the package to the address provided in our return confirmation email. We recommend using a trackable shipping method.
          </li>
        </ol>
      </LegalSection>

      <LegalSection number="3" title="Return Shipping Costs">
        <p>Return shipping costs depend on the reason for the return:</p>
        
        <h3 className="font-medium text-foreground text-lg mb-3 mt-4">3.1 Customer Responsibility</h3>
        <p>If you are returning an item due to change of mind, wrong size selection, or any non-defect reason, you are responsible for the return shipping costs.</p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">3.2 Our Responsibility</h3>
        <p>If the return is due to our error (wrong item shipped, defective product, damaged during shipping), we will cover the return shipping costs and arrange for pickup or provide a prepaid shipping label.</p>
      </LegalSection>

      <LegalSection number="4" title="Refund Process">
        <h3 className="font-medium text-foreground text-lg mb-3">4.1 Inspection</h3>
        <p>
          Once we receive your returned item, our team will inspect it to ensure it meets our return eligibility criteria. This process typically takes 2-3 business days.
        </p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">4.2 Refund Approval</h3>
        <p>
          If your return is approved, we will initiate a refund to your original payment method. The refund amount will include the product price and any applicable taxes. Shipping charges are non-refundable unless the return is due to our error.
        </p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">4.3 Refund Timeline</h3>
        <p>
          Refunds are processed within 7-10 business days after approval. The time it takes for the refund to reflect in your account depends on your payment method and bank:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Credit/Debit Cards: 5-7 business days</li>
          <li>UPI/Net Banking: 3-5 business days</li>
          <li>Wallets: 2-3 business days</li>
        </ul>
      </LegalSection>

      <LegalSection number="5" title="Exchanges">
        <p>
          We currently do not offer direct exchanges. If you need a different size or product, please return the original item for a refund and place a new order for the desired item.
        </p>
        <p>
          This ensures faster processing and allows you to select from our current inventory.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Damaged or Defective Products">
        <p>
          If you receive a damaged or defective product, please contact us immediately at support@blackpotheads.com with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your order number</li>
          <li>Clear photos of the damaged or defective item</li>
          <li>A description of the issue</li>
        </ul>
        <p className="mt-4">
          We will arrange for a replacement or full refund, including return shipping costs. In case of defective products, we may also offer additional compensation as a goodwill gesture.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Wrong Item Shipped">
        <p>
          If we shipped the wrong item to you, please contact us immediately. We will arrange for the correct item to be shipped to you at no additional cost and provide a prepaid return label for the incorrect item.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Cancellations">
        <h3 className="font-medium text-foreground text-lg mb-3">8.1 Before Shipment</h3>
        <p>
          You can cancel your order before it is shipped by contacting us at support@blackpotheads.com. If payment has been processed, we will issue a full refund within 3-5 business days.
        </p>

        <h3 className="font-medium text-foreground text-lg mb-3 mt-6">8.2 After Shipment</h3>
        <p>
          Once an order has been shipped, it cannot be cancelled. You may refuse delivery or follow our standard return process after receiving the item.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Refund Denials">
        <p>We reserve the right to deny a refund if:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The product does not meet our return eligibility criteria</li>
          <li>The return request is made after the 7-day return window</li>
          <li>The product shows signs of use, wear, or damage</li>
          <li>Tags or packaging have been removed or damaged</li>
          <li>We suspect fraudulent activity or abuse of our return policy</li>
        </ul>
        <p className="mt-4">
          If your refund is denied, we will notify you via email with the reason for denial. The product will be returned to you at your expense.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contact Us">
        <p>
          If you have any questions about our Refund & Return Policy or need assistance with a return, please contact us:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg mt-4">
          <p className="font-medium text-foreground">BlackPotHeads</p>
          <p>Returns: returns@blackpotheads.com</p>
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

export default RefundPage;
