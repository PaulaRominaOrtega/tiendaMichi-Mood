import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search'; 
import InputAdornment from '@mui/material/InputAdornment'; 
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const BACKEND_BASE_URL = "http://localhost:3000";

const CUSTOM_LILA = '#C8A2C8';          
const MINT_PASTEL = '#A8E6CF';         

const FilterBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    const [filterOferta, setFilterOferta] = useState(queryParams.get('oferta') === 'true');
    const [filterPrecio, setFilterPrecio] = useState(queryParams.get('precio') || '');

    
    const fetchSearchOptions = async (input) => {
        if (!input || input.length < 2) {
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_BASE_URL}/api/productos/search?q=${input}&limit=10`);
            setOptions(res.data.data || []);
        } catch (error) {
            console.error("Error fetching search options:", error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSearchOptions(searchTerm);
        }, 500); 
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    
    const updateUrlParams = (newParams) => {
        const currentParams = new URLSearchParams(location.search);
        
        Object.keys(newParams).forEach(key => {
            if (newParams[key] === '' || newParams[key] === false || newParams[key] === 'todos') {
                currentParams.delete(key);
            } else {
                currentParams.set(key, newParams[key]);
            }
        });

        currentParams.set('page', 1);

        navigate(`?${currentParams.toString()}`);
    };
    
    const handleOfertaChange = (event) => {
        const isChecked = event.target.checked;
        setFilterOferta(isChecked);
        updateUrlParams({ oferta: isChecked ? 'true' : '' }); 
    };

    const handlePrecioChange = (event) => {
        const value = event.target.value;
        setFilterPrecio(value);
        updateUrlParams({ precio: value });
    };

    const handleProductSelect = (event, value) => {
        if (value && value.id) {
            navigate(`/producto/${value.id}`); 
        } else if (typeof value === 'string' && value.trim() !== '') {
             updateUrlParams({ q: value });
             setSearchTerm(value);
        }
    };

    const handleInputChange = (event, newInputValue, reason) => {
        if (reason === 'input') {
            setSearchTerm(newInputValue);
        } else if (reason === 'clear') {
            setSearchTerm('');
            updateUrlParams({ q: '' });
        }
    };


    return (
        <Box 
            sx={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: { xs: 2, md: 3 }, 
                py: 0,
                alignItems: 'center', 
                justifyContent: 'flex-end',
            }}
        >
            <FormControl 
                size="small" 
                sx={{ minWidth: 190, flexShrink: 0, width: { xs: '100%', md: 'auto' } }} 
                variant="outlined"
            >
                <InputLabel id="precio-select-label" sx={{ color: CUSTOM_LILA }}>Ordenar por Precio</InputLabel>
                <Select
                    labelId="precio-select-label"
                    value={filterPrecio}
                    onChange={handlePrecioChange}
                    label="Ordenar por Precio"
                    sx={{ 
                        '& fieldset': { borderColor: CUSTOM_LILA }, 
                        '&:hover fieldset': { borderColor: `${CUSTOM_LILA}D0 !important` },
                        
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: `${CUSTOM_LILA} !important`,
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: `${CUSTOM_LILA} !important` }, 
                        '& .MuiSvgIcon-root': { color: CUSTOM_LILA }
                    }}
                >
                    <MenuItem value="">Más Nuevos Primero</MenuItem>
                    <MenuItem value="low">Precio: Menor a Mayor</MenuItem>
                    <MenuItem value="high">Precio: Mayor a Menor</MenuItem>
                </Select>
            </FormControl>
            
            <Box 
                sx={{ 
                    height: 40, 
                    border: `1px solid ${CUSTOM_LILA}`, 
                    borderRadius: '4px', 
                    flexShrink: 0, 
                    width: { xs: '100%', md: 'auto' },
                    display: 'flex',
                    alignItems: 'center',
                    px: 1, 
                    position: 'relative',
                    mr: { md: 2 },
             
                    '&:hover': { borderColor: `${CUSTOM_LILA}D0` },
                    '&:focus-within': { 
                        border: `2px solid ${CUSTOM_LILA}`,
                        boxShadow: `0 0 0 1px ${CUSTOM_LILA}`,
                    }
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filterOferta}
                            onChange={handleOfertaChange}
                            name="oferta"
                            sx={{ 
                                color: MINT_PASTEL, 
                                '&.Mui-checked': { color: MINT_PASTEL },
                                p: 1, 
                            }}
                        />
                    }
                    label="Solo Ofertas"
                    sx={{ m:0,marginRight: 2 }} 
                />
            </Box>

            <Autocomplete
                sx={{ flexGrow: 1, width: { xs: '100%', md: 300 } }} 
                freeSolo 
                disablePortal
                options={options} 
                loading={loading}
                value={null}
                noOptionsText={searchTerm.length < 2 ? "Escribe al menos 2 letras..." : "No se encontraron productos"}
                
                getOptionLabel={(option) => {
                    return option.nombre || (typeof option === 'string' ? option : '');
                }}
                
                onChange={handleProductSelect} 
                onInputChange={handleInputChange} 
                inputValue={searchTerm}

                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Buscar productos..."
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: CUSTOM_LILA }}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& fieldset': { borderColor: CUSTOM_LILA },
                            '&:hover fieldset': { borderColor: `${CUSTOM_LILA}D0 !important` },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: `${CUSTOM_LILA} !important`,
                            },
                             '& .MuiInputLabel-root.Mui-focused': { color: `${CUSTOM_LILA} !important` }, 
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default FilterBar;