"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { useProductQuery } from "@data/products/use-product.query";
import ProductFilters from "./filters";
import Grid from "@mui/material/Grid";
import AddToCart from "@components/ui/AddToCartButton";
import { useRouter } from "next/navigation";
import { MdCategory } from "react-icons/md";
import Link from "next/link";
import { ImOffice } from "react-icons/im";

export default function ProductPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading, error, refetch } = useProductQuery({
    where: { deleted: false },
    include: [
      {
        relation: "category",
        scope: {
          fields: { id: true, categoryName: true },
        },
      },
      {
        relation: "company",
        scope: {
          fields: { id: true, name: true },
        },
      },
    ],
    order: ["createdAt DESC"],
    skip: (page - 1) * limit,
    limit,
  });

  if (data && !isLoading && products.length === 0) {
    setProducts(data);
  }

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);

    const newData = await refetch();
    if (newData.data) {
      setProducts((prevProducts) => [...prevProducts, ...newData.data]);
    }

    setLoadingMore(false);
  };

  return (
    <Box p={3}>
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress size={50} />
        </Box>
      )}
      {!isLoading && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 2 }}>
            <ProductFilters />
          </Grid>

          <Grid size={{ xs: 12, md: 10 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <FormControl size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
              <Box>
                <Button
                  onClick={() => setViewMode("list")}
                  variant={viewMode === "list" ? "contained" : "outlined"}
                >
                  <ViewListIcon />
                </Button>
                <Button
                  onClick={() => setViewMode("grid")}
                  variant={viewMode === "grid" ? "contained" : "outlined"}
                  sx={{ ml: 1 }}
                >
                  <GridViewIcon />
                </Button>
              </Box>
            </Box>

            {products.length > 0 ? (
              <Grid container spacing={2}>
                {products.map((product: any) => (
                  <Grid
                    key={product.id}
                    size={{
    xs: 12,
    sm: viewMode === "grid" ? 6 : 12,
    md: viewMode === "grid" ? 3 : 12,
  }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: viewMode === "list" ? "row" : "column",
                        alignItems: "center",
                        p: 2,
                        border: "solid 1px #ccc",
                        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.15s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={product.imageUrl}
                        alt={product.name}
                        sx={{
                          width: viewMode === "list" ? 150 : "100%",
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                      <CardContent
                        sx={{
                          flex: 1,
                          textAlign: viewMode === "list" ? "left" : "center",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          marginBottom={1}
                        >
                          <MdCategory /> &nbsp;
                          <Link
                            href={`#${product.category.categoryName}`}
                            key={product.category.categoryName}
                          >
                            {product.category.categoryName}
                          </Link>, &nbsp; <ImOffice /> &nbsp;
                          <Link
                            href={`#${product.company.name}`}
                            key={product.company.name}
                          >
                            {product.company.name}
                          </Link>
                        </Typography>
                        
                        <Typography variant="h5" sx={{ my: 1 }}>
                          ${product.price}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              router.push(`/shop/${product?.identifier}`)
                            }
                          >
                            Details
                          </Button>
                          <AddToCart product={product} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No products found</Typography>
            )}

            {error && (
              <Typography color="error">Error loading products</Typography>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
                disabled={isLoading || data.length === 0}
              >
                {loadingMore ? <CircularProgress size={24} /> : "Load More"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
