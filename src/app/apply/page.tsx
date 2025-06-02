'use client'

import { Suspense } from 'react';

import {ApplyPageContent} from "@/components/ApplyPageContent";
import Loading from "@/components/Loading";

export default function ApplyPage() {
  return (
      <Suspense fallback={<Loading />}>
        <ApplyPageContent />
      </Suspense>
  );
}