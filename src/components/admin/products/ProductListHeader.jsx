import {
  TableHead,
  TableRow,
  TableCell
} from '@mui/material';

export default function ProductListHeader() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Image</TableCell>
        <TableCell>Nom</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Categorie</TableCell>
        <TableCell align="right">Prix par jour</TableCell>
        <TableCell align="right">Stock</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}