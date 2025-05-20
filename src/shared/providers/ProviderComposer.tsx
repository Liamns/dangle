"use client";

import React from 'react';

interface ProviderComposerProps {
  providers: Array<[React.ComponentType<any>, Record<string, any>]>;
  children: React.ReactNode;
}

/**
 * ProviderComposer 컴포넌트
 * 여러 Provider를 중첩하여 사용할 때 가독성과 유지보수성을 높여주는 유틸리티 컴포넌트
 * @param providers - Provider 컴포넌트와 props를 담은 배열
 * @param children - 자식 노드
 */
const ProviderComposer: React.FC<ProviderComposerProps> = ({ providers, children }) => {
  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children
  );
};

export default ProviderComposer;
