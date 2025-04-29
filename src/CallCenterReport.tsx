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
  const combinedData = allWeeks.reduce(
    (totals, week) => {
      const w = data[week];
      return {
        inbound: totals.inbound + w.inbound,
        answered: totals.answered + w.answered,
        abandoned: totals.abandoned + w.abandoned,
        missed: totals.missed + w.missed,
        avgHandleTime: totals.avgHandleTime + w.avgHandleTime,
        staffNeeded: totals.staffNeeded + w.staffNeeded
      };
    },
    { inbound: 0, answered: 0, abandoned: 0, missed: 0, avgHandleTime: 0, staffNeeded: 0 }
  );

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

  const avgHandleTime = (total.avgHandleTime / aggregatedData.length).toFixed(2);

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto bg-white shadow rounded-md">
      <h1 className="text-3xl font-bold mb-2 text-center">Call Center Performance Analysis</h1>
      <p className="text-md text-center mb-6 text-gray-600">
        Comprehensive review of call center metrics, staffing needs, missed call rates, IVR-related issues, and performance summaries across all weeks.
      </p>

      <div className="mb-6 text-center">
        <button
          onClick={() => setSelectedWeek('All')}
          className={`mx-2 px-4 py-2 rounded ${selectedWeek === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >All Weeks</button>
        {allWeeks.map(week => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`mx-2 px-4 py-2 rounded ${selectedWeek === week ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >{week}</button>
        ))}
      </div>

      <section className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
        <p className="mb-2 text-gray-700">
          Over the reviewed period, the call center experienced a consistent call volume of over 1,000 inbound calls per week. However, a significant number of these calls were missed or abandoned — often due to insufficient staffing and possibly ineffective IVR design. While the average handle time remained stable (~4 minutes), the abandonment and missed call rates suggest that the system could not efficiently handle the volume.
        </p>
        <p className="text-gray-700">
          We strongly recommend transitioning from 2 to <span className="text-red-600 font-bold">3 full-time dedicated operators</span> to reduce missed opportunities, improve service response, and lower abandonment rates.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-center">Call Volume Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
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
        </div>
      </div>

      <section className="mt-8 bg-gray-50 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Interpretation & Operational Recommendations</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Inbound Load:</strong> Weekly inbound calls exceed 1,000. Without corresponding staffing, response times suffer.</li>
          <li><strong>Missed/Abandoned Rates:</strong> Nearly 40–45% of calls are not answered live. This creates friction and hurts patient experience.</li>
          <li><strong>Staffing Need:</strong> Based on call load and 4-minute average handle time, 3 operators are required to prevent overflow queues.</li>
          <li><strong>IVR System:</strong> High abandonment could indicate caller frustration or confusion with menu options. Consider simplifying prompts.</li>
          <li><strong>Recommendation:</strong> Add one more full-time operator, improve IVR clarity, and consider tracking hourly call volume for better scheduling.</li>
        </ul>
      </section>
    </div>
  );
}
