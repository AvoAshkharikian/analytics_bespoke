import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { useState } from "react";
import * as XLSX from "xlsx";

type WeekData = {
  inbound: number;
  answered: number;
  abandoned: number;
  missed: number;
  avgHandleTime: number;
  staffNeeded: number;
};
export default function CallCenterReport() {
  const [excelData, setExcelData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setExcelData(parsedData);
      console.log("📥 Parsed Excel:", parsedData);
    };
    reader.readAsArrayBuffer(file);
  };
  const data: Record<string, WeekData> = {
    "04/07-04/11": { inbound: 1148, answered: 703, abandoned: 187, missed: 256, avgHandleTime: 4.10, staffNeeded: 2 },
    "04/14-04/18": { inbound: 1065, answered: 671, abandoned: 195, missed: 196, avgHandleTime: 4.23, staffNeeded: 2 },
    "04/21-04/25": { inbound: 1039, answered: 604, abandoned: 212, missed: 223, avgHandleTime: 3.76, staffNeeded: 2 }
  };

  const colors = ['#4CAF50', '#F44336', '#FF9800'];

  const [selectedWeek, setSelectedWeek] = React.useState<string | 'All'>('All');
  const allWeeks = Object.keys(data);
  const weekKeys = selectedWeek === 'All' ? allWeeks : [selectedWeek];
  const aggregatedData = weekKeys.map(week => data[week]);

  const total = aggregatedData.reduce(
    (acc, cur) => ({
      inbound: acc.inbound + cur.inbound,
      answered: acc.answered + cur.answered,
      abandoned: acc.abandoned + cur.abandoned,
      missed: acc.missed + cur.missed,
      avgHandleTime: acc.avgHandleTime + cur.avgHandleTime,
      staffNeeded: acc.staffNeeded + cur.staffNeeded
    }),
    { inbound: 0, answered: 0, abandoned: 0, missed: 0, avgHandleTime: 0, staffNeeded: 0 }
  );
  const avgHandleTime = aggregatedData.length > 0
    ? (total.avgHandleTime / aggregatedData.length).toFixed(2)
    : '0.00';
  const availableMinutesPerAgent = 420;
  const callsPerDay = total.inbound / (5 * weekKeys.length);
  const totalMinutesNeeded = total.answered * parseFloat(avgHandleTime);
  const requiredAgents = Math.ceil((callsPerDay * parseFloat(avgHandleTime)) / availableMinutesPerAgent);
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 flex justify-center">
      <div className="relative w-full max-w-screen-lg bg-gray-800 text-white shadow-md rounded-lg px-6 md:px-12 py-10">
        {/* PDF Download */}
        <div className="absolute top-4 right-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full shadow hover:bg-blue-700 transition text-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v4H5V4zm14 6H5v8h4v2h6v-2h4v-8z" />
            </svg>
            PDF
          </button>
        </div>
        {/* ✅ Upload input */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">Upload Excel File (.xlsx)</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">Call Center Performance Analysis</h1>
        <p className="text-md text-center mb-8 text-gray-300">
          Upload weekly Excel data or review built-in performance metrics.
        </p>
{/* Executive Summary */}
<section className="bg-gray-700 p-6 rounded mb-8 shadow">
  <h2 className="text-xl font-semibold mb-3">Executive Summary</h2>
  <p className="mb-3 text-gray-300">
    During the analysis period, over {total.inbound} inbound calls were received. Approximately {total.answered} were successfully answered, while {total.abandoned} calls were abandoned and {total.missed} were missed. Average handle time held steady at {avgHandleTime} minutes.
  </p>
  <p className="text-gray-300">
    To manage the current call load efficiently, agents would need to collectively handle {totalMinutesNeeded.toFixed(0)} minutes of talk time. Based on weekday call averages and agent availability, we recommend a minimum of <span className="text-red-400 font-bold">{requiredAgents} full-time dedicated operators</span>.
  </p>
</section>
{/* Bar + Pie Chart Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
  {/* Bar Chart */}
  <div className="bg-gray-700 p-6 rounded shadow">
    <h3 className="text-lg font-semibold mb-4 text-white">Call Volume Breakdown</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={[
        { name: 'Inbound', value: total.inbound },
        { name: 'Answered', value: total.answered },
        { name: 'Abandoned', value: total.abandoned },
        { name: 'Missed', value: total.missed },
      ]} barSize={40}>
        <XAxis dataKey="name" stroke="#fff" angle={-35} textAnchor="end" interval={0} />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Bar dataKey="value" fill="#a78bfa" />
      </BarChart>
    </ResponsiveContainer>
    <p className="mt-4 text-sm text-gray-300">
      This bar chart illustrates the volume of inbound, answered, abandoned, and missed calls.
    </p>
  </div>

  {/* Pie Chart */}
  <div className="bg-gray-700 p-6 rounded shadow">
    <h3 className="text-lg font-semibold mb-4 text-white text-center">Call Disposition Summary</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={[
            { name: 'Answered', value: total.answered },
            { name: 'Abandoned', value: total.abandoned },
            { name: 'Missed', value: total.missed }
          ]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ color: '#fff' }} />
      </PieChart>
    </ResponsiveContainer>
    <p className="mt-4 text-sm text-gray-300 text-center">
      This pie chart summarizes call disposition data for the selected week(s).
    </p>
  </div>
