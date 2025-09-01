import { CircularProgress, Box, Typography, Backdrop } from "@mui/material";

const LoadingSpinner = ({
  variant = "default",
  message = "Chargement...",
  size = 40,
  fullscreen = false,
}) => {
  const commonProgressProps = {
    sx: { color: "#ff6b00" },
    size: size,
  };

  // Loader plein écran avec backdrop
  if (fullscreen) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        open={true}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress {...commonProgressProps} />
          <Typography variant="body1" color="white">
            {message}
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  // Loader compact pour petites zones
  if (variant === "small") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={1}
      >
        <CircularProgress {...commonProgressProps} size={24} />
      </Box>
    );
  }

  // Loader inline avec texte
  if (variant === "inline") {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        justifyContent="center"
        padding={2}
      >
        <CircularProgress {...commonProgressProps} size={24} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  // Loader overlay pour zones spécifiques
  if (variant === "overlay") {
    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        backgroundColor="rgba(255, 255, 255, 0.8)"
        zIndex={1}
        gap={2}
      >
        <CircularProgress {...commonProgressProps} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  // Loader par défaut
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress {...commonProgressProps} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
