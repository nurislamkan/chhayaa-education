import React from "react";
import { getserverAuth } from "@/utils/api/actions";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchCompanyData } from "@/data/products/use-company.query";
import CreateCompany from "@/components/products/company/create-company";
import CompanyTable from "@/components/products/company/company-table";
 
const CompanyPage = async () => {
  const ctx = await getserverAuth();
  const data = await fetchCompanyData({ where: { deleted: false } }, ctx);

  return (
    <>
      <CreateCompany />
      <Divider sx={{ my: 2 }} />

      {Array.isArray(data) && data.length > 0 ? (
        <CompanyTable data={data} />
      ) : (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" align="center" color="textSecondary">
            No Company available
          </Typography>
        </Grid>
      )}
    </>
  );
};

export default CompanyPage;
