"use client";

import React, { useEffect, useState } from "react";

import {
  Building,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
  Star,
  MapPin,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { products } from "@/app/data/products";

interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  experience: string;
  deliveryTime: string;
  price: string;
  specialties: string[];
  contact: string;
  Company_Name: string;
  Headquarter_Location: string;
  Overall_Risk_Score: number;
  Quality_Risk_Score: number;
  Logistics_Risk_Score: number;
  Operational_Risk_Score: number;
  Legal_Risk_Score: number;
  ESG_Risk_Score: number;
  Geo_Location_Risk_Score: number;
  In_Transit_Delays_Days: number;
  Product_Defect_Rate: number;
  product: string;
}

const BarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const maxScore = Math.max(...data.map((item) => item.score), 50);

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const widthPercentage = Math.min((item.score / maxScore) * 100, 100);
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.score}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    item.category === "High"
                      ? "bg-red-100 text-red-700"
                      : item.category === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.category}
                </span>
              </div>
            </div>
            <div className="w-full rounded-full h-3 overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  item.category === "High"
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : item.category === "Medium"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-600"
                    : "bg-gradient-to-r from-green-400 to-emerald-600"
                }`}
                style={{
                  width: `${widthPercentage}%`,
                  minWidth: item.score > 0 ? "2%" : "0%",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function SupplierDetail({ supplier, supplierId }: any) {
  console.log(supplier);

  const mockSupplier: Supplier = {
    id: "1",
    name: "TechFlow Industries",
    location: "San Francisco, CA",
    rating: 4.8,
    experience: "15+ years",
    deliveryTime: "3-5 days",
    price: "$$$",
    specialties: ["Electronics", "IoT Devices", "Semiconductors"],
    contact: "contact@techflow.com",
    Company_Name: "TechFlow Industries",
    Headquarter_Location: "San Francisco, CA",
    Overall_Risk_Score: 22,
    Quality_Risk_Score: 18,
    Logistics_Risk_Score: 25,
    Operational_Risk_Score: 20,
    Legal_Risk_Score: 15,
    ESG_Risk_Score: 28,
    Geo_Location_Risk_Score: 12,
    In_Transit_Delays_Days: 2,
    Product_Defect_Rate: 0.03,
    product: "Advanced Electronics & IoT Solutions",
  };

  const product = products.find((p: any) => p.id == supplier?.product_id);

  supplier.product_name = product?.name || "Default";
  const currentSupplier = supplier;

  // Fetch supplier news from backend
  const [supplierNews, setSupplierNews] = useState<any[]>([]);
  const [readMoreList, setReadMoreList] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (currentSupplier.company_name !== undefined) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/news/${encodeURIComponent(
              currentSupplier.company_name
            )}`,
            {
              method: "GET",
            }
          );
          const data = await res.json();
          console.log("news data: ", data);
          if (data && Array.isArray(data.news)) {
            setSupplierNews(data.news);
            setReadMoreList(new Array(data.news.length).fill(false));
          } else {
            setSupplierNews([]);
            setReadMoreList([]);
          }
        }
      } catch (err) {
        setSupplierNews([]);
        setReadMoreList([]);
      }
    };
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSupplier.company_name]);

  const calculateRiskLevel = (risk: number) => {
    if (risk > 35) return "High";
    if (risk >= 28) return "Medium";
    return "Low";
  };

  const individualRisks = [
    {
      name: "Quality Risk",
      score: Math.round(
        currentSupplier.risk_subfactors?.quality_risk_score ?? 30
      ),
      category: calculateRiskLevel(
        currentSupplier.risk_subfactors?.quality_risk_score ?? 30
      ),
    },
    {
      name: "Logistics Risk",
      score: Math.round(
        currentSupplier.risk_subfactors?.logistics_risk_score ?? 30
      ),
      category: calculateRiskLevel(
        currentSupplier.risk_subfactors?.logistics_risk_score ?? 30
      ),
    },
    {
      name: "Operational Risk",
      score: Math.round(
        currentSupplier.risk_subfactors?.operational_risk_score ?? 30
      ),
      category: calculateRiskLevel(
        currentSupplier.risk_subfactors?.operational_risk_score ?? 30
      ),
    },
    {
      name: "Legal Risk",
      score: Math.round(
        currentSupplier.risk_subfactors?.legal_risk_score ?? 30
      ),
      category: calculateRiskLevel(
        currentSupplier.risk_subfactors?.legal_risk_score ?? 30
      ),
    },
    {
      name: "ESG Risk",
      score: Math.round(currentSupplier.risk_subfactors?.esg_risk_score ?? 30),
      category: calculateRiskLevel(
        currentSupplier.risk_subfactors?.esg_risk_score ?? 30
      ),
    },
    {
      name: "Geo Location Risk",
      score: Math.round(
        currentSupplier.risk_subfactors?.geopolitical_risk_score ?? 30
      ),
      category: calculateRiskLevel(
        currentSupplier.risk_subfactors?.geopolitical_risk_score ?? 30
      ),
    },
  ];

  const score = Math.round(currentSupplier.risk_score);
  let Icon = CheckCircle;
  let iconColor = "text-green-600";
  let bgColor = "bg-green-50 dark:bg-green-900/50";

  if (score > 28 && score <= 35) {
    Icon = ShieldAlert;
    iconColor = "text-yellow-600";
    bgColor = "bg-yellow-50 dark:bg-yellow-900/50";
  } else if (score > 35) {
    Icon = AlertTriangle;
    iconColor = "text-red-600";
    bgColor = "bg-red-50 dark:bg-red-900/50";
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 py-8  space-y-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mt-12 flex-wrap gap-4">
        {/* Left: Company Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#E2142D] rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient-text "> {currentSupplier.company_name}</span>
           
          
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <MapPin className="inline w-4 h-4 mr-1" />
              {currentSupplier.location}
            </p>
          </div>
        </div>

        {/* Right: Product Supplied */}
        <div className="flex items-center space-x-2">
          <Package className="w-10 h-10 text-[#E2142D] dark:text-[#E2142D]" />
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
            {currentSupplier.product_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Overall Risk Score */}
        {(() => {
          let overallBgColor =
            "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800";
          if (score > 35) {
            overallBgColor =
              "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800";
          } else if (score > 28) {
            overallBgColor =
              "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800";
          }

          return (
            <div
              className={`rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br ${overallBgColor} transition-all`}
            >
              <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-white/70 dark:bg-white/10">
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                {score}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Overall Risk Score
              </p>
            </div>
          );
        })()}

        {/* In Transit Delays */}
        <div className="rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 transition-all">
          <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-white/70 dark:bg-white/10">
            <Clock className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
            {currentSupplier.risk_subfactors?.in_transit_delays_days
              ? currentSupplier.risk_subfactors?.in_transit_delays_days
              : "5"}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            In Transit Delay Days
          </p>
        </div>

        {/* Performance Score */}
        <div className="rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 transition-all">
          <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-white/70 dark:bg-white/10">
            <TrendingUp className="w-7 h-7 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
            {100 - score}%
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Performance Score
          </p>
        </div>

        {/* Defect Rate */}
        <div className="rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 transition-all">
          <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-white/70 dark:bg-white/10">
            <Star className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
            {Math.floor(
              currentSupplier.risk_subfactors?.product_defect_rate * 100 && 50
            )}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Defect Rate
          </p>
        </div>
      </div>

      {/* Risk Chart & News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl shadow-sm border p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            Individual Risk Analysis
          </h3>
          <BarChart data={individualRisks} />
        </div>

        <div className="rounded-2xl shadow-sm border p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            Latest News About {currentSupplier.company_name}
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {supplierNews.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400">
                No news found for this supplier.
              </div>
            )}
            {supplierNews.map((news, index) => {
              const isExpanded = readMoreList[index];
              return (
                <div
                  key={index}
                  className="p-5 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md"
                >
                  <div className="mb-2">
                    <h4 className="font-semibold text-base text-gray-900 dark:text-white">
                      📰 {news.headline}
                    </h4>
                    {news.source && (
                      <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Source: {news.source}
                      </a>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-justify text-gray-700 dark:text-gray-300">
                    {isExpanded
                      ? news.summary
                      : `${news.summary?.substring(0, 120) ?? ""}${
                          news.summary && news.summary.length > 120
                            ? "... "
                            : ""
                        }`}
                    {news.summary && news.summary.length > 120 && (
                      <button
                        className="ml-1 text-blue-500 font-medium"
                        onClick={() =>
                          setReadMoreList((prev) => {
                            const updated = [...prev];
                            updated[index] = !updated[index];
                            return updated;
                          })
                        }
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}