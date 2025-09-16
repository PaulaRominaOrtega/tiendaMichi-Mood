import React from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Banner = () => {
  const images = [
    '/images/carrusel1.jpg',
    '/images/carrusel2.jpg',
    '/images/carrusel3.jpg',
    '/images/carrusel4.jpg',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <Box sx={{ pt:1,width: '80%', maxWidth: '80%', margin: '0 auto', mt: 1, mb: 10, }}>
      <Slider {...settings}>
        {images.map((src, index) => (
          <Box key={index}>
            <Box
              component="img"
              src={src}
              alt={`img-${index}`}
              sx={{
                width: '100%',
                height: { xs: '250px', sm: '400px', md: '600px', lg: '700px' },
                objectFit: 'contain',
                borderRadius: 1,
                display: 'block'
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Banner;