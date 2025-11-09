"use client";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategoryQuery } from "@data/category/use-category.query";
import {
  useTagsQuery,
  useDetailsPostsInfo,
  useUpdatePostMutation,
} from "@data/posts/use-posts.query";
import { Autocomplete } from "@mui/material";
import { toast } from "react-toastify";

const QuillEditor = dynamic(() => import("@components/ui/quill-editor"), {
  ssr: false,
});

export default function EditPostForm() {
  const router = useRouter();
  const { identifier } = useParams();

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [identifierState, setIdentifier] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState<File | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [postStatus, setPostStatus] = useState("pending");

  const { data: categories = [] } = useCategoryQuery({
    where: { deleted: false },
    order: ["categoryName ASC"],
  });
  const { data: tags = [] } = useTagsQuery({ order: ["name ASC"] });
  const { data: post } = useDetailsPostsInfo(String(identifier));
  const { mutate: updatePost, isPending } = useUpdatePostMutation();

  const uniqueTags = Array.from(new Set(tags.map((tag: any) => tag.name)))
    .map((name) => tags.find((tag: any) => tag.name === name))
    .filter(Boolean);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setIdentifier(post.identifier);
      setCategoryId(String(post.categoryId));
      setContent(post.content);
      setTagNames(
        Array.isArray(post.tags) ? post.tags.map((tag: any) => tag.name) : []
      );
      setPostStatus(post.postStatus || "pending");
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updatePost(
      {
        id: post.id,
        identifier: String(identifier),
        categoryId: Number(categoryId),
        title,
        content,
        featured: featured?.name,
        tagNames,
        postStatus,
      },
      {
        onSuccess: () => {
          toast.success("Post updated successfully!");
          router.push("/admin/posts");
        },
        onError: (error: any) => {
          toast.error(
            `Update failed: ${
              error?.response?.data?.error?.message || "Unknown error"
            }`
          );
        },
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={3}>
      <Typography variant="h5" mb={2}>
        Edit Post
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Identifier"
            value={identifierState}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled
            sx={{ mb: 2 }}
          />
          <Box mb={2}>
            <Typography variant="body1">Content</Typography>
            <QuillEditor value={content} onChange={setContent} />
          </Box>
          <Box mb={2}>
            <Typography variant="body1">Featured Image</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFeatured(e.target.files?.[0] || null)}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
            >
              {categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            freeSolo
            options={uniqueTags.map((tag: any) => tag.name)}
            value={tagNames}
            onChange={(_, newValue) => {
              const selected = newValue.map((val: string) => {
                const found = uniqueTags.find((t: any) => t.name === val);
                return found ? found.name : val;
              });
              setTagNames(selected as string[]);
            }}
            renderTags={(value: string[], getTagProps) =>
              value.map((option, index) => {
                const tagProps = getTagProps({ index });
                return (
                  <React.Fragment key={`${option}-${index}`}>
                    <Chip
                      {...tagProps}
                      variant="outlined"
                      label={option}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  </React.Fragment>
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Enter or select tags"
              />
            )}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="post-status-label">Post Status</InputLabel>
            <Select
              labelId="post-status-label"
              value={postStatus}
              label="Post Status"
              onChange={(e) => setPostStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="deleted">Deleted</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isPending}
      >
        Update
      </Button>
    </Box>
  );
}
