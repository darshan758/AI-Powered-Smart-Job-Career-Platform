import { useState, useEffect } from 'react';
import { getAnalytics } from '../src/api/adminApi';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics().then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  const { totals, signupsOverTime, popularRoles, topMissingSkills, avgCompletionRate } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Top-line stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Users', value: totals.totalUsers },
          { label: 'Resumes Analyzed', value: totals.totalResumesAnalyzed },
          { label: 'Job Postings', value: totals.totalJobPostings },
          { label: 'Roadmaps Created', value: totals.totalRoadmaps },
          { label: 'Avg. Completion', value: `${avgCompletionRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signups over time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Signups Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={signupsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular target roles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Popular Target Roles</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={popularRoles}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top missing skills — full width */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Missing Skills (Platform-Wide)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topMissingSkills} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="skill" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;