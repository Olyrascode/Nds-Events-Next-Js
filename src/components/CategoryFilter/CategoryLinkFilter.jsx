// app/components/CategoryLinkFilter.jsx
import React from 'react';
import Link from 'next/link';
import { Box, Chip } from '@mui/material';
import './_CategoryFilter.scss';

export default function CategoryLinkFilter({ categories, selectedCategory, navCategory }) {
  return (
    <Box className="category-filter">
      {/* "Tous" renvoie à la page principale de la navCategory */}
      <Link href={`/${navCategory}`} passHref>
        <Chip
          label="Tous"
          clickable
          color={selectedCategory === null ? 'primary' : 'default'}
          variant={selectedCategory === null ? 'filled' : 'outlined'}
          className="category-filter__chip"
        />
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/${navCategory}/${encodeURIComponent(category)}`}
          passHref
        >
          <Chip
            label={category}
            clickable
            color={selectedCategory === category ? 'primary' : 'default'}
            variant={selectedCategory === category ? 'filled' : 'outlined'}
            className="category-filter__chip"
          />
        </Link>
      ))}
    </Box>
  );
}
