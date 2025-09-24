// components/ui/BentoGridPenAndPaper.jsx

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calculator,
  DivideCircle,
  Binary,
  Gem,
  ClipboardCheck,
  ListOrdered,
  CaseSensitive,
  Atom,
  Ruler,
  Puzzle,
} from "lucide-react";
import React from "react";

// --- The main grid container (no changes) ---
const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

// --- THE REIMAGINED BENTO GRID ITEM ---
const BentoGridItem = ({ className, title, description, to, icon }) => {
  // SVG for a scribbled underline effect
  const scribbleUnderline = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none'/%3e%3cpath d='M2 6C23.6667 2.66667 71.3333 2.66667 108 6' stroke='%23334155' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`;

  return (
    <Link
      to={to}
      className={cn(
        // Base styling for the "paper" card
        "group/bento row-span-1 rounded-lg",
        "bg-white border border-stone-200",
        "p-4 flex flex-col justify-between space-y-4",
        "relative transition-all duration-300 ease-in-out",
        "shadow-sm hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {/* --- Icon and Highlighter Effect --- */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* The "highlighter" div that appears on hover */}
        <div
          className={cn(
            "absolute h-16 w-16 bg-accent rounded-full",
            "transition-all duration-300 ease-in-out",
            "opacity-0 scale-75 group-hover/bento:opacity-100 group-hover/bento:scale-100",
            "-rotate-6" // Gives it a hand-drawn feel
          )}
        />
        {/* The Icon itself, sits on top */}
        {React.cloneElement(icon, {
          className: cn(
            icon.props.className,
            "h-12 w-12 text-slate-700 relative z-10 transition-transform duration-300",
            "group-hover/bento:scale-110"
          ),
        })}
      </div>

      {/* --- Text Content --- */}
      <div>
        <div className="relative inline-block">
          <h3 className="font-handwriting text-3xl font-bold text-slate-800 mb-1">
            {title}
          </h3>
          {/* The "scribbled underline" that draws on hover */}
          <div
            className="absolute bottom-0 left-0 h-2 w-0 group-hover/bento:w-full transition-all duration-500 ease-out"
            style={{ backgroundImage: scribbleUnderline }}
          />
        </div>
        <p className="font-sans text-xs text-slate-500">{description}</p>
      </div>
    </Link>
  );
};

// --- The main component that uses the grid ---
export function NavigationBento() {
  const items = [
    {
      title: "Arithmetic",
      description: "Perform basic arithmetic calculations.",
      to: "/arithmetic",
      className: "md:col-span-2",
      icon: <Calculator />,
    },
    {
      title: "Math Quiz",
      description: "Test your knowledge with a fun math quiz.",
      to: "/quiz",
      className: "md:col-span-1",
      icon: <ClipboardCheck />,
    },
    {
      title: "Divisibility",
      description: "Check if one number is divisible by another.",
      to: "/divisibility",
      className: "md:col-span-1",
      icon: <DivideCircle />,
    },
    {
      title: "Prime Numbers",
      description: "Identify if a number is prime.",
      to: "/prime-number",
      className: "md:col-span-1",
      icon: <Gem />,
    },
    {
      title: "Factorization",
      description: "Break down a number into its prime factors.",
      to: "/prime-factorization",
      className: "md:col-span-1",
      icon: <Atom />,
    },
    {
      title: "Find Factors",
      description: "Find all the factors of a given integer.",
      to: "/factors",
      className: "md:col-span-1",
      icon: <Binary />,
    },
    {
      title: "Number To Words",
      description: "Convert numbers into their word representation.",
      to: "/number-name",
      className: "md:col-span-2",
      icon: <CaseSensitive />,
    },
    {
      title: "Number Sorter",
      description: "Sort a list of numbers in any order.",
      to: "/sort",
      className: "md:col-span-1",
      icon: <ListOrdered />,
    },
    {
      title: "Place Value",
      description: "Understand the value of each digit.",
      to: "/place-value",
      className: "md:col-span-1",
      icon: <Ruler />,
    },
    {
      title: "Playground",
      description: "Explore various interactive math concepts.",
      to: "/playground",
      className: "md:col-span-1",
      icon: <Puzzle />,
    },
  ];

  return (
    <BentoGrid className="my-8">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          to={item.to}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
