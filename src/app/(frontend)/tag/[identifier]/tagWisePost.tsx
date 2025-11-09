import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Breadcrumbs,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { IoIosPricetags } from "react-icons/io";
import { MdCategory, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import PostSidebar from "../../blog/sidebar";
import Link from "next/link";
import ViewModeButton from "../../blog/viewModeButton"; // Import the new button component
import Image from "next/image";

const TagWisePostList = async ({
  viewMode,
  posts,
}: {
  viewMode: "list" | "grid";
  posts: { products: any[]; tagName: string };
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 10 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ padding: "0 0 10px", borderBottom: "dotted 1px #ccc" }}
        >
          <Breadcrumbs
            separator={<MdOutlineKeyboardDoubleArrowRight fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link href={`/blog/`}> Blog </Link>
            <Typography color="text.primary">{posts.tagName}</Typography>
          </Breadcrumbs>

          {/* 🔹 Use Next.js links for switching views */}
          <Box>
            <ViewModeButton mode="list" active={viewMode === "list"} />
            <ViewModeButton mode="grid" active={viewMode === "grid"} />
          </Box>
        </Box>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Tag : {posts.tagName}
        </Typography>

        {/* Blog Posts */}
        <Grid container spacing={2}>
          {posts.products.length > 0 ? (
            posts.products.map((post: any) => (
              <Grid
                key={post.id}
                size={{
                  xs: 12,
                  sm: viewMode === "grid" ? 6 : 12,
                  md: viewMode === "grid" ? 3 : 12,
                }}
              >
                <Card
                  sx={{
                    display: viewMode === "list" ? "flex" : "block",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  {post.featured && (
                    <Image
                      src={post.featured}
                      alt={post.title}
                      width={600}
                      height={200}
                      style={{
                        width: viewMode === "list" ? 150 : "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">
                      {post.title.length > 32
                        ? post.title.slice(0, 32) + "..."
                        : post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <MdCategory /> &nbsp;
                      <Link
                        href={`/category/${post.category.identifier}`}
                        key={post.category.categoryName}
                      >
                        {post.category.categoryName}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="rgba(0, 0, 0, 0.6)"
                      sx={{ marginBottom: 2 }}
                    >
                      <IoIosPricetags /> &nbsp;
                      {post.tags
                        .map(
                          (tag: {
                            id: string;
                            postId: string;
                            identifier: string;
                            name: string;
                          }) => (
                            <Link
                              href={`/tag/${tag.identifier}`}
                              key={tag.name}
                            >
                              {tag.name}
                            </Link>
                          )
                        )
                        .reduce(
                          (prev: React.ReactNode, curr: React.ReactNode) =>
                            [prev, ", ", curr] as React.ReactNode[]
                        )}
                    </Typography>

                    <Link href={`/blog/${post.identifier}`} passHref>
                      <Button variant="contained" color="primary">
                        Details
                      </Button>
                    </Link>
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
  );
};

export default TagWisePostList;
