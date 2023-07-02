import React, { useState } from 'react';
import ImagePreview from './ImagePreview';
import Loader from './Loader';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    const image = event.dataTransfer.files[0];
    uploadImage(image);
  };

  const handleFileInputChange = (event) => {
    const image = event.target.files[0];
    uploadImage(image);
  };

  const uploadImage = (image) => {
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append('image', image);
  
    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setSelectedImage(image);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setIsLoading(false);
      });
  };
  

  const handleCopyClick = () => {
    const imageUrl = selectedImage; // 
  
    // Creo un elemento de texto temporal
    const tempInput = document.createElement('input');
    tempInput.value = imageUrl;
    document.body.appendChild(tempInput);
  
    // Selecciono y copiar el contenido del elemento de texto
    tempInput.select();
    document.execCommand('copy');
  
    // Elimino el elemento de texto temporal
    document.body.removeChild(tempInput);
  };
  

  return (
    <div>
      <h1>Image Uploader</h1>
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {selectedImage ? (
              <>
                <ImagePreview image={selectedImage} />
                <button onClick={handleCopyClick}>Copy URL</button>
              </>
            ) : (
              <>
                <p>Drag and drop an image or select from your folder</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
