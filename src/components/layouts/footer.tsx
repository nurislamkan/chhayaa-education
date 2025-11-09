 import {
  Box,
  Container,
  IconButton,
  List,
  ListItem, 
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Facebook, Twitter, Instagram, Send } from "@mui/icons-material";
import Link from "next/link"; 


const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#EDF8FF", color: "#121212", py: 5, mt: 4 }}>
      <Container>
        <Grid container spacing={4}>
          {/* Site Logo & Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold">
             Custom CMS
            </Typography> 
              <List sx={{ listStyle: "none", padding: 0, mt: 2 }}>
                <ListItem><Link href={`/about/`}>About Us</Link></ListItem>
                <ListItem>  <Link href={`/blog/`}>Blog</Link></ListItem>
                <ListItem> <Link href={`/contact/`}>Contact</Link>  </ListItem>
                <ListItem> <Link href={`/terms-of-service`}>Terms of Service</Link></ListItem>
              </List>
          </Grid>

          {/* Social Links */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold">
              Follow Us
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Newsletter Signup */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold">
              Newsletter
            </Typography>
            <Box display="flex" mt={1}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Your Email"
                sx={{ bgcolor: "white", borderRadius: 1, flexGrow: 1 }}
              />
              <IconButton sx={{ bgcolor: "blue", color: "white", ml: 1 }}>
                <Send />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box textAlign="center" mt={3} sx={{ borderTop: "1px solid #cbe2f1", pt: 2 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Drop CMS. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
