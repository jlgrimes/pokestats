import React, { useState } from 'react';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AppLayout } from '../../src/components/Layout/AppLayout';
import { SessionProvider } from 'next-auth/react';

export default function EverythingDecorator(Story, context) {
  return (
    <SessionProvider session={null}>
      <AppLayout>
        <Story />
      </AppLayout>
    </SessionProvider>
  );
}
