"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import axios from "axios";
import { debounce } from "lodash";

interface Document {
  _id: string;
  title: string;
  authors: string[];
  department: string;
  createdAt: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department: "",
    author: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(10);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `/api/research?page=${currentPage}&limit=${documentsPerPage}`
        );
        const data = response.data;
        const newDocuments = data.data.data;
        setDocuments((prevDocs) => [...prevDocs, ...newDocuments]);
        setTotalDocuments(data.data.paginationData.total);

        if (newDocuments.length < documentsPerPage) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/login");
      return;
    }

    fetchDocuments();
  }, [currentPage, documentsPerPage, router]);

  // Infinite scroll logic
  const observer = useRef<IntersectionObserver>();
  const lastDocumentElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((doc) => (filters.department ? doc.department === filters.department : true))
    .filter((doc) => (filters.author ? doc.authors.includes(filters.author) : true))
    .filter((doc) =>
      filters.date
        ? new Date(doc.createdAt).toDateString() === new Date(filters.date).toDateString()
        : true
    )
    .sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortOrder === "asc" ? (titleA < titleB ? -1 : 1) : titleA > titleB ? -1 : 1;
    });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      department: '',
      author: '',
      date: '',
    });
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm">
        <Link href="/" className="text-blue-500 hover:underline">Home</Link> / 
        <Link href="/admin/documents" className="text-gray-500 hover:underline"> Documents</Link>
      </div>

      {/* Header with Document Count Badge */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-blue-500">Research Documents</h1>
        <div className="text-blue-600 text-sm font-semibold">
          {totalDocuments} {totalDocuments === 1 ? "Document" : "Documents"}
        </div>
      </div>

      {/* Search and Filters */}
      <FilterSection
        debouncedSearch={debouncedSearch}
        isLoading={isLoading}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Document List */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <DocumentCard
              key={`${doc._id}-${doc.createdAt}`}
              doc={doc}
              isLastDocument={filteredDocuments.length === index + 1}
              lastDocumentElementRef={lastDocumentElementRef}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredDocuments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents found. Try adjusting your filters or search query.
        </div>
      )}

      {/* Loading More Indicator */}
      {hasMore && !isLoading && (
        <div className="text-center py-4 text-blue-500">
          Loading more documents...
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Back to Top"
      >
        ↑
      </button>
    </div>
  );
}

// Reusable Components

interface FilterSectionProps {
  debouncedSearch: (query: string) => void;
  isLoading: boolean;
  filters: { department: string; author: string; date: string };
  setFilters: (filters: { department: string; author: string; date: string }) => void;
  resetFilters: () => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

const FilterSection = ({
  debouncedSearch,
  isLoading,
  filters,
  setFilters,
  resetFilters,
  sortOrder,
  setSortOrder,
}: FilterSectionProps) => (
  <div className="mb-4">
    <div className="flex flex-row justify-between items-center gap-4 py-4">
      <div className="w-full md:flex-1">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Search documents..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="grow"
            aria-label="Search documents"
          />
          {isLoading ? (
            <div className="loading loading-spinner loading-sm"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </label>
      </div>
          <Link href={"/admin/new"}>
      <button
        className="btn btn-primary text-white"
        aria-label="Add New Document"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"></path></svg>
       <span>Add New Document</span> 
      </button>
      </Link>

    </div>

    {/* Advanced Filters */}
   
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i} 
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
      >
        <Skeleton height={24} width="80%" className="mb-4" />
        <div className="space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={16} width="50%" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
    ))}
  </div>
);

interface DocumentCardProps {
  doc: Document;
  isLastDocument: boolean;
  lastDocumentElementRef: (node: HTMLElement | null) => void;
}

const DocumentCard = ({ doc, isLastDocument, lastDocumentElementRef }: DocumentCardProps) => (
  <Link
    className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    href={`/admin/documents/${doc._id}`}
    ref={isLastDocument ? lastDocumentElementRef : null}
    aria-label={`View document: ${doc.title}`}
  >
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600">
        {doc.title}
      </h2>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <svg
          className="w-4 h-4 mr-2 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span>{doc.authors.join(", ")}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <svg
          className="w-4 h-4 mr-2 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
          />
        </svg>
        <span>{doc.department}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <svg
          className="w-4 h-4 mr-2 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </Link>
);