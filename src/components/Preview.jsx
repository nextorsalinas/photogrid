// src/components/Preview.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';
import { ArrowLeft, Download } from 'lucide-react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Creamos componentes estilizados
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  padding: '12px 24px',
  borderRadius: '16px',
  '&:hover': {
    background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.dark})`,
    transform: 'scale(1.05)',
  }
}));

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [images] = useState((location.state?.images || []).slice(0, 4));
  const [isGenerating, setIsGenerating] = useState(false);

  // Modifica las opciones de usePDF
  const { toPDF, targetRef } = usePDF({
    filename: 'photogrid.pdf',
    options: {
      format: 'letter',
      orientation: 'portrait',
      unit: 'mm',
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        onclone: (document) => {
          // Forzamos las dimensiones del contenedor al clonar
          const container = document.querySelector('.pdf-preview');
          if (container) {
            container.style.width = '215.9mm';
            container.style.height = '279.4mm';
            container.style.maxWidth = 'none';
            container.style.padding = '10mm';
            container.style.boxSizing = 'border-box';
            
            // Ajustamos el grid
            const grid = container.querySelector('.image-grid');
            if (grid) {
              grid.style.height = 'calc(100% - 20mm)'; // Ajustamos por el padding
              grid.style.width = 'calc(100% - 20mm)'; // Ajustamos por el padding
              grid.style.display = 'grid';
              grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
              grid.style.gridTemplateRows = 'repeat(2, 1fr)';
              grid.style.gap = '4mm';
            }

            // Ajustamos los contenedores de imágenes
            const imageContainers = container.querySelectorAll('.image-container');
            imageContainers.forEach(imgContainer => {
              imgContainer.style.position = 'relative';
              imgContainer.style.width = '100%';
              imgContainer.style.height = '100%';
            });

            // Ajustamos las imágenes
            const images = container.querySelectorAll('.grid-image');
            images.forEach(img => {
              img.style.position = 'absolute';
              img.style.top = '0';
              img.style.left = '0';
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';
            });
          }

          // Esperamos a que las imágenes se carguen
          return new Promise((resolve) => {
            const images = document.querySelectorAll('.grid-image');
            Promise.all(
              Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(imgResolve => {
                  img.onload = imgResolve;
                  img.onerror = imgResolve;
                });
              })
            ).then(resolve);
          });
        }
      },
      jsPDF: {
        format: 'letter',
        unit: 'mm'
      }
    }
  });

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      await toPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StyledAppBar position="fixed">
        <Toolbar className="flex justify-between items-center px-4 py-2 md:px-6 md:py-3">
          <IconButton
            edge="start"
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700"
            size="large"
          >
            <ArrowLeft className="w-8 h-8 md:w-10 md:h-10" />
          </IconButton>

          <Typography 
            variant="h55" 
            component="h2"
            className="font-poppins font-bold text-gray-800"
          >
            Vista Previa PDF
          </Typography>

          <StyledButton
            onClick={handleDownload}
            disabled={isGenerating}
            variant="contained"
            startIcon={
              isGenerating ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-6 w-6 md:h-8 md:w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <Download className="w-6 h-6 md:w-8 md:h-8" />
              )
            }
            className="min-w-[160px] md:min-w-[180px]"
          >
            {isGenerating ? 'Generando...' : 'Descargar'}
          </StyledButton>
        </Toolbar>
      </StyledAppBar>

      {/* Main content */}
      <main className="flex-grow pt-16 md:pt-20">
        <div className="preview-container">
          <div 
            ref={targetRef}
            className="bg-white shadow-lg pdf-preview"
          >
            <div className="image-grid">
              {images.map((src, index) => (
                <div key={src} className="image-container">
                  <img
                    src={src}
                    alt={`Imagen ${index + 1}`}
                    className="grid-image"
                    crossOrigin="anonymous"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Preview;