import React, { useState } from "react";

export default function MainNav() {
  const tabs = [
    "Top Stories",
    "Local News",
    "Politics",
    "Sports",
    "Tech",
    "Health",
    "Business",
    "Entertainment",
    "Blog",
  ];

  const [active, setActive] = useState("Top Stories");

  return (
    <nav
      className="w-full bg-white border-b border-gray-200"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-7xl flex items-center gap-8 px-6 pt-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              text-sm md:text-base relative pb-2
              transition-all duration-200 whitespace-nowrap
              ${
                active === tab
                  ? "text-[#D92626]"
                  : "text-gray-800 hover:text-gray-300"
              }
            `}
          >
            {tab}

            {/* ACTIVE UNDERLINE aligned with bottom border */}
            {active === tab && (
              <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#D92626] rounded-full"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
