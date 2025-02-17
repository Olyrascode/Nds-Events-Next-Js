import {
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductListItem({ item, onEdit, onDelete }) {
  return (
    <TableRow>
      <TableCell>
        {item.imageUrl && (
          <Avatar
            src={item.imageUrl}
            alt={item.title}
            variant="rounded"
            sx={{ width: 50, height: 50 }}
          />
        )}
      </TableCell>
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
      <TableCell align="right">
        {formatCurrency(item.price)}
        {item.type === 'pack' && (
          <Typography variant="caption" color="success.main" display="block">
            {item.discountPercentage}% Réduction
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">{item.stock || 'N/A'}</TableCell>
      <TableCell align="right">
        <IconButton
          color="primary"
          onClick={() => onEdit(item)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => onDelete(item)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}