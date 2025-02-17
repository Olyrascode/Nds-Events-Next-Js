// app/layout.server.tsx
import type { Metadata } from "next";
import ProvidersWrapper from "./providers.client";

export const metadata: Metadata = {
  title: "NDS Event - Location de matériel",
  description: "Découvrez la location de matériel événementiel avec NDS Event.",
};

export default function RootLayoutServer({ children }: { children: React.ReactNode }) {
  return <ProvidersWrapper>{children}</ProvidersWrapper>;
}
