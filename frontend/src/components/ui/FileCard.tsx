"use client"; // Include this if using Next.js with React 18 or above for client-side components
import { useState } from "react";
import ImageModal from "./ImageModal";

const FileCard = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check file type
  const isImage = file.type === "image";
  const isPDF = file.type === "pdf";

  // Handle card click
  const handleCardClick = () => {
    if (isPDF) {
      window.open(file.src, "_blank");
    } else if (isImage) {
      setIsModalOpen(true);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="card hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="card-body">
          {isImage ? (
            <img
              alt={file.name}
              src={file.src}
              className="h-36 w-full object-cover"
            />
          ) : isPDF ? (
            <iframe
              src={file.src}
              className="h-36 w-full"
              title={`PDF: ${file.name}`}
            />
          ) : (
            <div className="h-36 w-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-800 font-semibold">Unsupported File Type</p>
            </div>
          )}
          <p className="text-gray-800 font-semibold hover:text-primary">
            {file.name}
          </p>
          <p className="text-[#204780] text-sm font-semibold">
            {file.fileCount} MB
          </p>
        </div>
      </div>
      {isModalOpen && isImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          imageSrc={file.src}
        />
      )}
    </>
  );
};

export default FileCard;
