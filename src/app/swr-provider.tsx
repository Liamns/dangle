"use client";
import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((r) => r.json()),
        onError: (error) => console.error("SWR Error:", error),
      }}
    >
      {children}
    </SWRConfig>
  );
}
