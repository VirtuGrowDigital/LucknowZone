import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Top Stories", path: "/top-stories" },
  { label: "Local News", path: "/local" },
  { label: "Politics", path: "/politics" },
  { label: "Sports", path: "/sports" },
  { label: "Tech", path: "/tech" },
  { label: "Health", path: "/health" },
  { label: "Business", path: "/business" },
  { label: "Entertainment", path: "/entertainment" },
  { label: "Blog", path: "/blog" },
];

export default function MainNav() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl flex gap-8 px-6 pt-2 overflow-x-auto whitespace-nowrap">

        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `text-sm md:text-base pb-2 relative ${
                isActive ? "text-red-500" : "text-gray-700 hover:text-black"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {tab.label}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>
        ))}

      </div>
    </nav>
  );
}
