import React, { useState, useRef } from 'react';
import ImagePreview from './ImagePreview';
import Loader from './Loader';
import './ImageUploader.css'; // Archivo CSS para estilos personalizados
import dragAndDropIcon from './drag-and-drop.svg';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    const imageUrl = selectedImage; // Suponiendo que `selectedImage` contiene la URL de la imagen
  
    const tempInput = document.createElement('input');
    tempInput.value = imageUrl;
    document.body.appendChild(tempInput);
  
    tempInput.select();
    document.execCommand('copy');
  
    document.body.removeChild(tempInput);
  };
  

  return (
    <div className="container">
        <div className="card">
      <h1 className='title' >Image Uploader</h1>
      <img src={dragAndDropIcon} alt="Drag and Drop" className="drag-and-drop-icon" />
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
                <button className="custom-button" onClick={handleCopyClick}>Copy URL</button>
              </>
            ) : (
              <>
                <p className='text' >Selecciona una imagen de tu carpeta</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden-input"
                />
                <button className="custom-button" onClick={() => fileInputRef.current.click()}>
                  Seleccionar Archivo
                </button>
              </>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default ImageUploader;
