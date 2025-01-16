"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for navigation
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "../../../../components/ui/FileCard";

const FolderDetail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [folderDetails, setFolderDetails] = useState(null);
  const [files, setFiles] = useState([]);

  const sampleFiles = [
    {
      type: "image",
      src: "https://www.letterofcredit.biz/wp-content/uploads/insurance-certificate-sample.gif",
      name: "Sample Image Document",
      fileCount: 24,
    },
    {
      type: "pdf",
      src: "/assets/Sample_Insurance_Cert.pdf",
      name: "Sample PDF Document",
      fileCount: 1,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Simulating data fetching
      setTimeout(() => {
        setFolderDetails({
          folderName: "Sample Folder",
          folderId: "12345",
          category: "Documents",
          noOfFiles: sampleFiles.length,
          dateAdded: "2023-12-01",
          dateLastUpdated: "2024-01-01",
        });
        setFiles(sampleFiles);
        setLoading(false);
      }, 2000); // Simulate a 2-second delay
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <header aria-label="Folder Details Header" className="pt-8 mx-16">
        <div className="flex flex-wrap items-center justify-between py-4 px-8 rounded-md border bg-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-blue-700 font-semibold hover:underline"
            >
              ← Back
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              {folderDetails?.folderName || "Loading..."}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p className="font-semibold">
              Document ID:{" "}
              <span className="font-bold text-blue-700">
                {folderDetails?.folderId || "Loading..."}
              </span>
            </p>
            <p className="font-semibold">
              Category:{" "}
              <span className="font-bold text-blue-700">
                {folderDetails?.category || "Loading..."}
              </span>
            </p>
            <p className="font-semibold">
              No of Files:{" "}
              <span className="font-bold text-blue-700">
                {folderDetails?.noOfFiles || "Loading..."}
              </span>
            </p>
            <p className="font-semibold">
              Date Added:{" "}
              <span className="font-bold text-blue-700">
                {folderDetails?.dateAdded || "Loading..."}
              </span>
            </p>
            <p className="font-semibold">
              Last Updated:{" "}
              <span className="font-bold text-blue-700">
                {folderDetails?.dateLastUpdated || "Loading..."}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* Files Section */}
      <h2 className="px-16 mt-8 font-bold text-xl text-primary">Files</h2>
      <div className="grid grid-cols-4 px-8 py-4 gap-4">
        {loading
          ? Array(12)
              .fill(0)
              .map((_, index) => <Skeleton key={index} height={200} />)
          : files.map((file, index) => <Card key={index} file={file} />)}
      </div>
    </div>
  );
};

export default FolderDetail;
