import { PasswordForm, ProfileForm } from "@/components/account/profile-forms";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hesabım</h1>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}
