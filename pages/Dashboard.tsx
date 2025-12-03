import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BadgeDollarSign, CheckCircle2, Star, MapPin } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { useExpert } from '../context/ExpertContext';

const DashboardPage: React.FC = () => {
  const { expert, toggleAvailability } = useExpert();
  const [isOnline, setIsOnline] = useState(expert?.hasAvailable || false);

  // Update local state if expert data changes
  useEffect(() => {
    if (expert) {
      setIsOnline(expert.hasAvailable || false);
    }
  }, [expert]);

  const handleToggle = async () => {
    // Optimistic local update for immediate UI feedback
    setIsOnline(!isOnline);
    await toggleAvailability();
  };

  // Transform consultRequests object to array and sort by date
  const allRequests = expert?.consultRequests
    ? Object.entries(expert.consultRequests)
      .map(([key, value]: [string, any]) => ({ id: key, ...value }))
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    : [];

  // Use real metrics or default to 0
  const totalEarnings = expert?.paymentPerReport && expert?.consultRequests
    ? Object.values(expert.consultRequests).filter((r: any) => r.status === 'completed').length * expert.paymentPerReport
    : 0;

  const completedConsults = expert?.consultRequests
    ? Object.values(expert.consultRequests).filter((r: any) => r.status === 'completed').length
    : 0;

  // Placeholder for monthly data until we have a real structure for it
  const monthlyEarningsData = [
    { name: 'Week 1', earnings: 0 },
    { name: 'Week 2', earnings: 0 },
    { name: 'Week 3', earnings: 0 },
    { name: 'Week 4', earnings: 0 },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, iconColorClass }: any) => (
    <Card className="p-8 flex items-center justify-between transition-transform hover:-translate-y-1 duration-200 border-l-4 border-l-primary-green">
      <div>
        <p className="text-base font-medium text-text-light mb-2">{title}</p>
        <p className="text-4xl font-bold text-text-dark">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${colorClass}`}>
        <Icon className={`w-8 h-8 ${iconColorClass}`} />
      </div>
    </Card>
  );

  if (!expert) {
    return <div className="p-10 text-center">Loading expert data...</div>;
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-text-dark">Welcome back, {expert.metadata?.name || expert.name || 'Expert'}</h1>
          <p className="text-lg text-text-light mt-2">Here's what's happening in your territory today.</p>
        </div>
        <div className="flex items-center bg-white rounded-xl p-2 shadow-sm border border-gray-200">
          <span className={`text-base font-medium mr-4 ml-3 ${isOnline ? 'text-primary-green' : 'text-text-light'}`}>
            {isOnline ? 'Available' : 'Offline'}
          </span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 ${isOnline ? 'bg-primary-green' : 'bg-gray-200'
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOnline ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Earnings"
          value={`৳ ${totalEarnings.toLocaleString()}`}
          icon={BadgeDollarSign}
          colorClass="bg-green-50"
          iconColorClass="text-primary-green"
        />
        <StatCard
          title="Completed Consults"
          value={completedConsults}
          icon={CheckCircle2}
          colorClass="bg-green-50"
          iconColorClass="text-primary-green"
        />
        <StatCard
          title="Payment / Report"
          value={`৳ ${expert.paymentPerReport || 0}`}
          icon={Star}
          colorClass="bg-yellow-50"
          iconColorClass="text-accent-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* New Requests Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-md">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-text-dark">Consultation Requests</h2>
              <Badge color="green">{allRequests.length} Total</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-light text-text-light text-sm uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Farmer</th>
                    <th className="px-8 py-5">Problem Summary</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allRequests.map((request: any) => {
                    let problemText = 'No details';
                    try {
                      if (request.shortProblem) {
                        // Check if it's a JSON string
                        if (typeof request.shortProblem === 'string' && request.shortProblem.trim().startsWith('{')) {
                          const parsed = JSON.parse(request.shortProblem);
                          // Extract the first problem from the structure if possible
                          if (parsed.aiConsultations) {
                            const firstKey = Object.keys(parsed.aiConsultations)[0];
                            if (firstKey && parsed.aiConsultations[firstKey].problems && parsed.aiConsultations[firstKey].problems.length > 0) {
                              problemText = parsed.aiConsultations[firstKey].problems[0];
                            }
                          }
                        } else {
                          problemText = request.shortProblem;
                        }
                      }
                    } catch (e) {
                      problemText = request.shortProblem || 'Error parsing details';
                    }

                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-semibold text-lg text-text-dark">{request.farmerId || 'Unknown'}</div>
                          <div className="text-sm text-text-light">{request.fieldId || 'Field ID'}</div>
                        </td>
                        <td className="px-8 py-6 max-w-xs truncate text-lg text-text-light" title={problemText}>
                          {problemText}
                        </td>
                        <td className="px-8 py-6">
                          <Badge color={request.status === 'completed' ? 'green' : request.status === 'pending' ? 'yellow' : 'red'}>
                            {request.status || 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-base text-text-light">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recent'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.hash = `#/request/${request.id}`}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {allRequests.length === 0 && (
              <div className="p-10 text-center text-text-light text-lg">No requests found.</div>
            )}
          </Card>
        </div>

        {/* Mini Chart */}
        <div className="lg:col-span-1">
          <Card className="h-full p-8 shadow-md">
            <h2 className="text-3xl font-semibold text-text-dark mb-8">Earnings</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarningsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#718096', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    hide={true}
                  />
                  <Tooltip
                    cursor={{ fill: '#F7FAFC' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#2D3748' }}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="#276749"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 text-center">
              <p className="text-base text-text-light">This Month's Projection</p>
              <p className="text-3xl font-bold text-primary-green mt-2">৳ 0</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;