export default function Container({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`mx-auto max-w-6xl w-full px-4 py-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
