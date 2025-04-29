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
  const [selectedWeek, setSelectedWeek] = React.useState<string>("04/07-04/11");
  const currentData = data[selectedWeek];

  const pieData = [
    { name: 'Answered', value: currentData.answered },
    { name: 'Abandoned', value: currentData.abandoned },
    { name: 'Missed', value: currentData.missed }
  ];

  const barData = [
    { name: 'Inbound Calls', value: currentData.inbound },
    { name: 'Answered Calls', value: currentData.answered },
    { name: 'Abandoned Calls', value: currentData.abandoned },
    { name: 'Missed Calls', value: currentData.missed }
  ];

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">📞 Call Center Performance Report</h1>
      <p className="text-md text-center mb-6 text-gray-600">
        Data-driven insights across 3 recent weeks to assess operator capacity, call routing issues, and performance efficiency.
      </p>

      <div className="mb-8 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">📝 Executive Summary</h2>
        <p className="text-gray-700 mb-2">
          This report evaluates inbound call trends, operator performance, and abandonment issues. Over the three-week span, call volumes slightly decreased, yet the percentage of answered calls also dropped. Missed and abandoned calls suggest the current staffing model may be insufficient and IVR menus may be frustrating users.
        </p>
        <p className="text-gray-700">
          Based on handle time and call volume, we recommend <strong>3 dedicated operators</strong> to ensure optimal response times and improved customer experience.
        </p>
      </div>

      <div className="mb-6 text-center">
        {Object.keys(data).map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`mx-2 px-4 py-2 rounded ${selectedWeek === week ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {week}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-center">📊 Weekly Call Distribution</h3>
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
          <h3 className="text-lg font-semibold mb-2 text-center">📈 Call Outcome Breakdown</h3>
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

      <div className="mt-8 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">🔍 Interpretation & Recommendation</h2>
        <p className="text-gray-700 mb-2">
          The <strong>average handle time</strong> across all weeks hovered around 4 minutes. When calculated against total inbound volume,
          this suggests that 2 staff are insufficient to manage peak volume, especially during high-abandonment periods.
        </p>
        <p className="text-gray-700 mb-2">
          Many calls are missed or abandoned, likely due to a long wait time or confusing IVR menu. We recommend reviewing IVR scripts and simplifying call paths to reduce friction.
        </p>
        <p className="text-gray-700">
          For immediate operational improvement, staff should increase from 2 → <strong className="text-red-600">3 dedicated operators</strong> to match workload and reduce missed opportunities.
        </p>
      </div>
    </div>
  );
}
