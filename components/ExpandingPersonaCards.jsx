import { useState } from 'react';

const personas = [
  {
    id: 1,
    name: 'Randy',
    role: 'Farmer',
    quote:
      'When our equipment breaks down, reaching the dealer takes too long, so we often switch to brands with better support.',
    image: '/images/Farmer.jpg',
  },
  {
    id: 2,
    name: 'Dave',
    role: 'CEO',
    quote:
      'I want to build strong relationships with my customers, but I only hear from them when something goes wrong.',
    image: '/images/CEO.png',
  },
  {
    id: 3,
    name: 'Oliver',
    role: 'Mechanic',
    quote:
      "By the time I arrive, the problem has changed, and I have to go back and forth to figure out what's wrong.",
    image: '/images/Mechanic.png',
  },
  {
    id: 4,
    name: 'Kristan',
    role: 'Sales & Support Director',
    quote:
      'I manage customer data, so it worries me when they contact others. It becomes hard to track afterward.',
    image: '/images/Sales.jpg',
  },
];

/**
 * Expanding persona cards — React + Tailwind
 * Hover: card grows (flex-1 → flex-[3]) and quote/type scale together.
 */
export default function ExpandingPersonaCards({ items = personas }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="group/row flex h-[500px] w-full gap-4 max-md:h-auto max-md:flex-col">
      {items.map((person) => {
        const isActive = activeId === person.id;
        const isDimmed = activeId !== null && !isActive;

        return (
          <article
            key={person.id}
            onMouseEnter={() => setActiveId(person.id)}
            onMouseLeave={() => setActiveId(null)}
            className={[
              'group relative overflow-hidden rounded-2xl transition-all duration-500 ease-in-out',
              'max-md:h-[380px] max-md:flex-none',
              isActive ? 'flex-[3]' : isDimmed ? 'flex-[0.75]' : 'flex-1',
            ].join(' ')}
          >
            <img
              src={person.image}
              alt={`${person.name}, ${person.role}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-85 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-90 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:p-6 group-hover:opacity-100">
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-16 left-3 font-serif text-5xl leading-none text-white/20 transition-all duration-500 ease-in-out group-hover:bottom-20 group-hover:text-[80px]"
              >
                “
              </span>

              <p className="relative line-clamp-5 text-sm font-medium leading-snug tracking-tight text-white transition-all duration-500 ease-in-out group-hover:line-clamp-none group-hover:text-[20px] group-hover:leading-snug">
                {person.quote}
              </p>

              <p className="relative mt-2.5 truncate text-xs font-semibold text-white/90 transition-all duration-500 ease-in-out group-hover:mt-3.5 group-hover:overflow-visible group-hover:whitespace-normal group-hover:text-[15px]">
                — {person.name}, {person.role}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
