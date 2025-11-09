import {
  Box,
  Breadcrumbs,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PostSidebar from "../sidebar";
import Link from "next/link";
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoIosPricetags, IoMdClock } from "react-icons/io";
import { getserverAuth } from "@utils/api/actions";
import { FaUserCircle } from "react-icons/fa";
import {
  fetchPostsDetails,
  fetchRelatedPosts,
} from "@data/posts/use-posts.query";
import Image from "next/image";
import { MdCategory, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import React from "react";
import LinkButton from "@components/ui/link-button";

interface Post {
  id: string; // Added the missing 'id' property
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  content: string;
  featured?: string;
  categoryId?: number;
  category: {
    categoryName: string;
    identifier: string;
  };
  tags?: {
    id: string;
    postId: string;
    name: string;
    identifier: string;
  }[];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const ctx = await getserverAuth();

  const { identifier } = await params;

  let post: Post | null = null;

  if (identifier) {
    post = await fetchPostsDetails(identifier, ctx);
  }

  const relatedPosts = post
    ? await fetchRelatedPosts(post?.categoryId?.toString() || "", post.id, ctx)
    : [];

  if (!post) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress size={50} />
      </Box>
    ); // Or display an error message
  }

  const { tags } = post;
  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Main content */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Box
            mb={2}
            sx={{ padding: "0 0 10px", borderBottom: "dotted 1px #ccc" }}
          >
            {/* Breadcrumb navigation */}
            <Breadcrumbs
              separator={<MdOutlineKeyboardDoubleArrowRight fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link href={`/blog/`} passHref>
                Blog
              </Link>

              <Link
                href={`/category/${post.category.identifier}`}
                key={post.category.categoryName}
              >
                {post.category.categoryName}
              </Link>

              <Typography color="text.primary">{post.title}</Typography>
            </Breadcrumbs>
          </Box>
          <Box
            mb={2}
            sx={{ padding: "0 0 30px", borderBottom: "dotted 1px #ccc" }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              {post.title}
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box display="flex" alignItems="center">
                <FaUserCircle
                  style={{ marginRight: 8, width: 16, height: 16 }}
                />
                <Typography variant="body2">{post.createdBy}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <FaRegCalendarDays
                  style={{ marginRight: 8, width: 16, height: 16 }}
                />
                <Typography variant="body2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <IoMdClock style={{ marginRight: 8, width: 16, height: 16 }} />
                <Typography variant="body2">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* Conditionally render the featured image if it exists */}
            {post.featured && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "auto",
                  marginBottom: 2,
                }}
              >
                <Image
                  src={post.featured}
                  alt={post.title}
                  layout="intrinsic"
                  width={1200}
                  height={600}
                  objectFit="cover"
                  priority={true}
                  placeholder="blur"
                  blurDataURL={post.featured}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </Box>
            )}

            {/* Category Link */}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginBottom: 1 }}
            >
              <MdCategory /> &nbsp;
              <Link
                href={`/category/${post.category.identifier}`}
                key={post.category.categoryName}
              >
                {post.category.categoryName}
              </Link>
            </Typography>

            {/* Tags Section */}
            <Typography
              variant="body2"
              color="rgba(0, 0, 0, 0.6)"
              sx={{ marginBottom: 2 }}
            >
              <IoIosPricetags /> &nbsp;
              {tags &&
                tags.length > 0 &&
                tags.map((tag, index) => (
                  <React.Fragment key={tag.id}>
                    <Link href={`/tag/${tag.identifier}`}>{tag.name}</Link>
                    {index < tags.length - 1 && ", "}
                  </React.Fragment>
                ))}
            </Typography>

            {/* Render post content with dangerouslySetInnerHTML */}
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: post.content }}
              sx={{
                lineHeight: 1.6,
                fontSize: "1rem",
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                },
                "& a": {
                  textDecoration: "none",
                  color: "primary.main",
                },
                "& p": {
                  marginBottom: 16,
                },
              }}
            />
          </Box>
          {relatedPosts.length > 0 && (
            <Box mt={2}>
              <Typography variant="h5" gutterBottom>
                Related Posts
              </Typography>
              <Grid container spacing={2}>
                {relatedPosts.map((relPost: any) => (
                  <Grid key={relPost.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      {relPost.featured && (
                        <Image
                          src={relPost.featured}
                          alt={relPost.title}
                          width={600}
                          height={200}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6">
                          {relPost.title.length > 30
                            ? relPost.title.slice(0, 30) + "..."
                            : relPost.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <MdCategory /> &nbsp;
                          <Link
                            href={`/category/${relPost.category.identifier}`}
                            key={relPost.category.categoryName}
                          >
                            {relPost.category.categoryName}
                          </Link>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="rgba(0, 0, 0, 0.6)"
                          sx={{ marginBottom: 2 }}
                        >
                          <IoIosPricetags /> &nbsp;
                          {relPost.tags
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
                        <LinkButton
                          href={`/blog/${relPost.identifier}`}
                          buttonName="Details"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <PostSidebar />
        </Grid>
      </Grid>
    </Box>
  );
}
