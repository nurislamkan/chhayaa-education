"use client"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import LogoSmall from "@public/logo.png";
import Image from "next/image";
import { styled } from "@mui/material/styles";

const CustomToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default function Header() {
  const router = useRouter();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#FFF",color:"#000" }}>
      <CustomToolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
         <Image src={LogoSmall} alt="Logo"  height={50} priority />
        </Typography>

        {/* Navigation Menu */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button color="inherit" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push("/shop")}>
            Shop
          </Button>
          <Button color="inherit" onClick={() => router.push("/about")}>
            About
          </Button>
          <Button color="inherit" onClick={() => router.push("/blog")}>
            Blog
          </Button>
          <Button color="inherit" onClick={() => router.push("/contact")}>
            Contact
          </Button>
        </Box>

        {/* Login & Signup Buttons */}
        <Box>
          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => router.push("/signup")}>
            Signup
          </Button>
        </Box>
      </CustomToolbar>
    </AppBar>
  );
}
