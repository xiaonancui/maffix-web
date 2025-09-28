'use client';

import { ConfigProvider } from 'antd';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3b82f6',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
