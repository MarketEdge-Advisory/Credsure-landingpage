import React, { useState } from 'react';
import InterestRateManagement from './InterestRateManagement';
import LoanTermManagement from './LoanTermManagement';
import CalculatorInputMgt from './CalculatorInputMgt';
import AuditLog from './AuditLog'; // import the new component

const PlatformSettings = () => {
  const [activeTab, setActiveTab] = useState('interest');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'interest':
        return <InterestRateManagement />;
      case 'term':
        return <LoanTermManagement />;
      case 'calculator':
        return <CalculatorInputMgt />;
      case 'audit':
        return <AuditLog />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:flex border-b border-gray-300 px-13 mt-6">
        <button
          onClick={() => setActiveTab('interest')}
          className={`px-5 py-2.5 border-0 cursor-pointer outline-none rounded-md ${
            activeTab === 'interest' ? 'bg-gray-900 text-white' : 'bg-transparent'
          }`}
        >
          Interest Rate
        </button>
        <button
          onClick={() => setActiveTab('term')}
          className={`px-5 py-2.5 border-0 cursor-pointer outline-none rounded-md ${
            activeTab === 'term' ? 'bg-gray-900 text-white' : 'bg-transparent'
          }`}
        >
          Loan Term
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-5 py-2.5 border-0 cursor-pointer outline-none rounded-md ${
            activeTab === 'calculator' ? 'bg-gray-900 text-white' : 'bg-transparent'
          }`}
        >
          Loan Calculator
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-2.5 border-0 cursor-pointer outline-none rounded-md ${
            activeTab === 'audit' ? 'bg-gray-900 text-white' : 'bg-transparent'
          }`}
        >
          Audit Log
        </button>
      </div>
      <div className="p-5">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PlatformSettings;