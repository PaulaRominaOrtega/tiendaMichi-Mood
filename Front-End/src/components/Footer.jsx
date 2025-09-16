import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Stack from '@mui/material/Stack';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 4, px: 2, mt: 5 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" component="p">
          MichiMood
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Contacto: michimood@gmail.com
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton color="inherit" href="https://instagram.com" target="_blank">
            <InstagramIcon />
          </IconButton>
          <IconButton color="inherit" href="https://facebook.com" target="_blank">
            <FacebookIcon />
          </IconButton>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Michi Mood - Todos los derechos reservados
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;