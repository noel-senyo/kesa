import Image from "next/image";

import { AuthArtWord } from "@/components/auth/AuthArtWord";
import Link from "@/components/ui/link";
import { products } from "@/data/products";
import { site } from "@/data/site";

const placements = [
  "right-[12%] top-[16%] w-[42%] rotate-[5deg]",
  "left-[14%] top-[26%] w-[36%] -rotate-6",
];

/**
 * Sign-in and sign-up sit under the same navigation as the shop:
 * an ink panel with two pieces on desktop, the form beside it.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const photos = products.slice(0, 2);

  return (
    <div
      data-auth-page=""
      className="-mx-4 grid min-h-dvh px-4 pb-8 pt-2 lg:-mx-8 lg:grid-cols-2 lg:gap-12 lg:p-6"
    >
      <aside className="relative hidden min-h-[820px] flex-col justify-between overflow-hidden rounded-[36px] bg-[#111214] p-8 text-[#F2F3F4] lg:flex dark:bg-[#1F2023] dark:text-[#ECEDEE]">
        <Link href="/" className="relative z-[2] font-display text-[28px] font-extrabold">
          {site.name}
        </Link>
        {photos.map((product, index) => (
          <Image
            key={product.id}
            src={product.image}
            alt=""
            width={420}
            height={560}
            sizes="20vw"
            className={`absolute aspect-[3/4] rounded-photo-lg bg-photo object-cover shadow-[0_40px_80px_rgba(0,0,0,.3)] ${placements[index]}`}
          />
        ))}
        <span className="relative z-[2] font-display text-[min(180px,12vw)] leading-[0.8]">
          <AuthArtWord />
        </span>
      </aside>
      {children}
    </div>
  );
}
