"use client";

import { useState, useEffect } from "react";

const KEY = "tbr.compare";
const LIMIT = 3;

function safeWindow(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

export function getCompare(): string[] {
  const w = safeWindow();
  if (!w) return [];
  try {
    const raw = w.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveCompare(ids: string[]) {
  const w = safeWindow();
  if (!w) return;
  const unique = Array.from(new Set(ids)).slice(0, LIMIT);
  w.localStorage.setItem(KEY, JSON.stringify(unique));
}

export function toggleCompare(id: string): string[] {
  const current = getCompare();
  const i = current.indexOf(id);
  if (i >= 0) {
    current.splice(i, 1);
  } else {
    if (current.length >= LIMIT) return current; // ignore if already at limit
    current.push(id);
  }
  saveCompare(current);
  return current;
}

export function addCompare(id: string): string[] {
  const current = getCompare();
  if (!current.includes(id) && current.length < LIMIT) {
    current.push(id);
    saveCompare(current);
  }
  return current;
}

export function removeCompare(id: string): string[] {
  const current = getCompare().filter(x => x !== id);
  saveCompare(current);
  return current;
}

export function clearCompare() {
  saveCompare([]);
}

// Simple hook for reactive state
export function useCompare() {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(getCompare());
  }, []);

  const addToCompare = (id: string) => {
    const newSelected = addCompare(id);
    setSelected(newSelected);
  };

  const removeFromCompare = (id: string) => {
    const newSelected = removeCompare(id);
    setSelected(newSelected);
  };

  const clearCompareState = () => {
    clearCompare();
    setSelected([]);
  };

  const isSelected = (id: string) => selected.includes(id);
  const canAdd = selected.length < LIMIT;

  return {
    selected,
    addToCompare,
    removeFromCompare,
    clearCompare: clearCompareState,
    isSelected,
    canAdd,
    maxCompare: LIMIT,
  };
}
