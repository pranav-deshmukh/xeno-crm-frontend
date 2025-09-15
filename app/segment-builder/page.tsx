"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Users,
  Send,
  History,
  Zap,
  DollarSign,
  Calendar,
  MapPin,
  ShoppingBag,
  UserCheck,
  Grip,
} from "lucide-react";
import { Rule } from "@/types/Rules";
import { DraggedItem } from "@/types/DraggedItem";
import { useRouter } from "next/navigation";

type Operator =
  | ">"
  | "<"
  | ">="
  | "<="
  | "="
  | "!="
  | "contains"
  | "not_contains"
  | "older_than";

const fetchPreviewAPI = async (rules: Rule[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/segments/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });

    if (!response.ok) throw new Error("Failed to fetch preview");

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

type PreviewResponse = {
  count: number;
  demographics: {
    by_city: Record<string, number>;
    by_spending_tier: {
      "Low (0-5K)": number;
      "Medium (5K-20K)": number;
      "High (20K+)": number;
    };
    by_recency: {
      "Active (0-30 days)": number;
      "Inactive (30-90 days)": number;
      "Dormant (90+ days)": number;
    };
  };
};

type Demographics = PreviewResponse["demographics"];

type AudienceData = {
  count: number;
  demographics: Demographics | null;
  loading: boolean;
  error?: string;
};

