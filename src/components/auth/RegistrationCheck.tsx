"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import Modal from "@/components/common/Modal";
import Spinner from "../dashboard/Spinner";

export default function RegistrationCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/access`
        );
        if (response.ok) {
          const data = await response.json();
          // Block if either disable_registration OR disable_login is active
          const disabled =
            (data.data?.disable_registration ?? false) ||
            (data.data?.disable_login ?? false);
          setIsDisabled(disabled);
          if (disabled) {
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch access settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkRegistrationStatus();
  }, []);

  const handleGoHome = () => {
    setShowModal(false);
    router.push("/");
  };

  // Show loading state briefly while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Show modal if registration is disabled
  if (isDisabled) {
    return (
      <>
        <Modal
          isOpen={showModal}
          onClose={handleGoHome}
          title="Pendaftaran Ditutup"
          message="Mohon maaf, pendaftaran akun baru sedang ditutup sementara. Silakan coba lagi nanti atau hubungi admin untuk informasi lebih lanjut."
          type="warning"
          buttonLabel="Kembali ke Home"
          onButtonClick={handleGoHome}
        />
      </>
    );
  }

  return <>{children}</>;
}
