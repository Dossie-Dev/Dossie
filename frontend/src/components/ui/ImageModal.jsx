import React from 'react';

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    // Check if the click is on the background (not the image)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" 
      onClick={handleBackgroundClick}
    >
      <div className="relative max-w-3xl max-h-3/4 overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">
          &times;
        </button>
        <img src={imageSrc} alt="Larger view" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default ImageModal;