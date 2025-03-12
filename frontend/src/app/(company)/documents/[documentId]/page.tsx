"use client";

import { useEffect, useState, use } from "react"; // Import `use` from React
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
          <a href="/documents" className="text-blue-500 hover:text-blue-700">Home</a>
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

export default function DocumentDetails({ params }: { params: Promise<{ documentId: string }> }) {
  const router = useRouter();
  const { documentId } = use(params); // Unwrap the params promise using `use`

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [documentId]); // Add `documentId` as a dependency

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
    <div className="container mx-auto p-4 lg:p-12 lg:px-32 px-8">
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
          <h2 className="text-md font-semibold mb-2"><span className="text-sm text-blue-500">Authors:</span>  {document.authors?.join(", ")}</h2>
          <h3 className="text-md font-semibold mb-2"><span className="text-sm text-blue-500">Department:</span> {document.department}</h3>
          <h3 className="text-md font-semibold mb-2"><span className="text-sm text-blue-500">Organization:</span> {document.companyId ? document.companyId.name : <span className="text-red-600">No Organization</span>}</h3>
          <p className="mt-4 text-sm text-gray-500"><span className="text-sm text-blue-500">Created At:</span> {new Date(document.createdAt).toLocaleDateString()}</p>
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
        </>
      )}
    </div>
  );
}