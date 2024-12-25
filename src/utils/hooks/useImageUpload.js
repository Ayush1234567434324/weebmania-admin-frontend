import { useState } from 'react';
//for two image upload 
const useImageUpload = () => {
  const [images, setImages] = useState({
    image1 : null,
    image2: null,
  });

  const handleImageChange = (event, imageType) => {
    const files = event.target.files;
    const imageArray = Array.from(files).map((file) => ({
      file,
      type: imageType,
    }));

    setImages((prevImages) => {
      const newImages = { ...prevImages };
      if (imageType === 'pages') {
        newImages[imageType] = [...newImages[imageType], ...imageArray];
      } else {
        newImages[imageType] = imageArray[0];
      }
      return newImages;
    });
  };

  return { images, handleImageChange };
};

export default useImageUpload;
