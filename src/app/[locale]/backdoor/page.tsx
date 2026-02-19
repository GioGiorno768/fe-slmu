"use client";

import { useState } from "react";
import AuthBranding from "@/components/auth/AuthBranding";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import BackdoorLoginForm from "@/components/auth/BackdoorLoginForm";
import BackdoorCodeForm from "@/components/auth/BackdoorCodeForm";
import AuthPageCheck from "@/components/auth/AuthPageCheck";

export default function BackdoorPage() {
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  return (
    // NO LoginCheck wrapper - always accessible even when login is disabled
    <AuthPageCheck>
      <main className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 font-figtree bg-white">
        <AuthBranding
          title={
            isCodeVerified
              ? "Admin Access<br />Portal"
              : "Verifikasi<br />Akses"
          }
          subtitle={
            isCodeVerified
              ? "Login khusus untuk administrator sistem. User biasa tidak dapat mengakses halaman ini."
              : "Masukkan kode akses untuk melanjutkan ke portal administrator."
          }
          accentColor="purple"
        />
        <AuthFormWrapper allowScroll>
          {isCodeVerified ? (
            <BackdoorLoginForm />
          ) : (
            <BackdoorCodeForm onVerified={() => setIsCodeVerified(true)} />
          )}
        </AuthFormWrapper>
      </main>
    </AuthPageCheck>
  );
}
