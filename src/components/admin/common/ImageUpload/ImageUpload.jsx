import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './ImageUpload.scss';

export default function ImageUpload({ onChange, currentImage = null }) {
  const [preview, setPreview] = useState(currentImage);

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

  return (
    <Box className="image-upload">
      <Box className="image-upload__container">
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          className="image-upload__button"
        >
          Ajoutez une image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {preview && (
          <Box className="image-upload__preview-container">
            <Typography variant="subtitle2" gutterBottom>
              Prévualisation:
            </Typography>
            <img 
              src={preview}
              alt="Preview"
              className="image-upload__preview"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}