import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { MdQuestionMark } from "react-icons/md";
import { CirclePlus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Who is eligible for Credsure financing?',
      answer: 'Nigerian citizens and residents aged 21-65 with a valid ID, stable income, and good credit history are eligible. Self-employed individuals and salaried employees can apply.',
    },
    {
      question: 'What documents do I need to apply?',
      answer: 'You\'ll need: Valid ID (National ID, Driver\'s License, or International Passport), Proof of income (payslips or bank statements), Utility bill, and passport photographs.',
    },
    {
      question: 'How much down payment do I need?',
      answer: 'Down payment starts from ₦500,000 and can go up to 100% of the vehicle price. The amount affects your monthly payments and loan approval.',
    },
    {
      question: 'What loan tenures are available?',
      answer: 'We offer flexible loan terms from 6 to 36 months. Choose a tenure that fits your budget and financial goals.',
    },
    {
      question: 'How long does approval take?',
      answer: 'Pre-approval typically takes 24-48 hours after submitting complete documentation. Final approval may take up to 5 business days.',
    },
    {
      question: 'When will I receive my vehicle?',
      answer: 'Vehicle delivery is within 2 weeks of completing your documentation and down payment. We prioritize fast delivery to get you on the road quickly.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No. We believe in transparent pricing. All fees are clearly stated upfront in your loan agreement. What you see is what you pay.',
    },
    {
      question: 'Can I pay off my loan early?',
      answer: 'Yes, you can make early repayment without penalties. Contact our team to discuss early settlement options and potential interest savings.',
    },
    {
      question: 'What happens if I miss a payment?',
      answer: 'Missing payments may incur late fees and affect your credit score. Contact us immediately if you\'re facing difficulties - we\'ll work with you to find a solution.',
    },
    {
      question: 'Is the vehicle insured?',
      answer: 'Comprehensive insurance is mandatory and included in your financing package. This protects you and your investment throughout the loan period.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="bg-white py-16 md:py-8">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between py-5 text-left hover:bg-gray-50 transition-colors duration-200 px-4 rounded-lg"
              >
                <span className="text-gray-900 font-medium text-base md:text-lg pr-8">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-cyan-500" />
                  ) : (
                    <CirclePlus className="w-5 h-5 text-cyan-500" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-5 text-gray-600 text-sm md:text-base leading-relaxed animate-[fade-in_0.3s_ease-out]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="max-w-4xl mx-auto bg-[#EDF5FC] rounded-none p-8 md:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-b from-[#0FAFFF] to-[#0A2647] rounded-full flex items-center justify-center">
              <MdQuestionMark className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-base mb-6">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <button className="bg-[#3FA9F5] hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg">
            Get in touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
