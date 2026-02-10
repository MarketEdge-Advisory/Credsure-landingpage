import React from 'react'
import Header from './Header';
import DreamSuzuki from './DreamSuzuki';
import FlexiblePayment from './FlexiblePayment';
import EasySteps from './EasySteps';
import ChooseSuzuki from './ChooseSuzuki';
import LoanCalculator from './LoanCalculator';
import WhyCredsure from './WhyCredsure';
import FAQ from './FAQ';
import Footer from './Footer';
import { CarProvider } from '../context/CarContext';
import CFAO from './CFAO';

const LandingPage = () => {
  return (
    <CarProvider>
      <div>
        <Header />
        <DreamSuzuki />
        <FlexiblePayment />
        <EasySteps />
        <ChooseSuzuki />
        <LoanCalculator />
        <WhyCredsure />
        <CFAO />
        <FAQ />
        <Footer />
      </div>
    </CarProvider>
  )
}

export default LandingPage