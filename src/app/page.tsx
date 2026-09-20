import { HomeStorefront } from "@/components/home/home-storefront";
import { getHome } from "@/lib/api";

export default async function HomePage() {
  return <HomeStorefront data={await getHome()} />;
}
