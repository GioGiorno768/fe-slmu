"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Home, ChevronRight, PlusSquare, User, Settings } from "lucide-react";
import type { NavItem } from "@/types/type";
// 👇 GANTI IMPORT INI (Ambil dari lib/menus)
import { getMemberMenu, getAdminMenu } from "@/lib/menus";

export default function Breadcrumb() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  // 👇 GABUNGIN MENU (Biar breadcrumb kenal halaman Admin & Member)
  const menuItems = [...getMemberMenu(t), ...getAdminMenu()];

  const breadcrumbNameMap: {
    [key: string]: { label: string; icon?: React.ElementType };
  } = {};

  const flattenMenuItems = (items: NavItem[]) => {
    for (const item of items) {
      if (item.href) {
        const segment = item.href.split("/").pop();
        if (segment && !segment.includes("http")) {
          breadcrumbNameMap[segment] = { label: item.label, icon: item.icon };
        }
      }
      if (item.children) {
        // Manual check buat parent label
        if (item.label === t("myLinks")) {
          breadcrumbNameMap["my-links"] = {
            label: item.label,
            icon: item.icon,
          };
        }
        flattenMenuItems(item.children);
      }
    }
  };

  flattenMenuItems(menuItems);

  // Mapping Manual Tambahan
  breadcrumbNameMap["new-link"] = { label: t("createLink"), icon: PlusSquare };
  breadcrumbNameMap["profile"] = { label: t("myProfile"), icon: User };
  breadcrumbNameMap["settings"] = { label: t("settings"), icon: Settings };

  const pathSegments = pathname.split("/").filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1] || "dashboard";
  const currentPageInfo = breadcrumbNameMap[currentSegment];
  const pageTitle = currentPageInfo
    ? currentPageInfo.label
    : t("breadcrumbDashboard");

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree">
      <h1 className="lg:text-[1.8em] text-[2.3em] font-semibold text-shortblack">
        {pageTitle}
      </h1>

      <nav
        className="flex items-center lg:text-[1.4em] text-[1.8em] text-grays"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-bluelight transition-colors"
            >
              <Home className="w-[1em] h-[1em]" />
              <span>{t("breadcrumbHome")}</span>
            </Link>
          </li>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const pageInfo = breadcrumbNameMap[segment];

            const Icon = pageInfo?.icon || ChevronRight;
            const label = pageInfo?.label || segment;

            // Hide system segments
            if (
              ["id", "en", "member", "admin", "super-admin"].includes(segment)
            )
              return null;

            return (
              <li key={segment} className="flex items-center gap-2">
                <ChevronRight className="w-[1em] h-[1em] text-grays" />
                {isLast ? (
                  <span className="flex items-center gap-2 text-gray-text">
                    {pageInfo && <Icon className="w-[1em] h-[1em]" />}
                    <span>{label}</span>
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="flex items-center gap-2 hover:text-bluelight transition-colors"
                  >
                    {pageInfo && <Icon className="w-[1em] h-[1em]" />}
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
