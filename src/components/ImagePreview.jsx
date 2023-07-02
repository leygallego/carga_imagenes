import React from 'react';

const ImagePreview = ({ image }) => {
  const imageUrl = URL.createObjectURL(image);

  return <img src={imageUrl} alt="Preview" />;
};

export default ImagePreview;
