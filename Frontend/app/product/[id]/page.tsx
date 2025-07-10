"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Truck,
  ArrowRightCircle,
  BadgeDollarSign,
  Mail,
  CheckCircle,
} from "lucide-react";
import { products } from "../../data/products";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const [productSuppliers, setProductSuppliers] = useState([]);

  useEffect(() => {
    const getSuppliers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      const productSup = data.suppliers
        .map((supplier: any, idx: number) => ({ ...supplier, supplierId: idx }))
        .filter((supplier: any) => supplier.product_id == productId);
      setProductSuppliers(productSup);
    };

    getSuppliers();
  }, []);

  const product = products.find((p) => p.id === productId);

  const handleViewRiskScore = (supplierId: number) => {
    router.push(`/supplier/${supplierId}`);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="bg-[#E2142D] text-white px-6 py-2 rounded-lg hover:bg-[#b11020] transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#E2142D] dark:hover:text-[#E2142D] transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Product Details
            </h1>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="rounded-xl overflow-hidden mb-4 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-[#E2142D]/5 via-[#2563eb]/10 to-[#a21caf]/10 backdrop-blur-sm animate-fade-in">
          <div className="p-4">
            <div className="flex items-start space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-lg shadow"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[#a21caf] dark:text-[#E2142D] bg-gradient-to-r from-[#E2142D]/10 via-[#2563eb]/10 to-[#a21caf]/10 px-3 py-1 rounded-full font-semibold text-base">
                    {product.category}
                  </span>
                </div>
                 <span className="text-2xl font-bold bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent animate-gradient-text "> {product.name}</span>
           
               
                <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Suppliers Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Available Suppliers
            </h2>
            <span className="text-lg text-gray-600 dark:text-gray-400">
              {productSuppliers.length} suppliers found
            </span>
          </div>

          {productSuppliers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Truck className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No suppliers available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're working to find suppliers for this product.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {productSuppliers.map((supplier: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-[#E2142D] dark:hover:border-[#E2142D] transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {supplier.company_name}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{supplier.location || "Earth"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        First Pass Yield:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.round(
                          Number(supplier.risk_subfactors?.first_pass_yield)
                        )}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Delivery Delay:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {supplier.risk_subfactors?.in_transit_delays_days || 5}{" "}
                        days
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <BadgeDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Contract Value:
                        <span className="ml-1 font-bold text-green-700 dark:text-green-400">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(
                            supplier?.risk_subfactors?.[
                              "contract_value(100m_800m)"
                            ] || 1000000000
                          )}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <a
                        href={"#"}
                        className="text-[#E2142D] dark:text-[#E2142D] hover:text-[#b11020] dark:hover:text-[#b11020] transition-colors duration-200 font-medium"
                      >
                        {supplier.email_domain}
                      </a>
                    </div>

                    <button
                      onClick={() => handleViewRiskScore(supplier.supplierId)}
                      className="w-full bg-[#E2142D] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#b11020] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      View Risk Score
                      <ArrowRightCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}