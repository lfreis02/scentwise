import { getBrands } from "../lib/brands";
import HomeClient from "./home-client";

export const revalidate = 60;

export default async function Page() {
  const brands = await getBrands();
  return <HomeClient brands={brands} />;
}
