"use client";

import { useEffect, useState, use } from "react";
import { jsPDF } from "jspdf";
import axios from "axios"; // Import axios
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface Document {
  title: string;
  authors: string[];
  department: string;
  data: string;
  createdAt: string;
}

const Breadcrumbs = ({ document }: { document: Document | null }) => {
  return (
    <nav className="mb-4">
      <ol className="list-reset text-sm flex text-grey-dark">
        <li>
          <a href="/" className="text-blue-500 hover:text-blue-700">Home</a>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>
          <a href="/documents" className="text-blue-500 hover:text-blue-700">Documents</a>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li className="text-grey-dark">Detail</li>
      </ol>
    </nav>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this document? This action is not reversible.</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, document, onSave }) => {
  const [formData, setFormData] = useState({
    title: document.title,
    department: document.department,
    data: document.data,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Document</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DocumentDetails({ params }: { params: Promise<{ documentId: string }> }) {
  const router = useRouter();
  const { documentId } = use(params);


  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);




  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    
    if (userRole !== "user") {
        router.push("/login");
    }
}, []);


  const fetchDocument = async () => {
    if (!documentId) return;

    try {
      const response = await axios.get(`/api/research/${documentId}`);
      if (response.status !== 200) throw new Error("Failed to fetch document");

      const data = response.data;
      if (!data.data || !data.data.data || !data.data.data[0]) {
        throw new Error("Invalid document data format");
      }

      setDocument(data.data.data[0]);
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Failed to load document. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
   

    fetchDocument();
  }, []);

  const saveChanges = async (updatedData) => {
    try {
      const response = await axios.patch(`/api/research/${documentId}`, updatedData);
      if (response.status !== 200) throw new Error("Failed to update document");
  
      setDocument(response.data.data);
      toast.success("Document successfully edited!"); // Add this line
      fetchDocument()
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document. Please try again later.");
    }
  };

  const deleteDocument = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/research/${documentId}`);
      if (response.status !== 200) throw new Error("Failed to delete document");

      if (response.data.status === "success") {
        toast.success("Document successfully deleted!");
        router.push("/emp/documents");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document. Please try again later.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const downloadPDF = () => {
    if (!document) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 10;
    let yOffset = 10;

    doc.setFontSize(12);

    const addWrappedText = (text: string, yOffset: number) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yOffset > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yOffset = 10;
        }
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
      return yOffset;
    };

    yOffset = addWrappedText(`Title: ${document.title}`, yOffset);
    yOffset += lineHeight;

    yOffset = addWrappedText(`Authors: ${document.authors.join(", ")}`, yOffset);
    yOffset += lineHeight;

    yOffset = addWrappedText(`Department: ${document.department}`, yOffset);
    yOffset += lineHeight;

    yOffset = addWrappedText(`Created At: ${new Date(document.createdAt).toLocaleDateString()}`, yOffset);
    yOffset += lineHeight * 2;

    const paragraphs = document.data.split(/\n\s*\n/);
    paragraphs.forEach((paragraph) => {
      yOffset = addWrappedText(paragraph, yOffset);
      yOffset += lineHeight;
    });

    doc.save(`${document.title}.pdf`);
  };

  if (error) return <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>;
  if (!document && !isLoading) return <div>No document found.</div>;

  return (
    <div className="container mx-auto p-4 lg:px-16 lg:py-6 ">
      <Breadcrumbs document={document} />
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2 text-blue-500">{document.title}</h1>
          <h2 className="text-lg font-semibold mb-2">Authors: {document.authors?.join(", ")}</h2>
          <h3 className="text-md font-semibold mb-2">Department: {document.department}</h3>
          <p className="mt-4 text-sm text-gray-500">Created At: {new Date(document.createdAt).toLocaleDateString()}</p>
          <hr className="my-8" />
          <div className="mt-4">
            {typeof document?.data === "string" ? (
              document.data.split(/\n\s*\n/).map((paragraph, index) => (
                <div key={index} className="mb-4">{paragraph}</div>
              ))
            ) : (
              <div>No content available.</div>
            )}
          </div>
          <hr className="my-8" />
          <div className="flex justify-center items-center gap-2">

            <button
              onClick={downloadPDF}
              className="bg-blue-500 w-56 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition flex justify-center items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"></path></svg>
              <span>Download PDF</span>
            </button>
          </div>
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteDocument}
            isLoading={isDeleting}
          />
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            document={document}
            onSave={saveChanges}
          />
        </>
      )}
    </div>
  );
}