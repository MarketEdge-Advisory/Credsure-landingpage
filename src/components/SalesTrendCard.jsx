import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", value: 400 },
  { day: "Tue", value: 300 },
  { day: "Wed", value: 350 },
  { day: "Thu", value: 280 },
  { day: "Fri", value: 200 },
  { day: "Sat", value: 450 },
  { day: "Sun", value: 380 },
];

const SalesTrendCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm w-full mb-2">
    <h3 className="text-lg font-normal text-black">Sales Trend</h3>
    <p className="text-xl font-bold mt-2">$2,345</p>
    <p className="m-0 text-xs font-normal text-[#4F9654]">Last 7 days +10%</p>

    <div className="h-36 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} interval={0} padding={{ left: 10, right: 10 }}/>
          <Tooltip />
          <Line
            type="natural"
            dataKey="value"
            stroke="#3B32F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
export default SalesTrendCard;