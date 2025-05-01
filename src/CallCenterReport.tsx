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
    <div className="min-h-screen bg-gray-900 py-12 px-4 flex justify-center text-white">
      <div className="relative w-full max-w-screen-lg bg-gray-800 shadow-lg rounded-lg px-6 md:px-12 py-10">
        {/* ✅ PDF Download Button - top-right INSIDE card */}
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

        <h1 className="text-3xl font-bold mb-4 text-center">Call Center Performance Analysis</h1>
        <p className="text-md text-center mb-8 text-gray-300">
          Comprehensive review of call center metrics, staffing needs, missed call rates, IVR-related issues, and performance summaries across all weeks.
        </p>

        <section className="bg-gray-700 p-6 rounded mb-8 shadow">
          <h2 className="text-xl font-semibold mb-3 text-white">Executive Summary</h2>
          <p className="mb-3 text-gray-300">
            During the analysis period, over {total.inbound} inbound calls were received. Approximately {total.answered} were successfully answered, while {total.abandoned} calls were abandoned and {total.missed} were missed. Average handle time held steady at {avgHandleTime} minutes.
          </p>
          <p className="text-gray-300">
            To manage the current call load efficiently, agents would need to collectively handle {totalMinutesNeeded.toFixed(0)} minutes of talk time. Based on weekday call averages and agent availability, we recommend a minimum of <span className="text-red-400 font-bold">{requiredAgents} full-time dedicated operators</span>.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="bg-gray-700 p-6 rounded shadow-md shadow-black/40">
  <div className="flex justify-between items-center mb-3">
    <h3 className="text-lg font-semibold text-white mb-3">Call Volume Breakdown</h3>
  </div>
  <div className="flex items-center gap-2 mb-4">
    <label htmlFor="week-select" className="text-sm text-gray-300">
      Select Week:
    </label>
    <select
      id="week-select"
      value={selectedWeek}
      onChange={(e) => setSelectedWeek(e.target.value)}
      className="bg-gray-600 text-white px-3 py-1 rounded focus:outline-none focus:ring focus:ring-blue-400"
    >
      <option value="All">All Weeks</option>
      {allWeeks.map((week) => (
        <option key={week} value={week}>
          {week}
        </option>
      ))}
    </select>
  </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
  {/* Bar Chart Section */}
  <div className="bg-gray-700 p-6 rounded shadow">
    <h3 className="text-lg font-semibold mb-4 text-white">Call Volume Breakdown</h3>
   <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={barData}
    barSize={40}
    margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
  >
    <XAxis
      dataKey="name"
      stroke="#fff"
      angle={-35}
      textAnchor="end"
      interval={0}
    />
    <YAxis stroke="#fff" />
    <Tooltip />
    <Bar dataKey="value" fill="#a78bfa" />
  </BarChart>
</ResponsiveContainer>
    <p className="mt-4 text-gray-300 text-sm">
      This bar chart illustrates the volume of inbound, answered, abandoned, and missed calls.
    </p>
  </div>
  <div className="bg-gray-700 p-6 rounded shadow">
    <h3 className="text-lg font-semibold mb-4 text-white text-center">Call Disposition Summary</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <p className="mt-4 text-gray-300 text-sm text-center">
      This pie chart visually summarizes the distribution of answered, abandoned, and missed calls.
    </p>
  </div>
</div>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-4 text-gray-300 text-sm">
              This pie chart visually summarizes the distribution of answered, abandoned, and missed calls.
            </p>
          </div>
        </div>
        <section className="bg-gray-700 p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Weekly Trends (Line Chart)</h2>
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
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="answered" stroke="#4CAF50" name="Answered Calls" />
              <Line type="monotone" dataKey="abandoned" stroke="#F44336" name="Abandoned Calls" />
              <Line type="monotone" dataKey="missed" stroke="#FF9800" name="Missed Calls" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-gray-700 p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Detailed Weekly Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm text-left divide-y divide-gray-600 text-gray-300">
              <thead>
                <tr className="bg-gray-800 text-white">
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
                  <tr key={week} className="border-b border-gray-600">
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
        <section className="bg-gray-700 p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Strategic Action Plan</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Enable hourly call tracking on the phone system.</li>
            <li>Deploy smart scheduling software based on hourly call trends.</li>
            <li>Establish agent performance KPIs (answer rate, average speed of answer).</li>
            <li>Conduct IVR usability testing with real patients.</li>
            <li>Schedule weekly reviews of abandonment and wait time trends.</li>
          </ul>
        </section>

        <section className="bg-gray-700 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">Summary of Key Insights</h2>
          <p className="text-gray-300 text-sm">
            This report provides an overview of performance gaps in your call center process. Staffing and IVR performance are contributing to high abandonment. Use this data to prioritize staffing, scheduling, and system changes, and set a 30-60-90 day performance improvement plan for measurable impact.
          </p>
        </section>

      </div>
    </div>
  );
}
