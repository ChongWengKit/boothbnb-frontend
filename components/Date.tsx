"use client"
import { formatEventDate } from "@/app/lib/util";
import { useState, useEffect } from "react";

export function EventDate({ date }: { date: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <span></span>; 
  }

  return <span>{formatEventDate(date)}</span>; 
}