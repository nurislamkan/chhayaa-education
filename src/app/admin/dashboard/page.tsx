"use client";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReviewsIcon from "@mui/icons-material/RateReview"; 
import DescriptionIcon from "@mui/icons-material/Description";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LabelIcon from "@mui/icons-material/Label"; 
import { useDashboardStats } from "@data/options/use-options.query"; 

// function BedCamePageContent({ pathname }: { pathname: string }) {
//   return (
//     <Box
//       sx={{
//         py: 4,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//       }}
//     >
//       <Typography>Dashboard content for {pathname}</Typography>
//     </Box>
//   );
// }

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardStats();

  // const router = useDemoRouter('/dashboard');

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching data</Typography>; 
console.log('data',data);

  return (
    <Box p={3}>
      {/* <BedCamePageContent pathname={router.pathname} /> */}
      {/* Dashboard Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
         Welcome to our Chhayaa Education
        </Typography>
      </Box>

      {/* User Group */}
      <Box mb={3}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          👥 Users details
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              label: "Total User Roles",
              value: data?.groupTotal.count,
              icon: <GroupIcon />,
              bgColor: "#FF9800",
            },
            {
              label: "Total Users",
              value: data?.usersTotal.count,
              icon: <PeopleIcon />,
              bgColor: "#4CAF50",
            },
            {
              label: "Total Vendors",
              value: data?.vendorTotal.count,
              icon: <StoreIcon />,
              bgColor: "#3F51B5",
            },
            {
              label: "Total Customers",
              value: data?.accountTotal.count,
              icon: <PeopleIcon />,
              bgColor: "#673AB7",
            },
            {
              label: "Total Admin",
              value: data?.adminTotal.count,
              icon: <PeopleIcon />,
              bgColor: "#9E9E9E",
            },
          ].map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </Grid>
      </Box>

      {/* product Group */}
      <Box mb={3}>
        <Typography variant="h5" sx={{ mb: 2, mt: 8, fontWeight: "bold" }}>
          🛍️ Products details
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              label: "Total product",
              value: data?.totalProduct,
              icon: <ShoppingCartIcon />,
              bgColor: "#FF9800",
            },
            {
              label: "Total Categories",
              value: data?.totalCategory,
              icon: <CategoryIcon />,
              bgColor: "#4CAF50",
            },
             
            {
              label: "Total Reviews",
              value: data?.reviews,
              icon: <ReviewsIcon />,
              bgColor: "#673AB7",
            },
             
          ].map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </Grid>
        {/* Sales Graph Placeholder */}
        {/* <Card
          sx={{ mt: 2, p: 2, textAlign: "center", backgroundColor: "#e1ecff" }}
        >
          <Typography variant="h6">📊 Sales Graph (Yearly)</Typography> 
         
        </Card> */}
      </Box>

      {/* Content Group */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, mt: 8, fontWeight: "bold" }}>
          📝 Content details
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              label: "Total Pages",
              value: data?.pages,
              icon: <DescriptionIcon />,
              bgColor: "#FF9800",
            },
            {
              label: "Total Posts",
              value: data?.posts,
              icon: <PostAddIcon />,
              bgColor: "#4CAF50",
            },
            {
              label: "Total Categories",
              value: data?.postCategories,
              icon: <CategoryIcon />,
              bgColor: "#3F51B5",
            },
            {
              label: "Total Tags",
              value: data?.tags,
              icon: <LabelIcon />,
              bgColor: "#673AB7",
            },
          ].map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// Reusable Card Component
interface StatCardProps {
  label: string;
  value: number | null;
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard = ({ label, value, icon, bgColor }: StatCardProps) => (
  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        height: 80,
        p: 2,
        borderRadius: "10px",
        boxShadow: 2,
        backgroundColor: "#e1ecff",
      }}
    >
      {/* Icon Box (Left Side) */}
      <Box
        sx={{
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          backgroundColor: bgColor,
          color: "#fff",
          mr: 2,
        }}
      >
        {icon}
      </Box>

      {/* Text Section */}
      <CardContent sx={{ flex: 1 }} style={{ padding: "0px" }}>
        <Typography variant="body1" fontWeight="bold" color="textSecondary" fontSize={12}>
          {label}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value ?? 0}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);
 