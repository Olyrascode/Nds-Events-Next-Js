import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formatCurrency } from '../../../../utils/formatters';

export default function ProductsTable({ items, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Categorie</TableCell>
            <TableCell align="right">Price/day</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Chip
                  label={item.type === 'pack' ? 'Package' : 'Product'}
                  color={item.type === 'pack' ? 'secondary' : 'primary'}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell align="right">{formatCurrency(item.price)}</TableCell>
              <TableCell align="right">{item.stock || 'N/A'}</TableCell>
              <TableCell align="right">
                <Box>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => console.log('Edit', item.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(item.id, item.type)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}