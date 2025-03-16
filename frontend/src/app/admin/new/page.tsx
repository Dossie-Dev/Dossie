"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import scan from "../../../assets/scan.gif";

// Type Definitions
interface Company {
  _id: string;
  name: string;
}

interface DocumentResponse {
  _id: string;
  title: string;
  authors: string[];
  department: string;
  data: string;
  companyId?: { _id: string } | string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string().min(1, "Author name cannot be empty")),
  department: z.string().min(1, "Department is required"),
  data: z.string().min(1, "Content is required"),
  companyId: z.string().min(1, "Organization is required"),
});

// File Upload Area Component
const FileUploadArea = ({
  files,
  setFiles,
  isDragging,
  setIsDragging,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      setFiles(Array.from(event.dataTransfer.files));
    }
  };

  return (
    <div
      className={`w-full md:w-[40rem] border-2 border-dashed rounded-lg p-4 md:p-6 my-8 mx-auto transition-all duration-300 ${
        isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-md md:text-lg font-semibold mb-4 text-center">
        Drag & Drop Files Here
      </h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
        aria-label="Upload files"
      />
      <label
        htmlFor="fileInput"
        className="bg-blue-500 mx-auto w-full md:w-56 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5V21h18v-4.5M3 8.5V3h18v5.5M3 12h18m-9-9l-3 3m3-3l3 3m-3 3l-3 3m3-3l3 3"
          />
        </svg>
        Or Select Files
      </label>
    </div>
  );
};

// File Preview Component
const FilePreview = ({ files }: { files: File[] }) => (
  <div className="mb-4">
    <h3 className="text-md md:text-lg font-semibold mb-2">Selected Files:</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file, index) => (
        <div key={index} className="flex items-center p-2 border rounded-lg">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="ml-4">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Document Form Modal Component
const DocumentFormModal = ({
  isOpen,
  onClose,
  formData,
  companies,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: DocumentResponse;
  companies: Company[];
  onSave: (data: z.infer<typeof formSchema>) => Promise<void>;
}) => {
  const { register, handleSubmit, control, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData.title,
      authors: formData.authors || [],
      department: formData.department,
      data: formData.data,
      companyId: typeof formData.companyId === "object" ? formData.companyId?._id : formData.companyId || "",
    },
  });

  const authors = watch("authors");

  const handleAddAuthor = () => setValue("authors", [...authors, ""]);
  const handleRemoveAuthor = (index: number) =>
    setValue(
      "authors",
      authors.filter((_, i) => i !== index)
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-scroll">
      <div className="bg-white p-4 md:p-6 shadow-lg w-full max-w-md md:max-w-2xl rounded-[0.5rem] my-16 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-500 mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V7H5zm7-2q-2.05 0-3.662-1.112T6 13q.725-1.775 2.338-2.887T12 9t3.663 1.113T18 13q-.725 1.775-2.337 2.888T12 17m0-2.5q-.625 0-1.062-.437T10.5 13t.438-1.062T12 11.5t1.063.438T13.5 13t-.437 1.063T12 14.5m0 1q1.05 0 1.775-.725T14.5 13t-.725-1.775T12 10.5t-1.775.725T9.5 13t.725 1.775T12 15.5"
            />
          </svg>
          Preview Document
        </h2>
        <hr className="border-gray-200 mb-6" />

        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4 mt-8">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-blue-500">Title</label>
            <input {...register("title")} className="input input-bordered w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-blue-500">Authors</label>
            <div className="flex flex-wrap gap-2">
              {authors.map((author, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    {...register(`authors.${index}`)}
                    className="input input-bordered w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAuthor(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddAuthor}
              className="btn btn-primary btn-sm mt-2"
            >
              Add Author
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-blue-500">Department</label>
            <input
              {...register("department")}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="block text-sm font-medium text-blue-500 mb-2">
              Organization
            </label>
            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full"
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Select Organization</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-blue-500">Content</label>
            <textarea
              {...register("data")}
              className="textarea textarea-bordered w-full"
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
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

// Main Component
export default function New() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DocumentResponse | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const response = await axios.get<{ data: { data: Company[] } }>("/api/company?active=true");
        const companiesData = response.data?.data?.data || [];
        if (Array.isArray(companiesData)) {
          setCompanies(companiesData);
        } else {
          throw new Error("Invalid companies data format");
        }
      } catch (error) {
        toast.error("Failed to fetch companies");
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [files]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!files.length) {
        toast.error("Please select at least one file to upload.");
        return;
      }

      const uploadData = new FormData();
      files.forEach((file) => uploadData.append("files", file));

      setIsLoading(true);
      try {
        const { data } = await axios.post<DocumentResponse>("/api/document/scan", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Document extracted successfully!");
        setFormData(data);
        setIsModalOpen(true);
        setFiles([]);
      } catch (error) {
        console.error("Error during file upload:", error);
        toast.error(
          axios.isAxiosError(error) ? error.response?.data?.message : "Upload failed"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [files]
  );

  const handleSaveChanges = async (data: z.infer<typeof formSchema>) => {
    if (!formData?._id) return;

    try {
      await axios.patch(`/api/research/${formData._id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Changes saved successfully!");
      setIsModalOpen(false);
      router.push("/emp/documents");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-start justify-center p-4 mt-6 mx-auto">
        <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6">
          <div className="flex flex-col gap-2 items-center justify-center text-center">
            <Image
              src={scan}
              alt="scan document"
              width={144}
              height={144}
              className="w-24 md:w-36"
            />
            <h1 className="text-xl md:text-2xl font-bold">Upload Document</h1>
          </div>

          <FileUploadArea
            files={files}
            setFiles={setFiles}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />

          {files.length > 0 && <FilePreview files={files} />}

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setFiles([])}
              className="bg-gray-300 text-black px-8 py-2 rounded hover:bg-gray-400 transition flex items-center justify-center w-full md:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Selection
            </button>

            {formData?.data && (
              <button
                className="bg-white mx-auto w-full md:w-56 text-blue-500 border border-blue-400 px-4 py-2 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition flex justify-center items-center"
                onClick={() => setIsModalOpen(true)}
              >
                Preview
              </button>
            )}

            <form onSubmit={handleSubmit} className="w-full md:w-auto">
              <button
                type="submit"
                disabled={isLoading || files.length === 0}
                className="bg-blue-500 mx-auto w-full md:w-56 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition flex justify-center items-center disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {formData && (
        <DocumentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          companies={companies}
          onSave={handleSaveChanges}
        />
      )}
    </>
  );
}