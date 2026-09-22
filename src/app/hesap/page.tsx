import { PasswordForm, ProfileForm } from "@/components/account/profile-forms";
import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export default function AccountPage() {
  return (
    <div>
      <PageHeading eyebrow="Senin Mazen’in" title="Hesap bilgilerim" />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className={styles.panel}>
          <h2 className={styles.blockTitle}>Bilgilerim</h2>
          <div className="mt-4">
            <ProfileForm />
          </div>
        </section>
        <section className={styles.panel}>
          <h2 className={styles.blockTitle}>Şifre değiştir</h2>
          <div className="mt-4">
            <PasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
