import { OG_IMAGE_SIZE, renderPortfolioOgImage } from "@/lib/og-card";

export const alt =
  "Danu Candra Saputra — Fullstack Web Developer Portfolio (danucs)";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function EnglishOpenGraphImage() {
  return renderPortfolioOgImage("en");
}
