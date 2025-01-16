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
      setIsModalOpen(true); // Open a modal for PDF
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
              style={{ border: "none" }}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl">
            <button
              className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-full"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            {isPDF ? (
              <iframe
                src={file.src}
                className="w-full h-[75vh]"
                style={{ border: "none" }}
                title={`PDF Viewer: ${file.name}`}
              />
            ) : isImage ? (
              <img
                src={file.src}
                alt={file.name}
                className="w-full h-auto object-contain"
              />
            ) : (
              <p className="text-center text-gray-800 font-semibold">
                Unsupported File Type
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FileCard;
