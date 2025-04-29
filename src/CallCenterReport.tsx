import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend, ResponsiveContainer } from 'recharts';

const data: Record<string, {
  inbound: number;
  answered: number;
  abandoned: number;
  missed: number;
  avgHandleTime: number;
  staffNeeded: number;
}> = {
  "04/07-04/11": { inbound: 1148, answered: 703, abandoned: 187, missed: 256, avgHandleTime: 4.10, staffNeeded: 2 },
  "04/14-04/18": { inbound: 1065, answered: 671, abandoned: 195, missed: 196, avgHandleTime: 4.23, staffNeeded: 2 },
  "04/21-04/25": { inbound: 1039, answered: 604, abandoned: 212, missed: 223, avgHandleTime: 3.76, staffNeeded: 2 }
};

const colors = ['#4CAF50', '#F44336', '#FF9800'];

export default function CallCenterReport() {
  const [selectedWeek, setSelectedWeek] = useState<string>("04/07-04/11");

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
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold text-center">Call Center Weekly Analytics Report</h1>
      <div className="text-center my-4">
        {Object.keys(data).map(week => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`mx-2 px-4 py-2 rounded ${selectedWeek === week ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {week}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-col md:flex-row justify-center items-center">
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="text-lg font-semibold ml-8">
          <p>Average Handle Time: {currentData.avgHandleTime.toFixed(2)} minutes</p>
          <p>Recommended Staffing: <strong className="text-red-500">3 dedicated operators</strong></p>
          <p className="mt-4 text-gray-700">We recommend reviewing the IVR menu structure to reduce call abandonment rates and improve customer satisfaction.</p>
        </div>
      </div>
    </div>
  );
}
