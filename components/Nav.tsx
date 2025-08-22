export default function Nav() {
    return (
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="/" className="text-lg font-semibold">TBR</a>
          <div className="flex gap-5 text-sm">
            <a href="/compare" className="hover:underline">Compare</a>
            <a href="/guide" className="hover:underline">Buyer’s Guide</a>
            <a href="/about" className="hover:underline">About</a>
          </div>
        </nav>
      </header>
    );
  }
  