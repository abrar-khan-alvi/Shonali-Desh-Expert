import React, { useState } from 'react';
import { Search, Calendar, Filter, ExternalLink, Star } from 'lucide-react';
import { Card, Input, Button, Badge } from '../components/UI';
import { useExpert } from '../context/ExpertContext';

const HistoryPage: React.FC = () => {
  const { expert } = useExpert();
  const [searchTerm, setSearchTerm] = useState('');

  // Transform and filter consultRequests for history
  const historyData = expert?.consultRequests
    ? Object.entries(expert.consultRequests)
      .map(([key, value]: [string, any]) => ({ id: key, ...value }))
      // Show completed or cancelled requests in history
      .filter((req: any) => req.status === 'completed' || req.status === 'cancelled')
    : [];

  const filteredData = historyData.filter((item: any) =>
    (item.farmerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.problem || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!expert) {
    return <div className="p-10 text-center">Loading history...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <h1 className="text-4xl font-bold text-text-dark">Consultation History</h1>
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Select Date
          </Button>
          <Button variant="outline" className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-md">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100 bg-background-light">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by farmer name or topic..."
              className="pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-light text-text-light text-sm uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-8 py-5 cursor-pointer hover:bg-gray-100">Date</th>
                <th className="px-8 py-5">Farmer Name</th>
                <th className="px-8 py-5">Topic</th>
                <th className="px-8 py-5">Earnings</th>
                <th className="px-8 py-5 text-center">Rating</th>
                <th className="px-8 py-5 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6 text-text-light whitespace-nowrap text-lg">
                    {item.date || 'N/A'}
                  </td>
                  <td className="px-8 py-6 font-semibold text-text-dark text-lg">
                    {item.farmerName || 'Unknown'}
                  </td>
                  <td className="px-8 py-6 text-text-light">
                    <Badge color="green">{item.problem ? item.problem.substring(0, 20) + '...' : 'Consultation'}</Badge>
                  </td>
                  <td className="px-8 py-6 text-primary-green font-bold text-lg">
                    ৳ {expert.paymentPerReport || 0}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-yellow-50 rounded-lg">
                      <span className="font-bold text-yellow-700 mr-2 text-lg">{item.rating || '-'}</span>
                      <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a href="#" className="text-primary-green hover:text-[#1e523a] text-base font-medium inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      View Report <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-lg text-text-light">No history found matching your search.</p>
          </div>
        )}

        <div className="p-6 border-t border-gray-100 bg-background-light flex justify-between items-center text-base text-text-light">
          <span>Showing {filteredData.length} records</span>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HistoryPage;