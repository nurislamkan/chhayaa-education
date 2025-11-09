import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchProductData } from "@data/products/use-product.query";
import { getserverAuth } from "@/utils/api/actions";
import Link from "next/link";
import { MdCategory } from "react-icons/md";
import { ImOffice } from "react-icons/im";

interface Props {
  categoryId: string;
  productId: number;
}

const RelatedProducts = async ({ productId, categoryId }: Props) => {
  const ctx = getserverAuth(); 
  const query = {
    where: { categoryId, deleted: false, productId: { neq: productId } },
    limit: 10,
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
  };
  const relatedProducts = await fetchProductData(query, ctx);

  return (
    <Box mt={5}>
      <Typography variant="h5" mb={2}>
        Related Products
      </Typography>
      <Grid container spacing={2}>
        {relatedProducts.map((product: any) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 2 }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
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
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              <CardContent sx={{ flex: 1 }}>
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
                  </Link>
                  , &nbsp; <ImOffice /> &nbsp;
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
                  <Link href={`/shop/${product.identifier}`} passHref>
                    <Button variant="contained" color="primary" size="small">
                      Details
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default RelatedProducts;
