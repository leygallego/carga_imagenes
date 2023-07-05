import React, { useState, useRef } from 'react';
import ImagePreview from './ImagePreview';
import Loader from './Loader';
import './ImageUploader.css'; // Archivo CSS para estilos personalizados
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import dragAndDropIcon from './drag-and-drop.svg';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
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
        setIsImageLoaded(true);
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

  const handleResetClick = () => {
    setSelectedImage(null);
    setIsLoading(false);
    setIsImageLoaded(false);
  };
  


  return (
    <div className="container">
      <div className="card">
        <h1 className='title'>Carga tu imagen</h1>
        <h2>Archivo debe ser jpg, png...</h2>
        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          {isLoading ? (
            <Loader />
            ) : (
                <>
                  {isImageLoaded ? (
                    <div className="card">
                      <div className="image-container">
                        <ImagePreview image={selectedImage} />
                      </div>
                      <FontAwesomeIcon icon={faCheck} className="check-icon" />
                      <p>Foto cargada correctamente</p>
                      <button className="custom-button" onClick={handleCopyClick}>Copy URL</button>
                      <button className="custom-button" onClick={handleResetClick}>Reset</button>
                    </div>
                  ) : (
                <>
                  <p className='text'>Arrastra y suelta una imagen de tu carpeta</p>
                  <img src={dragAndDropIcon} alt="Drag and Drop" className="drag-and-drop-icon" />
                  <p className='text'>O también puedes:</p>
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
