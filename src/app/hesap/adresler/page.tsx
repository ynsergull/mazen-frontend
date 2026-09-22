import { AddressBook } from "@/components/account/address-book";
import { PageHeading } from "@/components/site/page-heading";

export default function AddressesPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Senin Mazen’in"
        title="Adreslerim"
        meta="Teslimat ve fatura adreslerini burada tutarsın."
      />
      <div className="mt-8">
        <AddressBook />
      </div>
    </div>
  );
}
