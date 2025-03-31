"use client";

import React from "react";
import { Container, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProduitsPage() {
  const router = useRouter();

  // Rediriger vers tous-nos-produits
  React.useEffect(() => {
    router.push("/tous-nos-produits");
  }, [router]);

  return (
    <div className="produits-redirect">
      <Container>
        <div
          className="produits-redirect__content"
          style={{ padding: "50px 0", textAlign: "center" }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Redirection...
          </Typography>
          <Typography variant="body1" paragraph>
            Vous allez être redirigé vers notre page de produits.
          </Typography>
          <Typography>
            Si la redirection ne fonctionne pas, veuillez{" "}
            <Link
              href="/tous-nos-produits"
              style={{ color: "#3f51b5", textDecoration: "underline" }}
            >
              cliquer ici
            </Link>
          </Typography>
        </div>
      </Container>
    </div>
  );
}
