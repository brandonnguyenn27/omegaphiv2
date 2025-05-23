"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Format the segment for display (capitalize, remove hyphens)
  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">Omega Phi</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/${segments.slice(0, index + 1).join("/")}`}
                  >
                    {formatSegment(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