const CampaignBuilder = () => {
  const [currentView, setCurrentView] = useState("builder");
  const [rules, setRules] = useState<Rule[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [audienceData, setAudienceData] = useState<AudienceData>({
    count: 0,
    demographics: null,
    loading: false,
  });
  const [campaignName, setCampaignName] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [nlPrompt, setNlPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const canvasRef = useRef(null);
  const router = useRouter();

  const [campaigns] = useState([
    {
      id: 1,
      name: "High Value Customers",
      date: "2024-09-10",
      audienceSize: 1250,
      sent: 1200,
      failed: 50,
      status: "completed",
      rules: [
        { field: "total_spent", operator: ">", value: 25000, logic: "AND" },
        { field: "total_orders", operator: ">=", value: 5 },
      ],
    },
    {
      id: 2,
      name: "Re-engagement Campaign",
      date: "2024-09-08",
      audienceSize: 850,
      sent: 820,
      failed: 30,
      status: "completed",
      rules: [{ field: "last_order_date", operator: "older_than", value: 60 }],
    },
    {
      id: 3,
      name: "New Customer Welcome",
      date: "2024-09-05",
      audienceSize: 430,
      sent: 430,
      failed: 0,
      status: "completed",
      rules: [
        { field: "registration_date", operator: ">", value: "2024-08-01" },
        { field: "total_orders", operator: "<", value: 2 },
      ],
    },
  ]);

  const ruleTypes = [
    {
      id: "spending",
      icon: DollarSign,
      label: "Customer Spending",
      field: "total_spent",
      operators: [">", "<", ">=", "<=", "=", "!="],
      valueType: "number",
      placeholder: "10000",
      color: "bg-green-100 border-green-300 text-green-800",
    },
    {
      id: "orders",
      icon: ShoppingBag,
      label: "Total Orders",
      field: "total_orders",
      operators: [">", "<", ">=", "<=", "=", "!="],
      valueType: "number",
      placeholder: "3",
      color: "bg-blue-100 border-blue-300 text-blue-800",
    },
    {
      id: "activity",
      icon: Calendar,
      label: "Last Activity",
      field: "last_order_date",
      operators: ["older_than", ">", "<"],
      valueType: "days",
      placeholder: "90",
      color: "bg-purple-100 border-purple-300 text-purple-800",
    },
    {
      id: "location",
      icon: MapPin,
      label: "Location",
      field: "city",
      operators: ["contains", "not_contains", "=", "!="],
      valueType: "text",
      placeholder: "Chennai",
      color: "bg-orange-100 border-orange-300 text-orange-800",
    },
    {
      id: "registration",
      icon: UserCheck,
      label: "Registration Date",
      field: "registration_date",
      operators: [">", "<", ">=", "<="],
      valueType: "date",
      placeholder: "2024-01-01",
      color: "bg-pink-100 border-pink-300 text-pink-800",
    },
  ];

  const templates = [
    {
      id: "high-value",
      name: "High Value Customers",
      description: "Customers who spent > ₹25,000",
      rules: [{ field: "total_spent", operator: ">", value: 25000 }],
      icon: "💎",
    },
    {
      id: "inactive",
      name: "Inactive Users",
      description: "No orders in 60+ days",
      rules: [{ field: "last_order_date", operator: "older_than", value: 60 }],
      icon: "😴",
    },
    {
      id: "frequent",
      name: "Frequent Shoppers",
      description: "More than 10 orders",
      rules: [{ field: "total_orders", operator: ">", value: 10 }],
      icon: "🛍️",
    },
  ];

  useEffect(() => {
    if (rules.length === 0) {
      setAudienceData({ count: 0, demographics: null, loading: false });
      return;
    }

    const timer = setTimeout(async () => {
      setAudienceData((prev) => ({ ...prev, loading: true }));
      try {
        const data = await fetchPreviewAPI(rules);
        setAudienceData({ ...data, loading: false });
      } catch (error) {
        setAudienceData({
          count: 0,
          demographics: null,
          loading: false,
          error: "Failed to load preview",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [rules]);

  const handleDragStart = (e: React.DragEvent, item: DraggedItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedItem) return;

    if (draggedItem.type === "rule") {
      const newRule = {
        id: Date.now().toString(),
        field: draggedItem.field as Rule["field"],
        operator: draggedItem.operators[0] as Rule["operator"],
        value: draggedItem.valueType === "number" ? 0 : "",
        logic: "AND" as const,
      };

      const newRules = [...rules];
      newRules.splice(index, 0, newRule);
      setRules(newRules);
    } else if (draggedItem.type === "template") {
      const templateRules = draggedItem.rules.map((rule, i) => ({
        ...rule,
        id: (Date.now() + i).toString(),
        logic: (i < draggedItem.rules.length - 1 ? "AND" : undefined) as Rule["logic"],
      }));

      const newRules = [...rules];
      newRules.splice(index, 0, ...templateRules);
      setRules(newRules);
    } else if (draggedItem.type === "logic") {
      if (index > 0 && index < rules.length) {
        const newRules = [...rules];
        newRules[index - 1].logic = draggedItem.operator;
        setRules(newRules);
      }
    }

    setDraggedItem(null);
  };

  const updateRule = (
    ruleId: string,
    field: string,
    value: Rule[keyof Rule]
  ) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, [field]: value } : rule
      )
    );
  };

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
  };

  const addLogicConnector = (index: number, logic: "AND" | "OR") => {
    if (index < rules.length - 1) {
      const newRules = [...rules];
      newRules[index].logic = logic;
      setRules(newRules);
    }
  };

  const saveCampaign = async () => {
    if (!campaignName.trim()) {
      // alert("Please enter a campaign name");
      return;
    }

    if (rules.length === 0) {
      // alert("Please add at least one rule");
      return;
    }

    try {
      setAudienceData((prev) => ({ ...prev, loading: true }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/segments/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: campaignName,
          description: `Segment with ${rules.length} rule${
            rules.length > 1 ? "s" : ""
          }`,
          rules: rules,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Failed to save segment');
      // }

      const result = await response.json();

      // alert(
      //   `Segment "${campaignName}" saved successfully with ${result.segment.audience_size} customers!`
      // );

      setCampaignName("");
      setRules([]);
      router.push("/campaign-history");
    } catch (error) {
      console.error("Error saving segment:", error);
      // alert("Failed to save segment. Please try again.");
    } finally {
      setAudienceData((prev) => ({ ...prev, loading: false }));
    }
  };

  const labels: Record<Operator, string> = {
    ">": "greater than",
    "<": "less than",
    ">=": "greater than or equal to",
    "<=": "less than or equal to",
    "=": "equals",
    "!=": "not equals",
    contains: "contains",
    not_contains: "does not contain",
    older_than: "older than (days)",
  };

  const formatOperatorLabel = (operator: string) => {
    return (labels as Record<string, string>)[operator] || operator;
  };

  const formatRuleDescription = (rule: Rule) => {
    switch (rule.field) {
      case "last_order_date":
        if (rule.operator === "older_than") {
          return `haven’t shopped in ${rule.value} days`;
        }
        return `last order date ${rule.operator} ${rule.value}`;
      case "total_spent":
        return `spent over ₹${rule.value.toLocaleString()}`;
      case "total_orders":
        return `placed more than ${rule.value} orders`;
      case "registration_date":
        return `registered ${rule.operator} ${rule.value}`;
      case "city":
        if (rule.operator === "contains") return `live in ${rule.value}`;
        if (rule.operator === "not_contains")
          return `do not live in ${rule.value}`;
        return `city ${rule.operator} ${rule.value}`;
      default:
        return `${rule.field} ${rule.operator} ${rule.value}`;
    }
  };

  const buildAudienceText = (rules: Rule[]) => {
    if (rules.length === 0) return "No rules defined";

    let description = "People who ";

    rules.forEach((rule, i) => {
      if (i > 0) {
        // add the connector from previous rule
        const connector = rules[i - 1].logic || "AND";
        description += ` ${connector} `;
      }
      description += formatRuleDescription(rule);
    });

    return description;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Segment Builder
            </h1>
          </div>
          <button
            onClick={() => router.push("/campaign-history")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <History className="w-5 h-5" />
            View History
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Rule Palette */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Rule Blocks
              </h2>
              <div className="space-y-3">
                {ruleTypes.map((ruleType) => {
                  const Icon = ruleType.icon;
                  return (
                    <div
                      key={ruleType.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, {
                          ...ruleType,
                          type: "rule",
                        } as DraggedItem)
                      }
                      className={`${ruleType.color} p-3 rounded-lg border-2 border-dashed cursor-move hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {ruleType.label}
                        </span>
                        <Grip className="w-4 h-4 ml-auto opacity-40" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Logic Connectors
                </h3>
                <div className="space-y-2">
                  <div
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, {
                        type: "logic",
                        operator: "AND",
                      } as DraggedItem)
                    }
                    className="bg-green-50 border-2 border-dashed border-green-300 p-2 rounded-lg cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-medium text-green-800">
                        AND
                      </span>
                      <Grip className="w-4 h-4 ml-auto opacity-40" />
                    </div>
                  </div>
                  <div
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, {
                        type: "logic",
                        operator: "OR",
                      } as DraggedItem)
                    }
                    className="bg-orange-50 border-2 border-dashed border-orange-300 p-2 rounded-lg cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-800">
                        OR
                      </span>
                      <Grip className="w-4 h-4 ml-auto opacity-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Templates
                </h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, {
                          ...template,
                          type: "template",
                        } as DraggedItem)
                      }
                      className="bg-gray-50 border-2 border-dashed border-gray-300 p-3 rounded-lg cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{template.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {template.description}
                          </div>
                        </div>
                        <Grip className="w-4 h-4 opacity-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setMode("manual")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  mode === "manual"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Build Manually
              </button>
              <button
                onClick={() => setMode("ai")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  mode === "ai"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Generate with AI
              </button>
            </div>
          </div>

          <div className="col-span-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Audience Rules
              </h2>

              <div
                ref={canvasRef}
                className="min-h-96 border-2 border-dashed border-gray-200 rounded-lg p-4"
                onDragOver={(e) => handleDragOver(e, rules.length)}
                onDrop={(e) => handleDrop(e, rules.length)}
              >
                {rules.length === 0 ? (
                  <div className="text-center text-gray-500 py-20">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">Build Your Audience</p>
                    <p className="text-sm">
                      Drag rule blocks here to start creating your segment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rules.map((rule, index) => {
                      const ruleType = ruleTypes.find(
                        (type) => type.field === rule.field
                      );
                      const Icon = ruleType?.icon || Users;

                      return (
                        <div key={rule.id}>
                          {/* Drop zone before each rule */}
                          <div
                            className={`h-2 rounded transition-colors ${
                              dragOverIndex === index
                                ? "bg-blue-200"
                                : "transparent"
                            }`}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                          />

                          {/* Rule block */}
                          <div
                            className={`${
                              ruleType?.color || "bg-gray-100"
                            } p-2 rounded-lg border-2`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5" />
                              <div className="flex-1 flex items-center gap-3">
                                <select
                                  value={rule.field}
                                  onChange={(e) =>
                                    updateRule(rule.id, "field", e.target.value)
                                  }
                                  className="bg-transparent border-0 font-medium focus:outline-none"
                                >
                                  {ruleTypes.map((type) => (
                                    <option key={type.field} value={type.field}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>

                                <select
                                  value={rule.operator}
                                  onChange={(e) =>
                                    updateRule(
                                      rule.id,
                                      "operator",
                                      e.target.value
                                    )
                                  }
                                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {ruleType?.operators.map((op) => (
                                    <option key={op} value={op}>
                                      {formatOperatorLabel(op)}
                                    </option>
                                  ))}
                                </select>

                                <input
                                  type={
                                    ruleType?.valueType === "number"
                                      ? "number"
                                      : ruleType?.valueType === "date"
                                      ? "date"
                                      : "text"
                                  }
                                  value={
                                    rule.value instanceof Date
                                      ? rule.value.toISOString().split("T")[0] // Convert Date to YYYY-MM-DD format
                                      : rule.value
                                  }
                                  onChange={(e) =>
                                    updateRule(rule.id, "value", e.target.value)
                                  }
                                  placeholder={ruleType?.placeholder}
                                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                                />
                              </div>

                              <button
                                onClick={() => removeRule(rule.id)}
                                className="text-red-500 hover:text-red-700 transition-colors ml-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Logic connector */}
                          {index < rules.length - 1 && (
                            <div className="flex items-center justify-center py-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    addLogicConnector(index, "AND")
                                  }
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    rule.logic === "AND"
                                      ? "bg-green-500 text-white"
                                      : "bg-green-100 text-green-800 hover:bg-green-200"
                                  }`}
                                >
                                  AND
                                </button>
                                <button
                                  onClick={() => addLogicConnector(index, "OR")}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    rule.logic === "OR"
                                      ? "bg-orange-500 text-white"
                                      : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                  }`}
                                >
                                  OR
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Final drop zone */}
                    <div
                      className={`h-8 rounded transition-colors ${
                        dragOverIndex === rules.length
                          ? "bg-blue-200"
                          : "border-2 border-dashed border-gray-200"
                      }`}
                      onDragOver={(e) => handleDragOver(e, rules.length)}
                      onDrop={(e) => handleDrop(e, rules.length)}
                    />
                  </div>
                )}
              </div>
              {mode === "ai" && (
                <div className="mb-6">
                  <textarea
                    value={nlPrompt}
                    onChange={(e) => setNlPrompt(e.target.value)}
                    placeholder="Describe your audience... e.g. People who haven’t shopped in 6 months and spent over ₹5K"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                  <button
                    onClick={async () => {
                      setLoadingAI(true);
                      try {
                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/ai/generate-segment-rules`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ naturalQuery: nlPrompt }),
                          }
                        );
                        const data = await response.json();
                        setRules(data.rules); // replace with AI-generated rules
                      } catch (error) {
                        // alert("Failed to generate rules. Try again.");
                      } finally {
                        setLoadingAI(false);
                      }
                    }}
                    disabled={!nlPrompt.trim() || loadingAI}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loadingAI ? "Generating..." : "Generate Rules"}
                  </button>
                </div>
              )}

              {/* Rule Summary */}
              {rules.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-gray-800">
                  <p className="text-sm font-medium">
                    {buildAudienceText(rules)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Audience Preview
              </h2>

              {/* Audience Count */}
              <div className="mb-6">
                <div className="text-center">
                  {audienceData.loading ? (
                    <div className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {audienceData.count.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">customers</div>
                    </>
                  )}
                </div>
              </div>

              {/* Error handling */}
              {audienceData.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="text-red-800 text-sm">
                    {audienceData.error}
                  </div>
                </div>
              )}

              {/* Demographics */}
              {audienceData.demographics && !audienceData.loading && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      By City
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(audienceData.demographics.by_city).map(
                        ([city, count]) => (
                          <div
                            key={city}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{city}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      By Spending
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(
                        audienceData.demographics.by_spending_tier
                      ).map(([tier, count]) => (
                        <div
                          key={tier}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{tier}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      By Activity
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(audienceData.demographics.by_recency).map(
                        ([period, count]) => (
                          <div
                            key={period}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{period}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Save Campaign */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Campaign name..."
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={saveCampaign}
                  disabled={rules.length === 0 || !campaignName.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Save Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
