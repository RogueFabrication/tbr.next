'use client';
import React from 'react';
import CompareTray from './CompareTray';

type Props = {
  /** Server-rendered children from /guide subtree */
  children: React.ReactNode;
};

/**
 * GuideClientShell
 * 
 * Client-only wrapper for the /guide subtree.
 * 
 * Renders the bottom CompareTray on the client (it reads localStorage).
 */
export default function GuideClientShell({ children }: Props) {
  return (
    <>
      {children}
      <CompareTray />
    </>
  );
}
