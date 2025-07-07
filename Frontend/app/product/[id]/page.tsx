"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Award,
  Truck,
  ArrowRightCircle,
} from "lucide-react";
import { products } from "../../data/products";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const [productSuppliers, setProductSuppliers] = useState([]);
  useEffect(() => {

    const getSuppliers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`, {
        method: "GET",
      });
      const data = await res.json();
      const productSup = data.suppliers.filter((supplier: any) => supplier.product_id == productId);
      //console.log("data: ", data.suppliers);
      console.log("productSupp: ", productSup);
      // console.log('productId', productId);

      setProductSuppliers(productSup);
    }

    getSuppliers();
  }, []);

  const product = products.find((p) => p.id === productId);
  const handleViewRiskScore = (supplierId: Number) => {
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4">
            <div className="flex items-start space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-lg shadow"
              />

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-base font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h1>

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
              {productSuppliers.map((supplier: any,index : any) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {supplier.company_name}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{supplier.location ? supplier.location: "Earth"}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {"Rating"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Experience:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {"Experience"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Delivery:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {/* in case of no delay found the default is 5 days */}
                        {supplier.risk_subfactors?.in_transit_delays_days ? supplier.risk_subfactors?.in_transit_delays_days : "5"}{" days"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Price Range:
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {/* if contract value not present then the company cantract value is 10000000  */}
                        {supplier.risk_subfactors?.['contract_value(100m_800m)'] ?? "10000000"}
                        {" Contract Value"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {/* {supplier.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))} */}
                      {"Speciality"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <a
                        // href={`mailto:${supplier.email_domain}`}
                        href={"#"}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
                      >
                        {supplier.email_domain}
                      </a>
                    </div>

                    <button
                      onClick={() => handleViewRiskScore(index)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
