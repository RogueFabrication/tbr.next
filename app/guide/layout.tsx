// Guide segment layout: client so we can mount the tray without SSR.
'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// CompareTray reads localStorage; keep it client-only.
const CompareTray = dynamic(() => import('../../components/CompareTray'), { ssr: false });

type Props = { children: React.ReactNode };

export default function GuideLayout({ children }: Props) {
  return (
    <>
      {children}
      <CompareTray />
    </>
  );
}
