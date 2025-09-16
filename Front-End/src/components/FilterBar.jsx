import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import products from '../data/products';

const categories = ['Nuevos ingresos', 'Más vendidos', '30%OFF'];

const FilterBar = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-6 bg-gray-100 px-4">
      
      
      <div className="flex flex-wrap gap-4 justify-center md:justify-start w-full md:w-auto">
        {categories.map((categoria, index) => (
          <Button
            key={index}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            {categoria}
          </Button>
        ))}
      </div>

      <div className="w-full md:w-auto">
        <Autocomplete
          disablePortal
          options={products}
          renderInput={(params) => (
            <TextField {...params} label="Buscar producto" />
          )}
        />
      </div>
      
    </div>
  );
};

export default FilterBar;