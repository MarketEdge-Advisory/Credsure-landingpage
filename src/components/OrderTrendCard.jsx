import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", value: 70 },
  { day: "Tue", value: 55 },
  { day: "Wed", value: 65 },
  { day: "Thu", value: 40 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 65 },
  { day: "Sun", value: 65 },
];

const OrderTrendCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm w-full mb-2">
    <h3 className="text-lg font-normal text-black">Order Trend</h3>
    <p className="text-xl font-bold mt-2">123</p>
    <p className="m-0 text-xs font-normal text-[#4F9654]">Last 7 days +10%</p>

    <div className="h-36 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" axisLine={false}
            tickLine={false}/>
          <Tooltip />
          <Bar dataKey="value" fill="#3B32F6" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
export default OrderTrendCard;