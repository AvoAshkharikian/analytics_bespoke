import * as React from 'react';
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
  ResponsiveContainer
} from 'recharts';
import { LineChart, Line } from 'recharts';

// --- Data Model and Source ---
type WeekData = {
  inbound: number;
  answered: number;
  abandoned: number;
  missed: number;
  avgHandleTime: number;
  staffNeeded: number;
};

const data: Record<string, WeekData> = {
  "04/07-04/11": { inbound: 1148, answered: 703, abandoned: 187, missed: 256, avgHandleTime: 4.10, staffNeeded: 2 },
  "04/14-04/18": { inbound: 1065, answered: 671, abandoned: 195, missed: 196, avgHandleTime: 4.23, staffNeeded: 2 },
  "04/21-04/25": { inbound: 1039, answered: 604, abandoned: 212, missed: 223, avgHandleTime: 3.76, staffNeeded: 2 }
};

const colors = ['#4CAF50', '#F44336', '#FF9800'];

export default function CallCenterReport() {
  const [selectedWeek, setSelectedWeek] = React.useState<string | 'All'>('All');

  const allWeeks = Object.keys(data);
  const weekKeys = selectedWeek === 'All' ? allWeeks : [selectedWeek];
  const aggregatedData = weekKeys.map(week => data[week]);

  const total = aggregatedData.reduce(
    (acc, cur) => {
      return {
        inbound: acc.inbound + cur.inbound,
        answered: acc.answered + cur.answered,
        abandoned: acc.abandoned + cur.abandoned,
        missed: acc.missed + cur.missed,
        avgHandleTime: acc.avgHandleTime + cur.avgHandleTime,
        staffNeeded: acc.staffNeeded + cur.staffNeeded
      };
    },
    { inbound: 0, answered: 0, abandoned: 0, missed: 0, avgHandleTime: 0, staffNeeded: 0 }
  );

  const pieData = [
    { name: 'Answered', value: total.answered },
    { name: 'Abandoned', value: total.abandoned },
    { name: 'Missed', value: total.missed }
  ];

  const barData = [
    { name: 'Inbound Calls', value: total.inbound },
    { name: 'Answered Calls', value: total.answered },
    { name: 'Abandoned Calls', value: total.abandoned },
    { name: 'Missed Calls', value: total.missed }
  ];

  const avgHandleTime = aggregatedData.length > 0 ? (total.avgHandleTime / aggregatedData.length).toFixed(2) : '0.00';
  const availableMinutesPerAgent = 420;
  const callsPerDay = total.inbound / (5 * weekKeys.length);
  const totalMinutesNeeded = total.answered * parseFloat(avgHandleTime);
  const requiredAgents = Math.ceil((callsPerDay * parseFloat(avgHandleTime)) / availableMinutesPerAgent);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="relative p-6 font-sans max-w-3xl w-full bg-white shadow-lg rounded-lg px-6 md:px-12">
        <div className="absolute top-6 right-8 z-10">
  <button
    onClick={() => window.print()}
    className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded shadow-md hover:bg-blue-800 transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12.75h10.5m-10.5 3h10.5M6 3.75h12c.414 0 .75.336.75.75v4.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-4.5c0-.414.336-.75.75-.75zm1.5 0v2.25h9V3.75H7.5z" />
    </svg>
    Download PDF
  </button>
</div>
        <h1 className="text-3xl font-bold mb-2 text-center">Call Center Performance Analysis</h1>
        <p className="text-md text-center mb-6 text-gray-600">
          Comprehensive review of call center metrics, staffing needs, missed call rates, IVR-related issues, and performance summaries across all weeks.
        </p>

        {/* Additional report content restored below */}
<section className="bg-white p-4 rounded mb-6">
  <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
  <p className="mb-2 text-gray-700">
    During the analysis period, over {total.inbound} inbound calls were received. Approximately {total.answered} were successfully answered, while {total.abandoned} calls were abandoned and {total.missed} were missed. Average handle time held steady at {avgHandleTime} minutes.
  </p>
  <p className="text-gray-700">
    To manage the current call load efficiently, agents would need to collectively handle {totalMinutesNeeded.toFixed(0)} minutes of talk time. Based on weekday call averages and agent availability, we recommend a minimum of <span className="text-red-600 font-bold">{requiredAgents} full-time dedicated operators</span>. This accounts for overlapping call volume and prevents system bottlenecks.
  </p>
</section>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-white p-4 rounded shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">Call Volume Breakdown</h3>
      <div>
        <button
          onClick={() => setSelectedWeek('All')}
          className={`mx-1 px-3 py-1 rounded ${selectedWeek === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >All</button>
        {allWeeks.map(week => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`mx-1 px-3 py-1 rounded ${selectedWeek === week ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >{week}</button>
        ))}
      </div>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
    <p className="mt-4 text-gray-700 text-sm">
      This bar chart illustrates the volume of inbound, answered, abandoned, and missed calls. A high proportion of missed or abandoned calls indicates potential understaffing and inefficiencies in live response routing.
    </p>
  </div>

  <div className="bg-white p-4 rounded shadow-md">
    <h3 className="text-lg font-semibold mb-2 text-center">Call Disposition Summary</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    <p className="mt-4 text-gray-700 text-sm">
      This pie chart visually summarizes the distribution of answered, abandoned, and missed calls. The high abandonment rate may point to long IVR navigation or insufficient staffing during peak hours.
    </p>
  </div>
