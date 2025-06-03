"use client";

import { useState, useEffect } from "react";

export default function NotificationsDropdown() {
  const [mounted, setMounted] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return null;
}
