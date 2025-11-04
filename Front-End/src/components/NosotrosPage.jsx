import React from 'react';
import { Box, Typography, Container, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fdf3f8',
  padding: theme.spacing(6, 0),
  minHeight: '80vh',
}));

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  textAlign: 'center',
  position: 'relative',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#8b4513',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
  },
}));

const PastelText = styled(Typography)(({ theme }) => ({
  color: '#a59e9c',
  lineHeight: 1.8,
  maxWidth: 800,
  margin: '0 auto',
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 192, 203, 0.3)',
    zIndex: -1,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${'#ffb6c1'}`,
  boxShadow: `0px 8px 25px rgba(255, 192, 203, 0.5)`,
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#e0f2f7',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0px 5px 15px rgba(173, 216, 230, 0.4)`,
  textAlign: 'left',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const CatIcon = styled('span')(({ theme }) => ({
  fontSize: '2rem',
  marginRight: theme.spacing(1),
  verticalAlign: 'middle',
  color: '#dda0dd',
}));


const NosotrosPage = () => {
  return (
    <RootContainer>
      <Container maxWidth="md">

        <StyledSection sx={{ mt: 4, mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}> 
            <img
              src="/images/Nosotros.jpg"
              alt="MichiMood Hero"
              style={{
                maxWidth: '50%', 
                height: 'auto', 
                borderRadius: '15px',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.1)', 
              }}
            />
          </Box>
          <SectionTitle variant="h3" component="h1">
            <CatIcon>🐾</CatIcon> La Historia Detrás de MichiMood <CatIcon>✨</CatIcon>
          </SectionTitle>
          <PastelText variant="h6">
            Descubre la pasión, el diseño y el amor por los gatos que inspiran cada producto que ofrecemos.
          </PastelText>
        </StyledSection>

        <StyledSection>
          <AvatarContainer>
            <StyledAvatar
                alt="Gabriela Martínez"
                src="/images/foto.jpg"
            />
          </AvatarContainer>
          <SectionTitle variant="h4">
            Conoce a Gabriela Martínez: Fundadora y Mente Maestra
          </SectionTitle>
          <PastelText variant="body1" sx={{mb: 4}}>
            MichiMood nació de la visión y el amor incondicional de **Gabriela Martínez**, una emprendedora de 32 años con una profunda pasión por los gatos. Con una sólida formación en marketing digital y como orgullosa dueña de tres adorables felinos, Gabriela experimentó de primera mano la dificultad de encontrar productos que combinaran calidad, funcionalidad y un diseño que realmente capturara la esencia y el espíritu de nuestros compañeros gatunos.
          </PastelText>
          <PastelText variant="body1">
            Cansada de la búsqueda infructuosa y los altos costos de los productos importados, decidió tomar las riendas y fundar MichiMood. Su objetivo: ofrecer a la comunidad amante de los gatos una alternativa local, con productos cuidadosamente seleccionados y diseñados para deleitar tanto a las mascotas como a sus dueños.
          </PastelText>
        </StyledSection>

        <StyledSection>
          <SectionTitle variant="h4">
            Nuestra Filosofía: Amor, Calidad y Diseño <CatIcon>❤️</CatIcon>
          </SectionTitle>
          <PastelText variant="body1" sx={{mb: 5}}>
            MichiMood es más que una tienda; es una comunidad donde el amor por los gatos es el motor de todo lo que hacemos. Nuestra plataforma no solo está pensada para la compra, sino para ser un reflejo de los valores que nos definen.
          </PastelText>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <HighlightBox>
                <Typography variant="h6" sx={{ color: '#6a5acd', fontWeight: 600, mb: 1 }}>
                  <CatIcon>😻</CatIcon> Amor por los Gatos
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', lineHeight: 1.6 }}>
                  Cada producto es elegido pensando en los amantes de todo el mundo gatuno. Queremos que los productos expresen el mismo amor que sentimos por ellos.
                </Typography>
              </HighlightBox>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <HighlightBox>
                <Typography variant="h6" sx={{ color: '#6a5acd', fontWeight: 600, mb: 1 }}>
                  <CatIcon>✨</CatIcon> Calidad y Confianza
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', lineHeight: 1.6 }}>
                  Nos comprometemos con la excelencia. Seleccionamos materiales duraderos y seguros para asegurar que cada artículo cumpla con los más altos estándares de calidad.
                </Typography>
              </HighlightBox>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <HighlightBox>
                <Typography variant="h6" sx={{ color: '#6a5acd', fontWeight: 600, mb: 1 }}>
                  <CatIcon>🎨</CatIcon> Diseño Divertido
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', lineHeight: 1.6 }}>
                  La personalidad juguetona y curiosa de los gatos inspira nuestros diseños. Buscamos que cada compra sea una experiencia divertida y emotiva, con un toque de estilo único.
                </Typography>
              </HighlightBox>
            </Grid>
          </Grid>
        </StyledSection>
      </Container>
    </RootContainer>
  );
};

export default NosotrosPage;