import Link from "next/link";
import { Container, Typography, Button, Box } from "@mui/material";

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page non trouvée
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" color="primary">
            Retour à l&apos;accueil
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
