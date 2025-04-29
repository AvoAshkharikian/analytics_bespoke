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
      <div className="p-6 font-sans max-w-3xl w-full bg-white shadow-lg rounded-lg">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">Call Center Performance Analysis</h1>
        <p className="text-md text-center mb-6 text-gray-600">
          Comprehensive review of call center metrics, staffing needs, missed call rates, IVR-related issues, and performance summaries across all weeks.
        </p>

        {/* Rest of the report content remains unchanged */}
      </div>
    </div>
  );
}
