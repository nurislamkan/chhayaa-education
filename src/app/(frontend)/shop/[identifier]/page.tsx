import {
  Box, 
  Button, 
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Grid"; 
import ProductInfo from "../productInfo"; 
import RelatedProducts from "../relatedProducts";
import { fetchProductDetails } from "@data/products/use-product.query";
import { getserverAuth } from "@/utils/api/actions"; 

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) => {
  const ctx = getserverAuth();
  const { identifier } = (await params) as { identifier: string };
  const product = await fetchProductDetails(identifier as string, ctx); 

  // if (isLoading) return <CircularProgress />;
  // if (error || !product) return <Typography>Error loading product</Typography>;

  return (
    <Box p={3}>
      {/* Product Details Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <ProductGallery images={product.data.images} /> */}
          <CardMedia
            component="img"
            src={product.data.imageUrl}
            alt={product.data.name}
            sx={{
              height: "auto",
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductInfo product={product?.data} />
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
            Add to Cart
          </Button>
          <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
            Buy Now
          </Button>
        </Grid>
        <Grid size={{ xs: 12 }}> {product.data.description}</Grid>
      </Grid>

      {/* Tabs Section (Description & Reviews) */}
      {/* <TabsSection product={product?.data} /> */}

      {/* Related Products */}
      <RelatedProducts productId={product?.data.id} categoryId={product?.data.categoryId} />
    </Box>
  );
};

export default ProductDetailsPage;
