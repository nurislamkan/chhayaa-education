import { Box, Typography, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import FeaturePost from "@components/post/featuredPost";
import SlickSlider from "@/components/slickSlider";

export default function HomePage() {
  return (
    <Box>
      <Box
        sx={{
          height: "500px",
          background: "url('/banner.jpg') center/cover no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          padding: "0 50px",
          color: "white",
          textAlign: "left",
        }}
      >
        <Container>
          <Typography
            variant="h2"
            fontWeight="bold"
            color="#000"
            align="left"
            fontSize={45}
          >
            Next.js & LoopBack Based
            <br /> Premium Script for CUSTOM CMS
          </Typography>
        </Container>
      </Box>

      {/* Welcome Section */}
      <Container sx={{ my: 5, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold">
          Welcome to Custom CMS!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We are dedicated to providing you with the best service. Explore our
          features and enjoy. Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry&apos;s
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book
        </Typography>
      </Container>

      {/* Feature List */}
      <Container sx={{ my: 5 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
          Features
        </Typography>
        <Grid container spacing={3}>
          {["Feature One", "Feature Two", "Feature Three"].map(
            (feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper sx={{ p: 3, textAlign: "center" }} elevation={3}>
                  <Typography variant="h6" fontWeight="bold">
                    {feature}
                  </Typography>
                  <Typography>Some details about this feature.</Typography>
                </Paper>
              </Grid>
            )
          )}
        </Grid>
      </Container>

      {/* Testimonial Carousel */}
      <Container sx={{ my: 5 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
          What Our Users Say
        </Typography>
        <SlickSlider />
      </Container>
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
          Browse Recent Post
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          Interactivel product distinctive paradigms whereas one-to-one
          intellectual capital. resource sucking services.
        </Typography>
        <FeaturePost limit={3} />
      </Container>
    </Box>
  );
}
