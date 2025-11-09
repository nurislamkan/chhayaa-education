"use client";
import React, { useState } from "react";
import { useCategoryQuery } from "@data/category/use-category.query";
import { Typography } from "@mui/material";
import CategoryTable from "@components/category/category-table";
import Grid from "@mui/material/Grid";
import CreateCategory from "@components/category/create-category"; 

export default function CategoryPage() {
  const [search, setSearch] = useState("");
  const { data:categoryList, refetch, isPending } = useCategoryQuery({
    where: { deleted: 0 },
    order: ["createdAt DESC"],
  });
  

  return (
    <>
      <CreateCategory categoryData={categoryList} search={search} setSearch={setSearch} refetch={refetch}/>
      {Array.isArray(categoryList) && categoryList.length > 0 ? (
        <CategoryTable data={categoryList} search={search} refetch={refetch} />
      ) : (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" align="center" color="textSecondary">
            {isPending ? (
              <span>Loading...</span>
            ) : (
              <span>No categories found</span>
            )}
             

          </Typography>
        </Grid>
      )}
    </>
  );
}
