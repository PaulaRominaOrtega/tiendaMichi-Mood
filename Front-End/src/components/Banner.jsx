import React from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Banner = () => {
  const images = [
    '/images/carrusel1.png',
    '/images/carrusel2.png',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,

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
    <Box sx={{ pt: 0, width: '100%', margin: 0, mt: 0, mb: 0 }}> 

    {/* carrusel */}
      <Slider {...settings}>
        {images.map((src, index) => (
          <Box key={index}>
            <Box
              component="img"
              src={src}
              alt={`img-${index}`}
              sx={{
                width: '100%',
                height: { xs: '150px', sm: '220px', md: '300px', lg: '350px' }, 
                objectFit: 'contain', 
                borderRadius: 0, 
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