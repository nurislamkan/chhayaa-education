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
} from "@mui/material";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useCategoryQuery } from "@data/category/use-category.query";
import { useRouter } from "next/navigation";
import {
  useCreatePostsMutation,
  useTagsQuery,
} from "@data/posts/use-posts.query";
import { Autocomplete, Chip } from "@mui/material";
import { toast } from "react-toastify";
import { getAuthCredentials } from "@/utils/auth-utils";

// Load QuillEditor dynamically to avoid SSR issues
const QuillEditor = dynamic(() => import("@components/ui/quill-editor"), {
  ssr: false,
});

export default function PostCreateForm() {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState<File | null>(null);
  const [tagNames, setTagIds] = useState<string[]>([]);

  const { mutate: createPost } = useCreatePostsMutation();
  const credentials = getAuthCredentials();

  const { data: categories = [] } = useCategoryQuery({
    where: { deleted: false },
    order: ["categoryName ASC"],
  });

  const { data: tags = [] } = useTagsQuery({
    order: ["name ASC"],
  });
  // Ensure uniqueness by filtering duplicate tags based on their name
  const uniqueTags = Array.from(new Set(tags.map((tag: any) => tag.name)))
    .map((name) => tags.find((tag: any) => tag.name === name))
    .filter(Boolean);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const generatedIdentifier = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^\w-]+/g, ""); // Remove special characters (optional)

    setIdentifier(generatedIdentifier);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      categoryId: Number(categoryId),
      identifier,
      title,
      content,
      featured: featured?.name,
      tagNames,
      createdBy: credentials?.id || "", // Ensure createdBy is always a string
      postStatus: "pending",
    };

    createPost(postData, {
      onSuccess: () => {
        toast.success("Post created successfully!");
        router.push("/admin/posts");
      },
      onError: (error: any) => {
        toast.error(
          `Error creating post, '${error?.response?.data?.error.message}'- Please try again.`
        );
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={3}>
      <Typography variant="h5" mb={2}>
        Create Post
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={handleTitleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            sx={{ mb: 2 }}
            helperText="This will be the URL slug (e.g., 'Today news' for /today-news)"
          />

          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Content
            </Typography>
            <QuillEditor value={content} onChange={setContent} />
          </Box>

          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Featured Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFeatured(e.target.files ? e.target.files[0] : null)
              }
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
              required
            >
              {categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tag-select-label">Tags</InputLabel>
            <Select
              labelId="tag-select-label"
              multiple
              value={tagIds}
              onChange={(e) =>
                setTagIds(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value.map(String)
                )
              }
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const tag = tags.find((t: any) => String(t.id) === id);
                    return (
                      <Chip
                        key={id}
                        label={tag?.name}
                        onMouseDown={(e) => e.stopPropagation()} // 👈 prevents dropdown toggle
                        onDelete={(e) => {
                          e.stopPropagation(); // 👈 prevents dropdown toggle
                          setTagIds((prev) =>
                            prev.filter((tagId) => tagId !== id)
                          );
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {tags.map((tag: any) => (
                <MenuItem key={tag.id} value={String(tag.id)}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <Autocomplete
            multiple
            freeSolo
            options={uniqueTags.map((tag: any) => tag.name)} // Use unique tag names
            value={tagNames.map((name) => {
              const tag = uniqueTags.find((t: any) => t.name === name);
              return tag?.name || name;
            })}
            onChange={(e, newValue) => {
              // Convert names to tag IDs or keep new tag names
              const selected = newValue.map((val: string) => {
                const found = uniqueTags.find((t: any) => t.name === val);
                return found ? found.name : val;
              });
              setTagIds(selected as string[]);
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
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
