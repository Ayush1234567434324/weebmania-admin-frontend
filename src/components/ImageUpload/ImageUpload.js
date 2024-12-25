import React from 'react';
import ImagePreview from './ImagePreview';
import './ImageUpload.css';

const ImageUpload = ({ handleImageChange, images, labels }) => {
  return (
    <div className="image-upload-section">
      {labels.map(({ title, key }, index) => (
        <div key={index}>
          <h2>{title}</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, key)}
            className="image-upload-input"
          />
          {images[key] && <ImagePreview image={images[key]} imageCategory={key} />}
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;
