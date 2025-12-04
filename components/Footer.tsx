import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-10 border-t py-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <Container>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2025 TubeBenderReviews · Owned and operated by Rogue Fabrication, LLC.
          </span>
          <nav className="flex gap-4">
            <a className="hover:underline" href="/about">
              About &amp; Disclosures
            </a>
            <a className="hover:underline" href="/about#contact">
              Contact
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
