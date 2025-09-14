'use client'

import React, { useState, useEffect } from 'react';
import { Send, Users, MessageCircle, Calendar, ChevronDown, AlertCircle, Sparkles, RefreshCw, Copy, Check, Wand2, Target, Clock, Zap, Heart, Crown } from 'lucide-react';

interface Segment {
  segment_id: string;
  name: string;
  audience_size: number;
  description?: string;
}

type SegmentDetails = Segment

interface AISuggestion {
  id?: string;
  message: string;
  approach?: string;
  expected_engagement?: 'high' | 'medium' | 'low';
  character_count?: number;
  tone_match?: string;
  target_emotion?: string;
  cta_strength?: string;
}


const CampaignCreationUI = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [customMessage, setCustomMessage] = useState('Hi {{name}}, here\'s 10% off on your next order!');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [segmentDetails, setSegmentDetails] = useState<SegmentDetails | null>(null);
  
  // AI Integration States
  const [useAI, setUseAI] = useState(false); 
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiObjective, setAiObjective] = useState('');
  const [brandTone, setBrandTone] = useState('friendly');
  const [offerType, setOfferType] = useState('discount');
  const [customContext, setCustomContext] = useState('');
  const [budgetRange, setBudgetRange] = useState('medium');
  const [campaignDuration, setCampaignDuration] = useState('medium');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedAISuggestion, setSelectedAISuggestion] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Fetch saved segments on component mount
  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/segments');
      const data = await response.json();
      setSegments(data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const fetchSegmentDetails = async (segmentId:string) => {
    if (!segmentId) {
      setSegmentDetails(null);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/segments/${segmentId}`);
      const data = await response.json();
      setSegmentDetails(data);
    } catch (error) {
      console.error('Error fetching segment details:', error);
    }
  };

  const handleSegmentChange = (segmentId:string) => {
    setSelectedSegment(segmentId);
    fetchSegmentDetails(segmentId);
  };

  const previewMessage = () => {
    return customMessage.replace('{{name}}', 'John Doe');
  };

  const handleAIChoice = (choice:boolean) => {
    setUseAI(choice);
    if (choice) {
      setShowAIGenerator(true);
    }
  };

  const generateAISuggestions = async () => {
    if (!aiObjective.trim()) {
      alert('Please describe your campaign objective');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch('http://localhost:8080/api/ai/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_objective: aiObjective,
          segment_id: selectedSegment,
          target_audience_description: customContext,
          brand_tone: brandTone,
          offer_type: offerType,
          audience_size: segmentDetails?.audience_size,
          budget_range: budgetRange,
          campaign_duration: campaignDuration
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAiSuggestions(data.suggestions || []);
      } else {
        setAiSuggestions(data.suggestions || []);
        if (data.error) {
          console.warn('AI service issue:', data.error);
        }
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert('Failed to generate suggestions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyMessage = async (message:string, id:string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleUseAIMessage = (message:string) => {
    setCustomMessage(message);
    setSelectedAISuggestion(message);
    setShowAIGenerator(false);
  };

  const createCampaign = async () => {
    if (!campaignName || !selectedSegment || !customMessage) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaignName,
          segment_id: selectedSegment,
          custom_message: customMessage,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Campaign created successfully! Targeting ${result.campaign.audience_size} customers.`);
        // Reset form
        setCampaignName('');
        setSelectedSegment('');
        setCustomMessage('Hi {{name}}, here\'s 10% off on your next order!');
        setSegmentDetails(null);
        setAiSuggestions([]);
        setSelectedAISuggestion('');
        setAiObjective('');
        setUseAI(false);
        setShowAIGenerator(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Error creating campaign');
      console.error('Campaign creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getApproachIcon = (approach:string) => {
    if (approach?.includes('urgency') || approach?.includes('scarcity')) return <Zap className="w-4 h-4 text-orange-500" />;
    if (approach?.includes('value') || approach?.includes('benefit')) return <Heart className="w-4 h-4 text-pink-500" />;
    if (approach?.includes('exclusive') || approach?.includes('social proof')) return <Crown className="w-4 h-4 text-purple-500" />;
    return <Target className="w-4 h-4 text-blue-500" />;
  };

  const getEngagementColor = (engagement: 'high' | 'medium' | 'low' | undefined) => {
    switch(engagement) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <MessageCircle className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Create Campaign</h1>
            {useAI && <Sparkles className="w-6 h-6 text-purple-500 ml-3" />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Segment Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Target Segment *
                </label>
                <div className="relative">
                  <select
                    value={selectedSegment}
                    onChange={(e) => handleSegmentChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                  >
                    <option value="">Choose a segment</option>
                    {segments.map((segment) => (
                      <option key={segment.segment_id} value={segment.segment_id}>
                        {segment.name} ({segment.audience_size} customers)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                
                {segmentDetails && (
                  <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="font-medium text-indigo-800">
                        {segmentDetails.audience_size} customers in this segment
                      </span>
                    </div>
                    <p className="text-sm text-indigo-600">{segmentDetails.description}</p>
                  </div>
                )}
              </div>

              {/* AI Choice Section */}
              {useAI === null && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Wand2 className="w-6 h-6 text-purple-600 mr-2" />
                      <h4 className="text-xl font-semibold text-gray-800">Message Creation</h4>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Would you like to use AI to generate optimized campaign messages, or create your message manually?
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => handleAIChoice(true)}
                        className="bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Use AI Message Generator
                        <span className="ml-2 text-xs bg-purple-500 px-2 py-1 rounded-full">Recommended</span>
                      </button>
                      
                      <button
                        onClick={() => handleAIChoice(false)}
                        className="bg-gray-200 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Create Message Manually
                      </button>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      AI generates messages using psychology and conversion optimization
                    </div>
                  </div>
                </div>
              )}

              {/* AI Message Generator - Only show if user chose AI */}
              {useAI === true && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
                      <h4 className="text-lg font-semibold text-gray-800">AI Message Generator</h4>
                      <Sparkles className="w-4 h-4 text-purple-500 ml-2" />
                    </div>
                    <button
                      onClick={() => {
                        setUseAI(false);
                        setShowAIGenerator(false);
                        setAiSuggestions([]);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Switch to Manual
                    </button>
                  </div>

                  {/* AI Configuration */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Target className="w-4 h-4 inline mr-1" />
                        Campaign Objective * (Describe what you want to achieve)
                      </label>
                      <textarea
                        value={aiObjective}
                        onChange={(e) => setAiObjective(e.target.value)}
                        placeholder="e.g., 'Bring back customers who haven't purchased in 3 months with compelling discount offers' or 'Launch our new summer collection to fashion-interested customers'"
                        rows={3}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        💡 Be specific about your goal - AI will create messages optimized for your objective
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Tone</label>
                        <select
                          value={brandTone}
                          onChange={(e) => setBrandTone(e.target.value)}
                          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="friendly">Friendly</option>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="urgent">Urgent</option>
                          <option value="playful">Playful</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                        <select
                          value={offerType}
                          onChange={(e) => setOfferType(e.target.value)}
                          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="discount">Discount</option>
                          <option value="new_product">New Product</option>
                          <option value="reminder">Reminder</option>
                          <option value="seasonal">Seasonal</option>
                          <option value="loyalty">Loyalty</option>
                          <option value="flash_sale">Flash Sale</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                        <select
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <select
                          value={campaignDuration}
                          onChange={(e) => setCampaignDuration(e.target.value)}
                          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="short">Short-term</option>
                          <option value="medium">Medium-term</option>
                          <option value="long">Long-term</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Context (Optional)
                      </label>
                      <input
                        type="text"
                        value={customContext}
                        onChange={(e) => setCustomContext(e.target.value)}
                        placeholder="e.g., 'Focus on mobile users' or 'Emphasize free shipping'"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <button
                      onClick={generateAISuggestions}
                      disabled={isGeneratingAI || !aiObjective.trim()}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating with Gemini AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Smart Messages
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Suggestions */}
                  {aiSuggestions.length > 0 && (
                    <div className="mt-6">
                      <h5 className="font-medium text-gray-800 mb-4 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2 text-purple-600" />
                        AI-Generated Message Variations
                        <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          {aiSuggestions.length} suggestions
                        </span>
                      </h5>
                      
                      <div className="space-y-4">
                        {aiSuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.id || index}
                            className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all p-4"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                {getApproachIcon(suggestion.approach??'')}
                                <span className="text-sm font-medium text-gray-700">
                                  {suggestion.approach || 'Smart approach'}
                                </span>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${getEngagementColor(suggestion.expected_engagement)}`}>
                                {suggestion.expected_engagement} engagement
                              </div>
                            </div>

                            <div className="text-gray-800 font-medium mb-3 text-lg leading-relaxed">
                              {suggestion.message}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {suggestion.character_count} chars
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                  {suggestion.tone_match}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {suggestion.target_emotion}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleCopyMessage(suggestion.message, suggestion.id!)}
                                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                  title="Copy message"
                                >
                                  {copiedId === suggestion.id ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleUseAIMessage(suggestion.message)}
                                  className="bg-purple-600 text-white py-2 px-4 rounded text-sm hover:bg-purple-700 transition-colors"
                                >
                                  Use This Message
                                </button>
                              </div>
                            </div>

                            {suggestion.approach && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Strategy:</span> {suggestion.approach}
                                  {suggestion.cta_strength && (
                                    <span className="ml-3">
                                      <span className="font-medium">CTA Strength:</span> {suggestion.cta_strength}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-xs text-gray-500 text-center bg-white/50 rounded-lg p-2">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Messages generated using psychological triggers and conversion optimization
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Powered by Google Gemini AI with marketing psychology
                  </div>
                </div>
              )}

              {/* Manual Message Creation - Only show if user chose manual or after AI selection */}
              {(useAI === false || (useAI === true && aiSuggestions.length > 0) || selectedAISuggestion) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {useAI === false ? 'Campaign Message *' : 'Selected Campaign Message *'}
                      {useAI === false && (
                        <button
                          onClick={() => setUseAI(true)}
                          className="ml-3 text-sm text-purple-600 hover:text-purple-800"
                        >
                          Try AI Instead
                        </button>
                      )}
                    </label>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-indigo-600 text-sm hover:text-indigo-800 transition-colors"
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                  
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter your message template. Use {{name}} for customer name."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  />
                  
                  {selectedAISuggestion && selectedAISuggestion === customMessage && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI-generated message selected
                    </div>
                  )}
                  
                  <div className="mt-2 text-sm text-gray-500">
                    💡 Tip: Use {`{{name}}`} to personalize with customer names
                  </div>
                  
                  {showPreview && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex items-start">
                        <MessageCircle className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Message Preview:</p>
                          <p className="text-gray-600">{previewMessage()}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Character count: {customMessage.length} / 160 (SMS optimized)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Campaign Summary */}
            <div className="lg:col-span-1">
              <div className="bg-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">Campaign Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm">
                      {segmentDetails ? `${segmentDetails.audience_size} recipients` : 'No segment selected'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm">
                      {customMessage.length} characters
                    </span>
                  </div>

                  {aiObjective && useAI && (
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 opacity-80" />
                      <span className="text-sm">AI-optimized objective</span>
                    </div>
                  )}

                  {selectedAISuggestion && selectedAISuggestion === customMessage && (
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 opacity-80" />
                      <span className="text-sm">AI-generated message</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="text-sm opacity-80 mb-2">Estimated Performance</div>
                  <div className="text-lg font-semibold">
                    {segmentDetails ? `~${Math.round(segmentDetails.audience_size * 0.92)} delivered` : '0'}
                  </div>
                  <div className="text-xs opacity-70">Based on 92% success rate</div>
                  
                  {useAI && aiSuggestions.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs opacity-70">AI-optimized for higher engagement</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={createCampaign}
                  disabled={isLoading || !campaignName || !selectedSegment || !customMessage}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Creating...' : 'Launch Campaign'}
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Campaign Creation Options</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {useAI === true ? (
                    <>
                      <li>• <strong>AI-powered messaging:</strong> Messages optimized using psychological triggers</li>
                      <li>• <strong>Multiple variations:</strong> Choose from 3 different strategic approaches</li>
                      <li>• <strong>Context-aware:</strong> AI considers your audience segment and brand tone</li>
                      <li>• <strong>Performance optimized:</strong> Messages designed for maximum engagement</li>
                    </>
                  ) : useAI === false ? (
                    <>
                      <li>• <strong>Manual control:</strong> Full creative control over your message content</li>
                      <li>• <strong>Personalization:</strong> Use {`{{name}}`} to include customer names</li>
                      <li>• <strong>Preview mode:</strong> See how your message will appear to customers</li>
                      <li>• <strong>Character optimization:</strong> Messages optimized for SMS delivery</li>
                    </>
                  ) : (
                    <>
                      <li>• <strong>AI option:</strong> Let AI generate optimized messages using marketing psychology</li>
                      <li>• <strong>Manual option:</strong> Create your own custom messages with full control</li>
                      <li>• <strong>Personalization:</strong> Both options support customer name personalization</li>
                      <li>• <strong>Mobile-ready:</strong> All messages optimized for SMS and push notifications</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationUI;