import { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ImageUpload.scss";

export default function ImageUpload({
  onChange,
  currentImage,
  label = "Image principale",
  onDelete,
  isCarousel = false,
  index = 0,
}) {
  const [preview, setPreview] = useState(currentImage);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    onChange(null);
    if (onDelete) onDelete();
  };

  return (
    <Box
      className={`image-upload ${isCarousel ? "image-upload--carousel" : ""}`}
    >
      <Box className="image-upload__container">
        {!preview && (
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            className="image-upload__button"
          >
            {isCarousel
              ? `Ajouter une image ${index + 1}`
              : "Ajouter une image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        )}

        {preview && (
          <Box className="image-upload__preview-container">
            <Typography variant="subtitle2" gutterBottom>
              {isCarousel ? `Image ${index + 1}` : label}
            </Typography>
            <Box className="image-upload__preview-wrapper">
              <img
                src={preview}
                alt="Preview"
                className="image-upload__preview"
              />
              <IconButton
                className="image-upload__delete-button"
                onClick={handleDelete}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
