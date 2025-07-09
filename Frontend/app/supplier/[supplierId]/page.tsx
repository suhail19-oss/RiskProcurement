"use client";

import React, { use, useEffect, useState } from "react";
import SupplierDetailClient from "./SupplierDetail";

export default function SupplierPage({
  params,
}: {
  params: Promise<{ supplierId: number }>;
}) {
  const { supplierId } = use(params);

  const [supplier, setSupplier] = useState({});

  useEffect(() => {
    const getSuppliers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      const s = data.suppliers[supplierId]; // safer lookup
      setSupplier(s);
    };

    getSuppliers();
  }, [supplierId]);

  return <SupplierDetailClient supplier={supplier} supplierId={supplierId} />;
}