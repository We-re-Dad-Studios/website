"use client";
import React, { useEffect, useState } from 'react';

export const useSessionStorage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getItem = (key: string) => {
    if (isClient) {
      const data = sessionStorage.getItem(key);
      return data;
    }
    return null;
  };

  const storeItem = (key: string, data: string) => {
    if (isClient) {
      sessionStorage.setItem(key, data);
    }
  };

  return { getItem, storeItem };
};