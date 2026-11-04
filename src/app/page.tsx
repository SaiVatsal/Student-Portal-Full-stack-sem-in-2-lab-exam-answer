import { redirect } from "next/navigation";
import { getSession } from "@/lib/security/session";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.isMfaVerified) {
    redirect("/auth/mfa-challenge");
  }

  if (session.forcePasswordChange) {
    redirect("/auth/change-password");
  }

  redirect(`/${session.role}/dashboard`);
}
