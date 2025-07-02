import React from "react";
import { suppliers } from "../../data/products";
import SupplierDetailClient from "./SupplierDetail";

// Generate static params for all suppliers - this runs on the server
export async function generateStaticParams() {
  const allSuppliers = [];

  // Collect all suppliers from all product categories
  for (const productSuppliers of Object.values(suppliers)) {
    for (const supplier of productSuppliers) {
      allSuppliers.push({
        supplierId: supplier.id,
      });
    }
  }

  return allSuppliers;
}

// Server component that fetches data and renders the client component
export default function SupplierPage({
  params,
}: {
  params: { supplierId: string };
}) {
  const supplierId = params.supplierId;

  // Find supplier across all product categories
  let supplier = null;
  for (const productSuppliers of Object.values(suppliers)) {
    supplier = productSuppliers.find((s) => s.id === supplierId);
    if (supplier) break;
  }

  return <SupplierDetailClient supplier={supplier} supplierId={supplierId} />;
}
