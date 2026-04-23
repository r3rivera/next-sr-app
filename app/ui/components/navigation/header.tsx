import { cn } from '@/app/lib/utils';
import { PrimaryBtn } from '@/app/ui/components/buttons/primary-btn';

interface HeaderProps {
  className?: string;
}

interface BannerProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 w-full items-center justify-between bg-black px-6 shadow-md',
        className,
      )}
    >
      <span className="text-lg font-semibold tracking-tight text-white">
        SR Dashboard
      </span>
      <nav className="flex items-center gap-6">
        <a
          href="/"
          className="text-sm text-gray-300 transition-colors hover:text-white"
        >
          Home
        </a>
        <a
          href="/dashboard"
          className="text-sm text-gray-300 transition-colors hover:text-white"
        >
          Dashboard
        </a>
        <a
          href="/panel"
          className="text-sm text-gray-300 transition-colors hover:text-white"
        >
          My Panel
        </a>
        <PrimaryBtn
          className="bg-[#96151D] hover:bg-[#7a1118] focus-visible:outline-[#96151D] active:bg-[#5e0d13]"
        >
          Get Started
        </PrimaryBtn>
      </nav>
    </header>
  );
}

export function Banner({ className }: BannerProps) {
  return (
    <section
      className={cn('relative w-full overflow-hidden rounded-xl shadow-lg', className)}
    >
      {/* Seasonal pastel columns using brand palette */}
      <div aria-hidden className="absolute inset-0 flex opacity-90">
        <div className="flex-1 bg-light-blue-200" />
        <div className="flex-1 bg-vanilla-custard-300" />
        <div className="flex-1 bg-tangerine-dream-300" />
        <div className="flex-1 bg-light-gold-200" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-white/30" />

      {/* flex-col-reverse: image renders above text on mobile */}
      <div className="relative flex flex-col-reverse items-center gap-8 p-8 md:flex-row md:gap-12 md:p-12">
        {/* Text content */}
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
            Find Your Home in Every Season
          </h1>
          <p className="text-base text-stone-600 md:text-lg">
            Discover properties that match your lifestyle — from cozy autumn
            retreats to sun-filled summer spaces.
          </p>
          <div className="mt-2">
            <PrimaryBtn
              className="bg-[#96151D] px-6 hover:bg-[#7a1118] focus-visible:outline-[#96151D] active:bg-[#5e0d13]"
            >
              Browse Listings
            </PrimaryBtn>
          </div>

          {/* Thumbnail strip */}
          <div className="mt-4 flex gap-3">
            {thumbnails.map((t) => (
              <div
                key={t.label}
                className="flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-full bg-stone-200 shadow-sm ring-2 ring-white"
                title={t.label}
              >
                <span className="text-xl">{t.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="flex h-56 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-stone-300 to-amber-200 shadow-inner md:h-72 md:w-80">
          <span className="text-6xl">🏡</span>
        </div>
      </div>
    </section>
  );
}

const thumbnails = [
  { label: 'Living Room', emoji: '🛋️' },
  { label: 'Kitchen', emoji: '🍳' },
  { label: 'Bedroom', emoji: '🛏️' },
];
