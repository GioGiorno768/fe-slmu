import AuthBranding from "@/components/auth/AuthBranding";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthPageCheck from "@/components/auth/AuthPageCheck";
import RegistrationCheck from "@/components/auth/RegistrationCheck";

export default function RegisterPage() {
  return (
    <RegistrationCheck>
      <AuthPageCheck>
        <main className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 font-figtree bg-white">
          <AuthBranding accentColor="purple" />
          <AuthFormWrapper allowScroll>
            <RegisterForm />
          </AuthFormWrapper>
        </main>
      </AuthPageCheck>
    </RegistrationCheck>
  );
}
