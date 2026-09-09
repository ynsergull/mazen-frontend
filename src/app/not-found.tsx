import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold">Aradığınız sayfa bulunamadı</h1>
      <p className="text-sm text-muted-foreground">Ürün kaldırılmış ya da adres hatalı olabilir.</p>
      <Button render={<Link href="/" />}>Ana sayfaya dön</Button>
    </div>
  );
}
