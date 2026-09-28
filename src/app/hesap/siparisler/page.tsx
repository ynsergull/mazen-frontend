import { OrdersList } from "@/components/orders/orders-list";
import { PageHeading } from "@/components/site/page-heading";

export default function OrdersPage() {
  return (
    <div>
      <PageHeading eyebrow="Senin Mazen’in" title="Siparişlerim" meta="Sipariş durumunu ve kargo takibini buradan izlersin." />
      <div className="mt-8">
        <OrdersList />
      </div>
    </div>
  );
}
