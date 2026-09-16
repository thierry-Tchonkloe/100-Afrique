// src/hooks/useIsTouchDevice.ts
"use client";
import { useState, useEffect } from 'react';

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches); }, []);
  return isTouch;
}