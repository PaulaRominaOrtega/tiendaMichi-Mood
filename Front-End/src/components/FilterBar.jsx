// src/components/FilterBar.jsx
import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import products from '../data/products';
import SearchIcon from '@mui/icons-material/Search'; 
import InputAdornment from '@mui/material/InputAdornment'; 

const FilterBar = () => {
  return (
    <div className="w-full flex justify-center items-center py-6 px-4">
      <div className="w-full max-w-md"> 
        <Autocomplete
          disablePortal
          options={products} 
          noOptionsText="No se encontraron productos"
          
          getOptionLabel={(option) => {
        
            if (typeof option === 'string') {
              return option;
            }
            return option.nombre;
          }}
          
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Buscar productos..."
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default FilterBar;