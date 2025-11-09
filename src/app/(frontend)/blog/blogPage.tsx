import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { IoIosPricetags } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import PostSidebar from "./sidebar";
import Link from "next/link";
import ViewModeButton from "./viewModeButton";
import Image from "next/image";
import LinkButton from "@components/ui/link-button";

const BlogPage = ({
  viewMode,
  posts,
}: {
  viewMode: "list" | "grid";
  posts: any[];
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
          <Typography variant="h5">Blog</Typography>

          {/* 🔹 Use Next.js links for switching views */}
          <Box>
            <ViewModeButton mode="list" active={viewMode === "list"} />
            <ViewModeButton mode="grid" active={viewMode === "grid"} />
          </Box>
        </Box>

        {/* Blog Posts */}
        <Grid container spacing={2}>
          {posts.length > 0 ? (
            posts.map((post: any) => (
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
                      {post.title.length > 30
                        ? post.title.slice(0, 30) + "..."
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
                    <LinkButton href={`/blog/${post.identifier}`} buttonName="Details" />                    
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

export default BlogPage;
