"use client";
import { ChevronDown, Circle } from "lucide-react"; // Tambah Circle buat default icon
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavItem } from "@/types/type";
import { Link } from "@/i18n/routing";

export default function SidebarItem({
  item,
  isCollapsed,
  isActive,
  isChildActive,
  onClose,
}: {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  isChildActive: boolean;
  onClose: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(isChildActive);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // SAFETY CHECK: Kalau icon undefined, pake icon default (Circle)
  const Icon = item.icon || Circle;

  // Calculate popup position when opened
  useEffect(() => {
    if (isPopupOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top,
        left: rect.right + 8, // 8px gap from button
      });
    }
  }, [isPopupOpen]);

  // Efek buat nutup popup kalo diklik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  // Efek buat nutup popup/dropdown kalo sidebar di-toggle
  useEffect(() => {
    if (isCollapsed) {
      setIsDropdownOpen(false); // Tutup dropdown inline
    } else {
      setIsPopupOpen(false); // Tutup popup
    }
  }, [isCollapsed]);

  // === 1. JIKA ITEM PUNYA ANAK (DROPDOWN / POPUP) ===
  if (item.children) {
    return (
      <div ref={ref} className="relative mb-1">
        {/* Tombol Parent */}
        <button
          ref={buttonRef}
          onClick={() => {
            if (isCollapsed) {
              setIsPopupOpen(!isPopupOpen);
            } else {
              setIsDropdownOpen(!isDropdownOpen);
            }
          }}
          title={item.label}
          className={`
            flex items-center justify-between w-full gap-3 px-[3em] py-3 rounded-md
            transition-all duration-200
            ${
              isChildActive
                ? "text-white"
                : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
            }
            ${
              isCollapsed
                ? "justify-center"
                : "hover:bg-[#1f2545] hover:text-white"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} flex-shrink-0`}
            />
            {!isCollapsed && (
              <span className="font-medium text-[1.6em] line-clamp-1">
                {item.label}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* Dropdown Content (Mode Expanded) */}
        {!isCollapsed && (
          <div
            className={`
              grid transition-all duration-300 ease-in-out
              ${
                isDropdownOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }
            `}
          >
            <div className="overflow-hidden">
              <div className="mt-1 ml-[3em] pl-[1.5em] border-l border-slate-700">
                {item.children.map((child) => {
                  // Safety Check buat Child Icon juga
                  const ChildIcon = child.icon || Circle;
                  const isChildItemActive =
                    pathname === child.href || pathname.endsWith(child.href!);

                  return (
                    <Link
                      key={child.href}
                      href={child.href!}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md mt-1
                        transition-all duration-200 text-[1.5em]
                        ${
                          isChildItemActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                        }
                      `}
                    >
                      <ChildIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium line-clamp-1">
                        {child.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Popup Flyout (Mode Collapsed) - Fixed positioning to escape overflow */}
        <div
          style={{
            top: popupPosition.top,
            left: popupPosition.left,
          }}
          className={`
            fixed z-[9999]
            bg-[#10052C] shadow-lg rounded-md p-2 w-max
            transition-all duration-150 ease-out transform
            ${
              isCollapsed && isPopupOpen
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible pointer-events-none"
            }
            origin-left space-y-[1em]
          `}
        >
          {item.children.map((child) => {
            const ChildIcon = child.icon || Circle;
            const isChildItemActive =
              pathname === child.href || pathname.endsWith(child.href!);
            return (
              <Link
                key={child.href}
                href={child.href!}
                onClick={() => {
                  onClose();
                  setIsPopupOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md
                  transition-all duration-200 text-[1.4em] w-full
                  ${
                    isChildItemActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                  }
                `}
              >
                <ChildIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium line-clamp-1">{child.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  //  === 2. JIKA ITEM BIASA (LINK LANGSUNG) ===
  return (
    <Link
      key={item.href}
      href={item.href!}
      onClick={onClose}
      title={item.label}
      className={`
        flex items-center gap-3 px-[3em] py-3 rounded-md mb-1
        transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "text-slate-400 hover:bg-[#1f2545] hover:text-white"
        }
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <Icon
        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} flex-shrink-0`}
      />
      {!isCollapsed && (
        <span className="font-medium text-[1.6em] line-clamp-1">
          {item.label}
        </span>
      )}
    </Link>
  );
}
