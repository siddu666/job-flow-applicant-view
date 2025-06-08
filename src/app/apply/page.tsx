'use client'

import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {ApplyPageContent} from "@/components/ApplyPageContent";
import Loading from "@/components/Loading";

export default function ApplyPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loading />}>
        <ApplyPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}