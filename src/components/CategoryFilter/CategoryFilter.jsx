import React from 'react';
import { Box, Chip } from '@mui/material';
import './_CategoryFilter.scss';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <Box className="category-filter">
      <Chip
        label="Tous"
        onClick={() => onSelectCategory(null)}
        color={selectedCategory === null ? 'primary' : 'default'}
        variant={selectedCategory === null ? 'filled' : 'outlined'}
        className="category-filter__chip"
      />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          onClick={() => onSelectCategory(category)}
          color={selectedCategory === category ? 'primary' : 'default'}
          variant={selectedCategory === category ? 'filled' : 'outlined'}
          className="category-filter__chip"
        />
      ))}
    </Box>
  );
}