</div>

<section className="mt-10 bg-white p-6 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Weekly Trends (Line Chart)</h2>
  <p className="text-gray-700 text-sm mb-4">
    This chart illustrates the trends in call volume and outcomes across each week, helping identify whether improvements are being made over time.
  </p>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={allWeeks.map(week => ({
      week,
      answered: data[week].answered,
      abandoned: data[week].abandoned,
      missed: data[week].missed
    }))}>
      <XAxis dataKey="week" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="answered" stroke="#4CAF50" name="Answered Calls" />
      <Line type="monotone" dataKey="abandoned" stroke="#F44336" name="Abandoned Calls" />
      <Line type="monotone" dataKey="missed" stroke="#FF9800" name="Missed Calls" />
    </LineChart>
  </ResponsiveContainer>
</section>

<section className="mt-10 bg-white p-6 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Detailed Weekly Performance</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border text-sm text-left divide-y divide-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-6 py-3 whitespace-nowrap">Week</th>
          <th className="px-4 py-2">Inbound</th>
          <th className="px-4 py-2">Answered</th>
          <th className="px-4 py-2">Abandoned</th>
          <th className="px-4 py-2">Missed</th>
          <th className="px-4 py-2">Avg Handle Time</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([week, values]) => (
          <tr key={week} className="border-b">
            <td className="px-4 py-2 font-medium">{week}</td>
            <td className="px-4 py-2">{values.inbound}</td>
            <td className="px-4 py-2">{values.answered}</td>
            <td className="px-4 py-2">{values.abandoned}</td>
            <td className="px-4 py-2">{values.missed}</td>
            <td className="px-4 py-2">{values.avgHandleTime.toFixed(2)} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

<section className="mt-10 bg-white p-6 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Strategic Action Plan</h2>
  <ul className="list-disc list-inside text-gray-700 space-y-1">
    <li>Enable hourly call tracking on the phone system.</li>
    <li>Deploy smart scheduling software based on hourly call trends.</li>
    <li>Establish agent performance KPIs (answer rate, average speed of answer).</li>
    <li>Conduct IVR usability testing with real patients.</li>
    <li>Schedule weekly reviews of abandonment and wait time trends.</li>
  </ul>
</section>

<section className="mt-10 bg-white p-6 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Summary of Key Insights</h2>
  <p className="text-gray-700 text-sm">
    This report provides an overview of performance gaps in your call center process. Staffing and IVR performance are contributing to high abandonment. Use this data to prioritize staffing, scheduling, and system changes, and set a 30-60-90 day performance improvement plan for measurable impact.
  </p>
</section>

</div>
</div>
  );
}
