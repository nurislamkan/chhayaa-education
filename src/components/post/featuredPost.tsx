import { fetchPostsData } from "@/data/posts/use-posts.query";
import { getserverAuth } from "@utils/api/actions";
import { Box, Card, CardContent, Typography } from "@mui/material"; 
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { MdCategory } from "react-icons/md";
import Link from "next/link";
import { IoIosPricetags } from "react-icons/io";
import LinkButton from "../ui/link-button";


export default async function FeaturePost({limit = 10}: { limit?: number }) {
  const ctx = getserverAuth();
 
  // Fetch initial posts
  const posts = await fetchPostsData(
    {
      where: { deleted: false, postStatus: "published" },
      include: [
        {
          relation: "category",
          scope: { fields: { id: true, identifier: true, categoryName: true } },
        },
        {
          relation: "tags",
          scope: {
            fields: { id: true, identifier: true, postId: true, name: true },
          },
        },
      ],
      order: ["createdAt DESC"],
      limit: limit,
    },
    ctx
  );

  return (
    <>
      {posts.length > 0 && (
        <Box mt={2}>
          <Grid container spacing={2}>
            {posts.map((relPost: any) => (
              <Grid key={relPost.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
    </>
  );
}
