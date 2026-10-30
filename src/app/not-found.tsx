import Link from "@/components/ui/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4 pt-6">
      <p className="font-display text-[min(180px,22vw)] leading-[0.8]">404</p>
      <p className="max-w-md text-[17px]">That page is not part of this shop.</p>
      <Link href="/" className="press inline-flex h-14 items-center rounded-pill bg-fg px-8 font-semibold text-bg">
        Back home
      </Link>
    </section>
  );
}
