"use client"; // Error boundaries must be Client Components
import { logError } from "@/utils/logger";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error, 
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
     logError(error);
  }, [error]);

  return (
    <Container
      maxWidth="lg"
      style={{ textAlign: "center", marginTop: "5%", marginBottom: "100px" }}
    >
      <Box>
        <Typography variant="h4" color="error" gutterBottom>
          This page can&apos;t be reached
        </Typography>

        <Typography variant="h5" color="textSecondary" paragraph>
          Oops! Something went wrong on our end.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please try again later. If the issue persists, contact support.
        </Typography>
        <Link href="/shop" passHref style={{ marginTop: "20px" }}>
          Go Back to Shop
        </Link>
      </Box>
    </Container>
  );
}
