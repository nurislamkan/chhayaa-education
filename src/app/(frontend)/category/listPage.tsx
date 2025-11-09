import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Breadcrumbs,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PostSidebar from "../blog/sidebar";
import { getserverAuth } from "@/utils/api/actions";
import ViewModeButton from "../blog/viewModeButton"; // Import the new button component
import { fetchCategoryData } from "@data/category/use-category.query";
import Link from "next/link";
import { BsFillSignpost2Fill } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const ListPage = async ({ viewMode }: { viewMode: "list" | "grid" }) => {
  const ctx = getserverAuth();

  // Fetch blog posts
  const categorise = await fetchCategoryData(
    {
      where: { categoryType: "post" },
      order: ["createdAt DESC"],
    },
    ctx
  );

  return (
    <Box p={3}>
      <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 10 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{
              padding: "0 0 10px",
              borderBottom: "dotted 1px #ccc",
              marginBottom: 2,
            }}
          >
            <Breadcrumbs
              separator={<MdOutlineKeyboardDoubleArrowRight fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link href={`/blog/`} passHref>
                Blog
              </Link>
              <Typography color="text.primary">Blog Categorise</Typography>
            </Breadcrumbs>

            {/* 🔹 Use Next.js links for switching views */}
            <Box>
              <ViewModeButton mode="list" active={viewMode === "list"} />
              <ViewModeButton mode="grid" active={viewMode === "grid"} />
            </Box>
          </Box>

          {/* Blog Posts */}
          <Grid container spacing={2}>
            {categorise.length > 0 ? (
              categorise.map((item: any) => (
                <Grid
                  key={item.id}
                  size={{
                    xs: 12,
                    sm: viewMode === "grid" ? 6 : 12,
                    md: viewMode === "grid" ? 2 : 12,
                  }}
                >
                  <Card
                    sx={{ display: viewMode === "list" ? "flex" : "block" }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {item.categoryName}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="rgba(0, 0, 0, 0.6)"
                        sx={{ marginBottom: 2 }}
                      >
                        <BsFillSignpost2Fill /> &nbsp; Total post: 10
                      </Typography>

                      <Button variant="contained" color="primary">
                        <Link
                          href={`/category/${item.identifier}`}
                          key={item.categoryName}
                        >
                          View Posts
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No blog posts found.</Typography>
            )}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <PostSidebar />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListPage;
