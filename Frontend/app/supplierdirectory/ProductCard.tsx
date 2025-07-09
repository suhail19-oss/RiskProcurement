"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, ArrowRightCircle } from "lucide-react";
import { Product } from "../types/index";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group overflow-hidden flex flex-col"
      onClick={handleProductClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-5 h-5 text-[#E2142D] dark:text-[#E2142D]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">Click to view suppliers</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#E2142D] bg-red-50 dark:bg-red-900/30 dark:text-[#E2142D] px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#E2142D] dark:group-hover:text-[#E2142D] transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-left text-gray-600 dark:text-gray-400 text-sm mb-4">
            {product.description}
          </p>
        </div>

        {/* Fixed Button */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-center gap-2 bg-[#E2142D] hover:bg-[#c01024] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            <span>View Suppliers</span>
            <ArrowRightCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};