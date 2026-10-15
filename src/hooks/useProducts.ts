"use client";

import { useCallback, useEffect, useState } from "react";
import { clearApiCache, getProducts, type Product } from "@/lib/api";

type State = {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/** সব পণ্য লোড করার হুক — লোডিং, এরর ও রিট্রাই সহ। */
export function useProducts(): State {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts()
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("দুঃখিত, পণ্যের তথ্য আনা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  const reload = useCallback(() => {
    clearApiCache();
    setNonce((value) => value + 1);
  }, []);

  return { products, loading, error, reload };
}
