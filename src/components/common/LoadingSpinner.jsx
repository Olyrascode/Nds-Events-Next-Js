import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <CircularProgress sx={{ color: '#ff6b00' }} />
    </Box>
  );
}