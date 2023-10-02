"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("uuid");
    }
    return null;
  });

  useEffect(() => {
    if (!userId && typeof window !== "undefined") {
      const newUserId = uuidv4();
      localStorage.setItem("uuid", newUserId);
      setUserId(newUserId);
    }
  }, [userId]);

  return userId;
}
