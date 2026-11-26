import { PortfolioHomeShell } from "@/components/PortfolioHomeShell";
import { HomeJsonLdScripts } from "@/components/seo/JsonLdScripts";

export default function HomePage() {
  return (
    <>
      <HomeJsonLdScripts locale="id" />
      <PortfolioHomeShell locale="id" />
    </>
  );
}
