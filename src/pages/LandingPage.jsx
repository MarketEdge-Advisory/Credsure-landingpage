import React from 'react'
import Header from '../components/Header';
import DreamSuzuki from '../components/DreamSuzuki';
import FlexiblePayment from '../components/FlexiblePayment';
import EasySteps from '../components/EasySteps';
import ChooseSuzuki from '../components/ChooseSuzuki';
import LoanCalculator from '../components/LoanCalculator';
import WhyCredsure from '../components/WhyCredsure';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { CarProvider } from '../context/CarContext';
import CFAO from '../components/CFAO';

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