</div>
{/* Weekly Trends Line Chart */}
<section className="bg-gray-700 p-6 rounded shadow mb-10">
  <h2 className="text-xl font-semibold mb-4">Weekly Trends (Line Chart)</h2>
  <p className="text-gray-300 text-sm mb-4">
    This chart illustrates the trends in call volume and outcomes across each week.
  </p>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={allWeeks.map(week => ({
      week,
      answered: data[week].answered,
      abandoned: data[week].abandoned,
      missed: data[week].missed
    }))}>
      <XAxis dataKey="week" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="answered" stroke="#4CAF50" name="Answered Calls" />
      <Line type="monotone" dataKey="abandoned" stroke="#F44336" name="Abandoned Calls" />
      <Line type="monotone" dataKey="missed" stroke="#FF9800" name="Missed Calls" />
    </LineChart>
  </ResponsiveContainer>
</section>

{/* Detailed Table */}
<section className="bg-gray-700 p-6 rounded shadow mb-10">
  <h2 className="text-lg font-semibold mb-4 text-white">Detailed Weekly Performance</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto text-sm text-left text-gray-300">
      <thead className="bg-gray-600 text-white">
        <tr>
          <th className="px-4 py-2">Week</th>
          <th className="px-4 py-2">Inbound</th>
          <th className="px-4 py-2">Answered</th>
          <th className="px-4 py-2">Abandoned</th>
          <th className="px-4 py-2">Missed</th>
          <th className="px-4 py-2">Avg Handle Time</th>
        </tr>
      </thead>
      <tbody>
        {allWeeks.map(week => (
          <tr key={week} className="border-b border-gray-600">
            <td className="px-4 py-2">{week}</td>
            <td className="px-4 py-2">{data[week].inbound}</td>
            <td className="px-4 py-2">{data[week].answered}</td>
            <td className="px-4 py-2">{data[week].abandoned}</td>
            <td className="px-4 py-2">{data[week].missed}</td>
            <td className="px-4 py-2">{data[week].avgHandleTime.toFixed(2)} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

{/* Strategic Action Plan */}
<section className="bg-gray-700 p-6 rounded shadow mb-10">
  <h2 className="text-lg font-semibold mb-4 text-white">Strategic Action Plan</h2>
  <ul className="list-disc list-inside space-y-2 text-gray-300">
    <li>Enable hourly call tracking on the phone system.</li>
    <li>Deploy smart scheduling software based on hourly call trends.</li>
    <li>Establish agent performance KPIs (answer rate, average speed of answer).</li>
    <li>Conduct IVR usability testing with real patients.</li>
    <li>Schedule weekly reviews of abandonment and wait time trends.</li>
  </ul>
</section>
{/* Summary of Key Insights */}
<section className="bg-gray-700 p-6 rounded shadow">
  <h2 className="text-lg font-semibold mb-4 text-white">Summary of Key Insights</h2>
  <p className="text-sm text-gray-300">
    This report provides an overview of performance gaps in your call center process.
    Staffing and IVR performance are contributing to high abandonment. Use this data
    to prioritize staffing, scheduling, and system changes, and set a 30-60-90 day
    performance improvement plan for measurable impact.
  </p>
</section>
      </div> {/* End inner container */}
    </div>   {/* End screen wrapper */}
  );
}
