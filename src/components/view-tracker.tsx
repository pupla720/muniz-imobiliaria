"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ViewTracker({ codigo }: { codigo: string }) {
  useEffect(() => {
    trackEvent({ name: "view_property", codigo });
  }, [codigo]);

  return null;
}
