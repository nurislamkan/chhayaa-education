"use client";
import { Typography, Paper, Avatar } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SlickSlider() {
  const testimonials = [
    {
      name: "John Doe",
      review: "This site is amazing! I love it.",
      image: "/users/john.jpg",
    },
    {
      name: "Jane Smith",
      review: "A great experience using this platform.",
      image: "/users/john.jpg",
    },
    {
      name: "Mike Johnson",
      review: "Highly recommend it to everyone!",
      image: "/users/john.jpg",
    },
  ];

  // Slick Carousel Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <Slider {...sliderSettings}>
        {testimonials.map((testimonial, index) => (
          <Paper
            key={index}
            sx={{ p: 4, textAlign: "center", mx: "auto", maxWidth: 500 }}
          >
            <Avatar
              src={testimonial.image}
              sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
            />
            <Typography variant="h6" fontWeight="bold">
              {testimonial.name}
            </Typography>
            <Typography>{testimonial.review}</Typography>
          </Paper>
        ))}
      </Slider>
    </>
  );
}
