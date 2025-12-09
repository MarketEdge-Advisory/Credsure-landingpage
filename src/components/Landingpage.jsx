import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "./faq";

const Landingpage = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="w-full flex flex-col justify-center md:px-8 px-4 md:mt-28 mt-12 pb-8 md:gap-24 gap-8 overflow-x-hidden">
            {/* first */}
            <div className="hidden md:flex w-full justify-between h-[284px]">
                {/* LEFT */}
                <div className="flex flex-col w-full h-full">
                    <p className="m-0 text-blue-700 font-semibold text-5xl leading-[72px]">
                        Build your store
                        <span className="text-slate-900 font-semibold text-5xl ml-1">
                            in <br /> a few minutes
                        </span>
                    </p>
                    <p className="m-0 max-w-[400px] w-full text-slate-800 font-normal text-sm py-6">
                        Build a gorgeous online store, collect payments
                        confidently,
                        <br />
                        and find reliable delivery partners, all in one place
                        built for Africa's reality.
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                        {/* <button className='flex items-center rounded-full border p-3 bg-blue-700 text-white text-sm font-normal'>
                Join the waitlist
            </button> */}
                        <a
                            href="https://forms.gle/AjVVcvZmXzhDAQuq7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center rounded-full border p-3 bg-blue-700 text-white text-sm font-normal"
                        >
                            Join the waitlist
                        </a>

                        <button className="flex items-center rounded-full p-3 border-[0.5px] text-blue-700 text-sm font-normal">
                            See how it works
                        </button>
                    </div>
                </div>
                {/* RIGHT */}
                <div className="flex flex-col w-full h-full relative">
                    <img
                        src="./cart.svg"
                        alt="cart"
                        className="flex w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-16">
                        <div className="w-[150px] flex bg-white gap-2 items-center shadow-xl rounded-xl">
                            <img
                                src="./bars.svg"
                                alt="icon"
                                width={40}
                                height={40}
                            />
                            <p className="m-0 text-[10px]">
                                converts 17% better on sales
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between w-full absolute bottom-0">
                        <div className="w-[150px] flex bg-white gap-2 p-2 items-center shadow-xl rounded-xl ml-[-25px]">
                            <img
                                src="./ai.svg"
                                alt="icon"
                                width={40}
                                height={40}
                            />
                            <p className="m-0 text-[10px]">
                                Get more done with AI
                            </p>
                        </div>
                        <div className="w-[150px] flex bg-white gap-2 p-2 items-center shadow-xl rounded-xl mr-3">
                            <img
                                src="./checkmark.svg"
                                alt="icon"
                                width={40}
                                height={40}
                            />
                            <p className="m-0 text-[10px]">
                                Free, fast, flexible and reliable
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========= MOBILE ======== */}
            <div className="md:hidden flex flex-col-reverse items-center justify-center w-full h-full">
                <div className="flex flex-col w-full h-full items-center justify-center">
                    <p className="m-0 text-blue-700 font-semibold text-3xl leading-[24px] text-center">
                        Build your store{" "}
                        <span className="text-slate-900 font-semibold text-3xl ml-1">
                            in a few minutes
                        </span>
                    </p>
                    <p className="m-0 w-full text-slate-800 font-normal text-sm text-center py-6">
                        Build a gorgeous online store, collect payments
                        confidently,
                        <br />
                        and find reliable delivery partners, all in one place
                        built for Africa's reality.
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                        <a
                            href="https://forms.gle/AjVVcvZmXzhDAQuq7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-full border p-3 bg-blue-700 text-white text-sm font-normal"
                        >
                            Join the waitlist
                        </a>
                        <button className="hidden md:flex items-center rounded-full p-3 border-[0.5px] text-blue-700 text-sm font-normal">
                            See how it works
                        </button>
                    </div>
                </div>
                {/* RIGHT */}
                <div className="flex flex-col w-full h-full relative">
                    <img
                        src="./shopping.svg"
                        alt="cart"
                        className="flex w-full h-full object-cover"
                    />
                    <div className="absolute top-18 right-8">
                        <div className="w-[80px] flex bg-white gap-1 px-0 items-center shadow-xl rounded-lg -rotate-12">
                            <img
                                src="./checkmark.svg"
                                alt="icon"
                                width={30}
                                height={30}
                            />
                            <p className="m-0 text-[6px]">
                                Free, fast, flexible and reliable
                            </p>
                        </div>
                        <div className="w-[80px] flex bg-white gap-1 px-0 items-center shadow-xl rounded-lg -rotate-3 mt-1">
                            <img
                                src="./bars.svg"
                                alt="icon"
                                width={30}
                                height={30}
                            />
                            <p className="m-0 text-[6px]">
                                converts 17% better on sales
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between w-full absolute bottom-30 left-[-10px] px-6">
                        <div className="w-[80px] flex bg-white gap-1 px-0 items-center shadow-xl rounded-lg">
                            <img
                                src="./ai.svg"
                                alt="icon"
                                width={30}
                                height={30}
                            />
                            <p className="m-0 text-[6px]">
                                Get more done with AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* second */}
            <div className="flex flex-col w-full gap-2 items-center justify-center md:items-start md:justify-start">
                <p className="m-0 text-slate-800 font-medium text-sm">
                    Trusted by top companies
                </p>
                <div className="flex w-full justify-between items-center">
                    <img
                        src="./partner-logo5.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="filter-black"
                    />
                    <img
                        src="./partner-logo4.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="filter-black"
                    />
                    <img
                        src="./partner-logo3.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="filter-black"
                    />
                    <img
                        src="./partner-logo2.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="filter-black"
                    />
                    <img
                        src="./partner-logo1.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="filter-black"
                    />
                </div>
            </div>
            {/* third */}
            <div className="md:flex w-full md:justify-between justify-center h-full gap-8 items-stretch">
                <div className="flex flex-col md:gap-3 gap-1 mb-8">
                    <img
                        src="build.svg"
                        alt="img"
                        className="w-full h-[150px] sm:h-[200px] md:h-[250px] object-cover"
                    />
                    <h2 className="md:text-3xl text-lg text-slate-700 font-semibold">
                        Build your store in minutes with AI tools
                    </h2>
                    <p className="m-0 md:text-xl text-sm text-slate-700 font-normal">
                        Create a stunning online store without a single line of
                        code.
                    </p>
                </div>
                <div className="flex flex-col md:gap-3 gap-1 mb-8">
                    <img
                        src="payment.svg"
                        alt="img"
                        className="w-full h-[150px] sm:h-[200px] md:h-[250px] object-cover"
                    />
                    <h2 className="md:text-3xl text-lg text-slate-700 font-semibold">
                        Collect payments confidently
                    </h2>
                    <p className="m-0 md:text-xl text-sm text-slate-700 font-normal">
                        With integrated payment gateways and escrow protection
                        that builds trust.
                    </p>
                </div>
                <div className="flex flex-col md:gap-3 gap-1">
                    <img
                        src="partners.svg"
                        alt="img"
                        className="w-full h-[150px] sm:h-[200px] md:h-[250px] object-cover"
                    />
                    <h2 className="md:text-3xl text-lg text-slate-700 font-semibold">
                        Find trusted delivery partners
                    </h2>
                    <p className="m-0 md:text-xl text-sm text-slate-700 font-normal">
                        Connect instantly with reliable agents — no more endless
                        calls or lost orders.
                    </p>
                </div>
            </div>
            {/* fourth */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <div className="flex items-center justify-center bg-[#D99426]/11 py-8">
                    <div className="flex flex-col items-start md:items-center justify-center w-full max-w-6xl md:gap-3 gap-1 px-4 md:px-8">
                        <h3 className="md:text-xl text-lg font-semibold text-slate-700">
                            Kaihma makes selling online fun, easy, and
                            trustworthy.
                        </h3>
                        <p className="m-0 md:text-center text-sm font-normal text-slate-700">
                            Kaihma is an all-in-one platform that helps African
                            entrepreneurs build trusted online stores, collect
                            payments, and find reliable delivery partners.
                            Kaihma empowers anyone selling online, from fashion
                            and skincare brands to gadget stores and logistics
                            companies. to build your own online store, your
                            brand, your customers, your control.
                        </p>
                    </div>
                </div>
            </div>
            {/* fifth */}
            <div className="hidden md:flex w-full h-full items-stretch">
                <img
                    src="waitlist.svg"
                    alt="img"
                    className="w-full h-[150px] sm:h-[200px] md:h-[250px] object-cover rounded-l-md"
                />
                <div className="w-full flex flex-col bg-blue-700 rounded-r-md py-8 px-6 gap-3">
                    <p className="m-0 text-white font-semibold text-3xl">
                        Be first to experience the future of selling online
                    </p>
                    <p className="m-0 text-white font-normal text-sm">
                        Join 1, 000+ entrepreneurs waiting to sell boldly with
                        Kaihma. Get early access, product updates, and exclusive
                        founder insights.
                    </p>
                    <div className="flex w-full justify-start">
                        <a
                            href="https://forms.gle/AjVVcvZmXzhDAQuq7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex rounded-full 
                 bg-[#E09213] py-3 px-4 text-white text-md font-normal"
                        >
                            Join the waitlist
                        </a>
                    </div>
                </div>
            </div>

            {/* ======MOBILE===== */}
            {/* fifth */}
            <div className="md:hidden relative flex w-full min-h-[300px] items-stretch bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src="waitlist.svg"
                    alt="People waiting for early access"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay + content */}
                <div className="relative z-10 flex flex-col justify-end bg-black/50 p-4 gap-3">
                    <h2 className="text-white font-semibold text-xl leading-tight">
                        Be first to experience the future of selling online
                    </h2>
                    <p className="text-white text-xs leading-relaxed">
                        Join 1,000+ entrepreneurs waiting to sell boldly with
                        Kaihma. Get early access, product updates, and exclusive
                        founder insights.
                    </p>
                    <div className="flex w-full justify-start pt-2">
                        <a
                            href="https://forms.gle/AjVVcvZmXzhDAQuq7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-[#E09213] py-3 px-6 text-white text-sm font-medium hover:bg-[#c87f10] transition-colors duration-200"
                        >
                            Join the waitlist
                        </a>
                    </div>
                </div>
            </div>
            {/* sixth */}
            <div className="flex w-full flex-col gap-8">
                <h2 className="text-3xl font-semibold text-slate-800">FAQs</h2>

                {faqs.map((faq, index) => (
                    <div key={index} className="w-full">
                        {/* Clickable Row */}
                        <div
                            onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                            className="flex w-full justify-between items-center border-b-[0.5px] border-slate-300 pb-3 cursor-pointer"
                        >
                            <p className="m-0 text-slate-700 text-md font-normal">
                                {faq.question}
                            </p>

                            {openIndex === index ? (
                                <ChevronUp size={16} color="#606060" />
                            ) : (
                                <ChevronDown size={16} color="#606060" />
                            )}
                        </div>

                        {/* Dropdown Content */}
                        {openIndex === index && (
                            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            {/* seventh */}
            <div className="flex flex-col w-full items-center justify-center gap-6">
                <div className="w-full flex flex-col text-center gap-4">
                    <p className="m-0 text-slate-700 font-semibold text-2xl">
                        Get the best services with our app
                    </p>
                    <p className="m-0 text-slate-700 font-normal text-sm">
                        Be among the first to get our app when it launches and
                        enjoy exciting free tools to scale-up your business.
                        Everything you need to grow your business with high
                        conversion rate, all in one place.{" "}
                    </p>
                </div>
                <div className="w-full flex justify-center">
                    <div className="flex items-center justify-center gap-2 md:gap-6 max-w-md w-full">
                        {/* Google Play */}
                        <div className="flex items-center gap-2 p-2 shadow-xl rounded-lg bg-slate-900 min-w-[140px] flex-1">
                            <img
                                src="playstore.svg"
                                alt="playstore-logo"
                                className="w-7 h-7 md:w-10 md:h-10"
                            />
                            <div className="flex flex-col leading-tight">
                                <p className="text-[8px] md:text-sm text-white uppercase font-semibold">
                                    Get it on
                                </p>
                                <p className="text-xs md:text-2xl text-white font-bold">
                                    Google Play
                                </p>
                            </div>
                        </div>

                        {/* Apple Store */}
                        <div className="flex items-center gap-2 p-2 shadow-xl rounded-lg bg-slate-900 min-w-[140px] flex-1">
                            <img
                                src="apple.svg"
                                alt="apple-logo"
                                className="w-7 h-7 md:w-10 md:h-10"
                            />
                            <div className="flex flex-col leading-tight">
                                <p className="text-[8px] md:text-lg text-white">
                                    Download on the
                                </p>
                                <p className="text-xs md:text-xl text-white font-bold">
                                    App Store
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landingpage;
