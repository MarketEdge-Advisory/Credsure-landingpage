import React from "react";
import DefaultLayout from "../components/DefaultLayout";
import DefaultHeader from "../components/DefaultHeader";
import SalesTrendCard from "../components/SalesTrendCard";
import OrderTrendCard from "../components/OrderTrendCard";
import TopSellingProductsCard from "../components/TopSellingProductsCard";

const HomePage = () => {
    return (
        <DefaultLayout header={<DefaultHeader />}>
            <div className="w-full bg-slate-50">
                <div className="flex flex-col max-w-7xl mx-auto px-6 gap-4">
                    <div className="flex flex-col w-full justify-start gap-1 mt-6 mb-6">
                        <h3 className="text-md font-bold">Dashboard</h3>
                        <p className="text-[#4F9654] text-xs font-normal m-0">
                            Welcome back, Aisha{" "}
                        </p>
                    </div>
                    <h3 className="text-black text-sm font-bold">Overview</h3>
                    <div className="flex md:flex-row flex-col w-full justify-between items-center mb-6">
                        <div className="flex flex-col rounded-md shadow-sm p-2 bg-[#FEFEFE] py-4 px-4 gap-1 w-[280px] mb-2">
                            <p className="m-0 text-sm font-normal text-black">
                                Sales
                            </p>
                            <h3 className="font-bold text-xl text-black">
                                $2,345
                            </h3>
                            <p className="m-0 text-xs font-normal text-[#4F9654]">
                                +10%
                            </p>
                        </div>
                        <div className="flex flex-col rounded-md shadow-sm p-2 bg-[#FEFEFE] py-4 px-4 gap-1 w-[280px] mb-2">
                            <p className="m-0 text-sm font-normal text-black">
                                Orders
                            </p>
                            <h3 className="font-bold text-xl text-black">
                                345
                            </h3>
                            <p className="m-0 text-xs font-normal text-[#4F9654]">
                                +5%
                            </p>
                        </div>
                        <div className="flex flex-col rounded-md shadow-sm p-2 bg-[#FEFEFE] py-4 px-4 gap-1 w-[280px] mb-2">
                            <p className="m-0 text-sm font-normal text-black">
                                Top products
                            </p>
                            <h3 className="font-bold text-xl text-black">
                                Handbags
                            </h3>
                            <p className="m-0 text-xs font-normal text-[#4F9654]">
                                +10%
                            </p>
                        </div>
                        <div className="flex flex-col rounded-md shadow-sm p-2 bg-[#FEFEFE] py-4 px-4 gap-1 w-[280px] mb-2">
                            <p className="m-0 text-sm font-normal text-black">
                                Profits
                            </p>
                            <h3 className="font-bold text-xl text-black">
                                $2,345
                            </h3>
                            <p className="m-0 text-xs font-normal text-[#4F9654]">
                                +10%
                            </p>
                        </div>
                    </div>
                    <h3 className="text-black text-sm font-bold">
                        Sales and Orders
                    </h3>
                    <div className="flex md:flex-row flex-col w-full justify-between gap-8 items-center">
                        <SalesTrendCard />
                        <OrderTrendCard />
                        <TopSellingProductsCard />
                    </div>
                    <div className="flex flex-col w-full mb-6">
                        <h3 className="text-black text-sm font-bold">
                        AI Insight
                    </h3>
                    <div className="relative flex flex-col">
                    <img src="/insight-pix.svg" alt="AI Insight" className="w-full mt-4 rounded-2xl"/>
                    <div className="absolute bottom-8 left-2 w-[350px]">
                        <h3 className="text-white font-bold text-lg">Inventory Management</h3>
                        <p className="text-white font-normal text-sm">Optimize your stock levels based on sales trends and customers  demand.</p>
                    </div>
                    </div>
                    <div className="relative flex flex-col">
                    <img src="/insight-pix2.svg" alt="AI Insight" className="w-full mt-4 rounded-2xl"/>
                    <div className="absolute bottom-8 left-2 w-[350px]">
                        <h3 className="text-white font-bold text-lg">Inventory Management</h3>
                        <p className="text-white font-normal text-sm">Optimize your stock levels based on sales trends and customers  demand.</p>
                    </div>
                    </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full mb-6">
                         <h3 className="text-black text-sm font-bold">
                        Next step
                    </h3>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col bg-slate-50 gap-2">
                            <h3 className="text-black font-bold text-sm">Add a product</h3>
                            <p className="m-0 text-black font-sm font-normal">Expand your offerings and reach more customers.</p>
                            <button className="flex bg-[#E8F2E8] items-center justify-center rounded-md text-sm text-black w-[150px] px-1 py-2">Add product</button>
                        </div>
                        <img src="/addproduct.svg" alt="Next step" className="w-60 h-40 mt-4 rounded-2xl"/>
                        </div>
                        <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col bg-slate-50 gap-2">
                            <h3 className="text-black font-bold text-sm">Set up Delivery</h3>
                            <p className="m-0 text-black font-sm font-normal">Ensure smooth and timely delivery for your customers.</p>
                            <button className="flex bg-[#E8F2E8] items-center justify-center rounded-md text-sm text-black w-[150px] px-1 py-2">Set up Delivery</button>
                        </div>
                        <img src="/set1.svg" alt="Next step" className="w-60 h-40 mt-4 rounded-2xl"/>
                        </div>
                        <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col bg-slate-50">
                            <h3 className="text-black font-bold text-sm">View Analytics</h3>
                            <p className="m-0 text-black font-sm font-normal">Gain deeper insights into your business performance.</p>
                            <button className="flex bg-[#E8F2E8] items-center justify-center rounded-md text-sm text-black w-[150px] px-1 py-2">View Analytics</button>
                        </div>
                        <img src="/set2.svg" alt="Next step" className="w-60 h-40 mt-4 rounded-2xl"/>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default HomePage;
