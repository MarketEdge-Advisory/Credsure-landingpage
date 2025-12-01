import { Facebook, Instagram, Linkedin } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div className='bottom-0 left-0 flex flex-col w-full justify-between items-start bg-blue-700 py-4 px-8 gap-6'>
        <div className="hidden md:flex w-full justify-between items-start">
  <img src="./Logo.svg" alt="logo" width={100} height={100} />
  <div className="flex gap-24">
    <ul className="flex flex-col gap-2 text-white font-medium text-xs">
      <li>How it works</li>
      <li>Highlights</li>
      <li>About us</li>
      <li>FAQs</li>
    </ul>

    <ul className="flex flex-col gap-2 text-white font-medium text-xs">
      <li>Email</li>
      <li>Phone</li>
    </ul>
  </div>
  <div className="flex flex-col gap-2">
    <p className="m-0 text-white font-medium text-xs">Follow us:</p>
    <div className="flex gap-6 items-center">
      <img src="./X.svg" alt="x" width={16} height={16} />
      <Linkedin size={12} color="blue" className="bg-white rounded-lg w-6 h-6 p-1" />
      <Instagram size={12} color="blue" className="bg-white rounded-lg w-6 h-6 p-1" />
      <Facebook size={12} color="blue" className="bg-white rounded-full w-6 h-6" />
    </div>
  </div>
</div>

{/* ======MOBILE====== */}
<div className='md:hidden flex w-full flex-col justify-between items-start gap-4'>
        <img src='./Logo.svg' alt='logo' width={100} height={100}/>
        <div className='flex w-full justify-between'>
            <ul className='flex flex-col gap-4 text-white font-medium text-xs'>
                <li>How it works</li>
                <li>Highligts</li>
                <li>About us</li>
                <li>FAQs</li>
            </ul>
            <ul className='flex flex-col gap-4 text-white font-medium text-xs'>
                <li>Email</li>
                <li>Phone</li>
                <li className='md:hidden flex'>SMS</li>
                <li className='md:hidden flex'>WhatsApp</li>
            </ul>
            </div>
        <div className='flex flex-col gap-4 justify-center items-center w-full mt-3'>
            <p className='m-0 text-white font-medium text-xs'>Follow us:</p>
            <div className='flex gap-8 items-center'>
                <img src='./X.svg' alt='x' width={16} height={16}/>
                <Linkedin size={12} color='blue' className='bg-white rounded-lg w-6 h-6 p-1'/>
                <Instagram size={12} color='blue' className='bg-white rounded-lg w-6 h-6 p-1'/>
                <Facebook size={12} color='blue' className='bg-white rounded-full w-6 h-6'/>
            </div>
        </div>
    </div>
    <div className='w-full flex flex-col items-start gap-4'>
        <div className='flex w-full border-[0.3px] border-slate-100'></div>
        <div className='flex w-full md:justify-between md:flex-row flex-col-reverse items-center gap-3'>
        <p className='text-white font-medium text-xs'>&copy; 2025 Kaimah Intl</p>
        <div className='flex gap-2'>
        <p className='text-white font-medium text-xs'>Terms of service</p>
        <p className='text-white font-medium text-xs'>Private policy</p>
        </div>
        </div>
    </div>
    </div>
  )
}

export default Footer