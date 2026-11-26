import { PortfolioHomeShell } from "@/components/PortfolioHomeShell";
import { HomeJsonLdScripts } from "@/components/seo/JsonLdScripts";

export default function EnglishHomePage() {
  return (
    <>
      <HomeJsonLdScripts locale="en" />
      <PortfolioHomeShell locale="en" />
    </>
  );
}
