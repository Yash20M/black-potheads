import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Orders & Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner Razorpay.',
      },
      {
        q: 'Is it safe to use my credit card on your website?',
        a: 'Yes, absolutely. All payments are processed through Razorpay, which uses industry-standard SSL encryption and is PCI-DSS compliant.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Yes, you can cancel your order before it is shipped by contacting us at support@blackpotheads.com. Once shipped, you can follow our return process.',
      },
      {
        q: 'Do you offer Cash on Delivery (COD)?',
        a: 'COD availability depends on your location and order value. You can check COD availability during checkout.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard shipping takes 5-7 business days, while express shipping takes 2-4 business days. Delivery times may vary based on your location.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we only ship within India. We are working on expanding to international markets soon.',
      },
      {
        q: 'What are the shipping charges?',
        a: 'Shipping charges vary based on your location and order value. We offer free standard shipping on orders above ₹999.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once shipped, you will receive a tracking number via email and SMS. You can also track your order from the "My Orders" section in your account.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for unused, unwashed products with original tags intact. See our Refund Policy for details.',
      },
      {
        q: 'How do I return a product?',
        a: 'Email us at returns@blackpotheads.com with your order number. We will provide return instructions and authorization.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 7-10 business days after we receive and inspect the returned item. Bank processing may take additional 3-7 days.',
      },
      {
        q: 'Do you offer exchanges?',
        a: 'We do not offer direct exchanges. Please return the item for a refund and place a new order for the desired product.',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    questions: [
      {
        q: 'How do I choose the right size?',
        a: 'Check our size guide available on each product page. If you are between sizes, we recommend sizing up for a comfortable fit.',
      },
      {
        q: 'Are your t-shirts pre-shrunk?',
        a: 'Yes, our t-shirts are pre-shrunk to minimize shrinkage. However, we recommend following care instructions for best results.',
      },
      {
        q: 'What material are your t-shirts made of?',
        a: 'Our t-shirts are made from premium 100% cotton or cotton blends, ensuring comfort and durability.',
      },
      {
        q: 'How should I care for my t-shirts?',
        a: 'Machine wash cold with similar colors, tumble dry low, and avoid bleach. Iron inside out if needed.',
      },
    ],
  },
  {
    category: 'Account & Privacy',
    questions: [
      {
        q: 'Do I need an account to place an order?',
        a: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and enjoy faster checkout.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.',
      },
      {
        q: 'Is my personal information secure?',
        a: 'Yes, we use SSL encryption and follow strict data protection practices. Read our Privacy Policy for more details.',
      },
      {
        q: 'Can I update my account information?',
        a: 'Yes, you can update your profile, addresses, and preferences anytime from your account dashboard.',
      },
    ],
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-12 border-b border-border">
            <h1 className="font-display text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Find answers to common questions about BlackPotHeads</p>
          </div>

          <div className="p-8">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No questions found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="font-display text-2xl mb-4 text-primary">{category.category}</h2>
                    <div className="space-y-3">
                      {category.questions.map((faq, questionIndex) => {
                        const key = `${categoryIndex}-${questionIndex}`;
                        const isOpen = openIndex === key;

                        return (
                          <div
                            key={questionIndex}
                            className="border border-border rounded-lg overflow-hidden bg-muted/20"
                          >
                            <button
                              onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                            >
                              <span className="font-medium text-foreground pr-4">{faq.q}</span>
                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                                    {faq.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-display text-xl mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Check our policies or reach out to our support team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Link
                  to="/legal/shipping-policy"
                  className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="font-medium text-foreground">Shipping Policy</p>
                  <p className="text-sm text-muted-foreground mt-1">Delivery information</p>
                </Link>
              </div>
              <div className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="font-medium text-foreground mb-2">Contact Support</p>
                <p className="text-sm text-muted-foreground">Email: support@blackpotheads.com</p>
                <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQPage;
