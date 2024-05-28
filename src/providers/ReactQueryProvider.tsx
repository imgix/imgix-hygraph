'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

type ReactQueryProvider = PropsWithChildren;

const ReactQueryProvider = ({ children }: ReactQueryProvider) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { ReactQueryProvider };
