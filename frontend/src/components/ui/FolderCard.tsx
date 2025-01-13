"use client";

import { Icon } from "@iconify/react";

const FolderCard = ({ folder }) => {
  return (
    <div className="card bg-[#f0f6ff] hover:shadow-md transition-all duration-500">
      <div className="card-body">
        <Icon icon="bi:folder-fill" width="48" height="48" className="text-primary" />
        <p className="text-gray-800 font-semibold">{folder.folderName}</p> {/* Display folder name */}
        <p className="text-[#204780] text-sm font-semibold">{folder.noOfFiles} files</p> {/* Display number of files */}
      </div>
    </div>
  );
};

export default FolderCard;
