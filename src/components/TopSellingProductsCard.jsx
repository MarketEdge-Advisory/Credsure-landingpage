const products = [
  { name: "Handbags", value: 90 },
  { name: "Shoes", value: 30 },
  { name: "Dresses", value: 45 },
  { name: "Accessories", value: 70 },
];

const TopSellingProductsCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
    <h3 className="text-lg font-normal text-black">Top selling products</h3>
     <p className="text-xl font-bold mt-2">Handbags</p>
    <p className="m-0 text-xs font-normal text-[#4F9654]">Last 7 days +10%</p>

    <div className="mt-6 space-y-4">
      {products.map(p => (
        <div key={p.name} className="flex items-center gap-0">
  {/* LABEL (FIXED WIDTH) */}
  <p className="w-28 shrink-0 text-sm font-medium text-[#0D1C0F]">
    {p.name}
  </p>

  {/* BAR CONTAINER */}
  <div className="flex-1 h-3">
    <div
      className="h-3 bg-[#3B32F6]"
      style={{ width: `${p.value}%` }}
    />
  </div>
</div>

      ))}
    </div>
  </div>
);
export default TopSellingProductsCard;