"use client";

import React from "react";
import ProviderComposer from "./ProviderComposer";
import { TooltipProvider } from "@/shared/components/tooltip";

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider 컴포넌트
 * 애플리케이션에서 사용하는
  모든 Provider를 관리하는 컴포넌트
 * 새로운 Provider가 필요할 때마다 여기에 추가하면 됩니다.
 * @param children - 자식 노드
 */
const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Provider와 해당 props를 배열로 정의
  const providers: Array<[React.ComponentType<any>, Record<string, any>]> = [
    [TooltipProvider, {}],
    // 추가 Provider는 여기에 추가
    // 예: [ThemeProvider, { theme: 'light' }],
    // 예: [AuthProvider, { loginUrl: '/login' }],
  ];

  return <ProviderComposer providers={providers}>{children}</ProviderComposer>;
};

export default AppProvider;
