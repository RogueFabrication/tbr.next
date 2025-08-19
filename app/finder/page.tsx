import { redirect } from 'next/navigation';

/**
 * Finder route: canonical content now lives on /guide.
 * 
 * Keep this page as a tiny server component that redirects.
 */
export default function FinderRedirect() {
  redirect('/guide');
}
