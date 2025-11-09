"use client"; // Error boundaries must be Client Components

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
    // eslint-disable-next-line no-console
    console.error(error); // or send to a logging service instead
  }, [error]);

  return (
    <Container
      maxWidth="lg"
      sx={{ textAlign: "center", mt: "5%", mb: "100px" }}
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

        <Link href="/blog" passHref style={{ marginTop: "20px" }}>
          Go Back to Blog
        </Link>
      </Box>
    </Container>
  );
}
