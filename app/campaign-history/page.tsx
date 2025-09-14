"use client";

import {
  Users,
  Send,
  Zap,
  Clock,
  History,
  Plus,
  Copy,
  Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initial fetch
    fetchCampaigns();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchCampaigns();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/campaigns/get");
      const updatedCampaigns = await response.json();
      setCampaigns(updatedCampaigns);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch campaign updates:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Campaign History</h1>
          </div>
          <button onClick={()=>router.push('/create-campaign')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        {campaigns?.length > 0 ? (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.campaign_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          campaign.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : campaign.status === "running"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Created on {campaign.date}
                    </p>

                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {campaign.audienceSize?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-500">total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-green-500" />
                        <span className="font-medium">
                          {campaign.sent?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-500">sent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{campaign.failed || 0}</span>
                        <span className="text-gray-500">failed</span>
                      </div>
                      {campaign.pending > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{campaign.pending}</span>
                          <span className="text-gray-500">pending</span>
                        </div>
                      )}
                    </div>

                    {/* Progress bar for running campaigns */}
                    {campaign.status === "running" && campaign.audienceSize > 0 && (
                      <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                ((campaign.sent + campaign.failed) / campaign.audienceSize) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(
                            ((campaign.sent + campaign.failed) / campaign.audienceSize) * 100
                          )}% complete
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Copy className="w-4 h-4" />
                      Clone
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first campaign to start reaching your audience
            </p>
            <button onClick={()=>router.push('/create-campaign')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Plus className="w-5 h-5" />
              Create Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignHistory;