"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete"; // Delete icon
import Image from "next/image";

export default function AddToCartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    index: number,
    action: "increment" | "decrement"
  ) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[index];

    if (action === "increment") {
      item.quantity = Math.max(1, item.quantity + 1);
    } else if (action === "decrement" && item.quantity > 1) {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    updatedCart[index] = item;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return total + price * quantity;
    }, 0);
  };

  const calculateShipping = () => 10;
  const calculateTax = (subtotal: number) => subtotal * 0.1;
  const calculateVAT = (subtotal: number) => subtotal * 0.2;
  const calculateTotal = (subtotal: number, shipping: number, tax: number, vat: number) =>
    subtotal + shipping + tax + vat;

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax(subtotal);
  const vat = calculateVAT(subtotal);
  const total = calculateTotal(subtotal, shipping, tax, vat);

  return (
    <Box p={3} maxWidth="1000px" margin="auto">
       <Typography variant="h4" gutterBottom mb={8} >
        Shopping Cart
      </Typography>

      {cartItems.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Grid container spacing={2} alignItems="center" position="relative">
                        {/* Product Image (Reduced Size) */}
                        <Grid >
                          <Image
                            src={item.imageUrl || "/default-image.jpg"}
                            alt={item.name}
                            style={{
                              width: 70,  // Reduced image size
                              height: 70, // Reduced image size
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </Grid>

                        {/* Product Name with Delete Icon */}
                        <Grid position="relative">
                          <Typography variant="body1">{item.name}</Typography>
                          <IconButton
                            onClick={() => handleRemoveItem(index)}
                            color="error"
                            sx={{
                              position: "absolute",
                              top: "4px",
                              right: "-40px",
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>

                    <TableCell align="center">
                      ${Number(item.price).toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleQuantityChange(index, "decrement")}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      {item.quantity}
                      <IconButton
                        onClick={() => handleQuantityChange(index, "increment")}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>

                    <TableCell align="center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Summary Section */}
            <Box mt={3} pl={4} pr={4} pb={5}>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6">Subtotal:</Typography>
                <Typography variant="h6">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">${shipping.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Tax (10%):</Typography>
                <Typography variant="body1">${tax.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">VAT (20%):</Typography>
                <Typography variant="body1">${vat.toFixed(2)}</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                mt={2}
                borderTop={"1px solid #ccc"}
                pt={2}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
            </Box>
          </TableContainer>
        </>
      ) : (
        <Typography textAlign="center" color="text.secondary">
          No items in the cart
        </Typography>
      )}

      {/* Buttons at the Bottom */}
      <Box
        mt={3}
        textAlign="center"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button variant="outlined" color="primary" size="large" href="/shop">
          Back to Shop
        </Button>
        {cartItems.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginBottom: 2 }}
          >
            Proceed to Checkout
          </Button>
        )}
      </Box>
    </Box>
  );
}
