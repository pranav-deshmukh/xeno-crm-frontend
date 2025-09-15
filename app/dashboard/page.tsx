'use client'

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  MessageCircle,
  Target,
  Mail,
  Smartphone,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';


interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

interface Campaign {
  campaign_id: number;
  name: string;
  status: string;
  sent: number;
  audience: number;
  date: string;
}

interface CampaignRowProps {
  campaign: Campaign;
}

const XenoDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 127543,
    totalSegments: 24,
    totalCampaigns: 18,
    avgDeliveryRate: 94.2,
    recentCampaigns: [
      { campaign_id: 1, name: 'Summer Sale 2024', status: 'completed', sent: 12543, audience: 13000, date: '2024-01-15' },
      { campaign_id: 2, name: 'New Product Launch', status: 'running', sent: 3240, audience: 8500, date: '2024-01-14' },
      { campaign_id: 3, name: 'Win-back Inactive', status: 'completed', sent: 5678, audience: 6000, date: '2024-01-13' }
    ],
    topSegments: [
      { name: 'High Value Customers', size: 15632, engagement: 'high' },
      { name: 'Recent Purchasers', size: 23445, engagement: 'medium' },
      { name: 'Inactive 90 Days', size: 8967, engagement: 'low' }
    ]
  });

  
  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/dashboard/stats`);
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  fetchDashboardData();
  const interval = setInterval(fetchDashboardData, 30000); 
  return () => clearInterval(interval);
}, []);

  const StatCard:React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className={`flex items-center text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );

  const CampaignRow: React.FC<CampaignRowProps> = ({ campaign }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-medium text-gray-900">{campaign.name}</h4>
          <span className={`px-2 py-1 text-xs rounded-full ${
            campaign.status === 'completed' ? 'bg-green-100 text-green-800' : 
            campaign.status === 'running' ? 'bg-blue-100 text-blue-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {campaign.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{campaign.sent.toLocaleString()} sent</span>
          <span>{campaign.audience.toLocaleString()} audience</span>
          <span>{campaign.date}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">
          {Math.round((campaign.sent / campaign.audience) * 100)}%
        </div>
        <div className="text-xs text-gray-500">delivery rate</div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50 flex">
      
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Customers"
              value={dashboardStats.totalCustomers.toLocaleString()}
              change={12.5}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Active Segments"
              value={dashboardStats.totalSegments}
              change={8.2}
              icon={Target}
              color="green"
            />
            <StatCard
              title="Campaigns This Month"
              value={dashboardStats.totalCampaigns}
              change={-5.1}
              icon={Send}
              color="purple"
            />
            <StatCard
              title="Avg Delivery Rate"
              value={`${dashboardStats.avgDeliveryRate}%`}
              change={3.4}
              icon={CheckCircle}
              color="orange"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Campaigns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dashboardStats.recentCampaigns.map((campaign) => (
                      <CampaignRow key={campaign.campaign_id} campaign={campaign} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Top Segments */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <Send className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">Create Campaign</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Target className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">New Segment</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">View Analytics</span>
                  </button>
                </div>
              </div>

              {/* Top Segments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Segments</h3>
                <div className="space-y-4">
                  {dashboardStats.topSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{segment.name}</p>
                        <p className="text-gray-500 text-xs">{segment.size.toLocaleString()} customers</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        segment.engagement === 'high' ? 'bg-green-100 text-green-800' :
                        segment.engagement === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {segment.engagement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>
          </div>

          {/* Campaign Performance Chart Placeholder */}
          {/* <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Campaign Performance Trends</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  7D
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg">
                  30D
                </button>
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  90D
                </button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Campaign performance chart would go here</p>
              </div>
            </div>
          </div> */}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default XenoDashboard;