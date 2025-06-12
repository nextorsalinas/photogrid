import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const Home = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  // Estado inicial basado en localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' ? true : false;
  });

  // Aplicar modo oscuro al cargar y al cambiar
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert('Solo puedes seleccionar hasta 4 imágenes.');
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    navigate('/preview', { state: { images: imageUrls } });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-500`}>
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-end">
        <FormControlLabel
          control={
            <Switch 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          }
          label="Modo oscuro"
          className="text-gray-700 dark:text-gray-300"
        />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-8">
        <div className="w-full max-w-[320px] md:max-w-md">
          <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight transition-colors duration-500`}>
            PhotoGrid Pro
          </h1>
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-800'} mt-4 transition-colors duration-500`}>
            Seleccione 4 imágenes
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current.click()}
          className="group mt-8 md:mt-12 w-full max-w-[250px] md:max-w-none md:w-auto 
            relative inline-flex items-center justify-center gap-3
            px-8 py-4 
            bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700
            text-gray-900 font-medium
            rounded-full overflow-hidden
            transition-all duration-300 ease-out
            shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:shadow-[0_20px_50px_rgba(8,_112,_184,_0.5)]
            hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.9)]
            hover:scale-[1.02] transform-gpu
            before:absolute before:inset-0
            before:bg-gradient-to-r before:from-blue-600 before:to-blue-700
            dark:before:from-blue-700 dark:before:to-blue-800
            before:opacity-0 before:transition-opacity
            hover:before:opacity-100"
        >
          <svg 
            className="w-5 h-5 md:w-6 md:h-6 text-gray-900 relative z-10 
            transition-transform duration-300 group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            width="50"    // Agregamos width explícito
            height="50"   // Agregamos height explícito
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1}  // Reducimos el grosor del trazo
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="relative z-10 text-gray-900 font-semibold 
            transition-transform duration-300 group-hover:scale-110">
            Seleccionar Imágenes
          </span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-4 font-medium transition-colors duration-500`}>
          Powered by nestech
        </p>
      </main>

      {/* Footer */}
      <footer className={`w-full py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} mt-auto transition-colors duration-500`}>
        <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          © 2025 nestech. Todos los derechos reservados.
        </p>
        <p className={`text-xs text-center mt-1 ${darkMode ? 'text-blue-500' : 'text-blue-400'}`}>
          © Desarrollado por Nestor Alonso Salinas.
        </p>
      </footer>
    </div>
  );
};

export default Home;