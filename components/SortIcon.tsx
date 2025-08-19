type Props = { dir: 'asc' | 'desc' | null };
export default function SortIcon({ dir }: Props) {
  const base = 'inline-flex flex-col items-center justify-center -my-1 ml-1';
  const tri = 'w-0 h-0 border-l-4 border-r-4 border-transparent';
  return (
    <span aria-hidden className={base}>
      <span className={`${tri} border-b-6 ${dir === 'asc' ? 'border-b-slate-900' : 'border-b-slate-300'}`} />
      <span className={`${tri} border-t-6 ${dir === 'desc' ? 'border-t-slate-900' : 'border-t-slate-300'}`} />
    </span>
  );
}
