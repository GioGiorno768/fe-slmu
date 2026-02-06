"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import Spinner from "../dashboard/Spinner";

export default function LoginCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/access`
        );
        if (response.ok) {
          const data = await response.json();
          const disabled = data.data?.disable_login ?? false;
          setIsDisabled(disabled);
          if (disabled) {
            // Redirect to landing page immediately
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Failed to fetch access settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, [router]);

  // Show loading state briefly while checking
  if (isLoading || isDisabled) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
