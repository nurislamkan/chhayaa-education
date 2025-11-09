import ProductTable from "@components/products/product/product-table";
import { fetchProductData } from "@data/products/use-product.query";
import { getserverAuth } from "@utils/api/actions";
import { Button,  Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { BiPlusMedical } from "react-icons/bi";
 
const query = {
  // where: { deleted: false },
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

const ProductsPage: React.FC = async () => {
  const ctx = getserverAuth();
  const data = await fetchProductData(query, ctx);

  return (
    <Box>
      <Button
        startIcon={<BiPlusMedical size={14} />}
        variant="contained"
        color="primary"
        sx={{ marginLeft: "auto", marginBottom:"20px", display: "flex" }}
      >
        <Typography variant="button" color="white">
          Add Product
        </Typography>
      </Button> 

      {Array.isArray(data) && data.length > 0 ? (
        <ProductTable data={data} />
      ) : (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" align="center" color="textSecondary">
            No product available
          </Typography>
        </Grid>
      )}
    </Box>
  );
};

export default ProductsPage;
