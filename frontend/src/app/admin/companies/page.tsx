"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from 'lodash/debounce';
import { useRouter } from "next/navigation";


export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("none");
  const [isSearching, setIsSearching] = useState(false);

    const router = useRouter();

    useEffect(() => {
      const userRole = localStorage.getItem("userRole");
      
      if (userRole !== "admin") {
        router.push("/login");
      }
    }, []);

  // Filter and sort companies
  const getFilteredAndSortedCompanies = () => {
    let result = [...companies];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(company => 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.state?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sort
    console.log("Sorting with type:", sortType);
    switch (sortType) {
      case "az":
        result.sort((a, b) => {
          const nameA = a.name?.trim().toLowerCase() || '';
          const nameB = b.name?.trim().toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case "za":
        result.sort((a, b) => {
          const nameA = a.name?.trim().toLowerCase() || '';
          const nameB = b.name?.trim().toLowerCase() || '';
          return nameB.localeCompare(nameA);
        });
        break;
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
    }
    
    console.log("Sorted result:", result);
    return result;
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log("Search term:", value);
      setSearchTerm(value);
      setIsSearching(false);
    }, 300),
    []
  );

  const handleSearch = (e) => {
    setIsSearching(true);
    debouncedSearch(e.target.value);
  };

  const handleSort = (type) => {
    console.log("Sort type selected:", type);
    setSortType(type);
  };

  const deleteCompany = async (companyId) => {
    try {
      setLoading(true);
      const url = `/api/company/${companyId}`;
      
      const response = await axios.delete(url, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 204) {
        toast.success('Company deleted successfully!');
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company._id !== companyId)
        );
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      const errorMessage = err.response?.data?.message || "An error occurred while deleting the company.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete._id);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company?active=true", { withCredentials: true });
        const fetchedCompanies = response.data?.data?.data || [];
        console.log("Fetched companies:", fetchedCompanies);
        setCompanies(fetchedCompanies);
        setError(null);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies. Please try again later.");
        toast.error("Failed to load companies. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

 
    fetchCompanies();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
      <div className="mt-6">
        <Link
          href="/admin/companies/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500-focus"
        >
          Add new Company
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full m-4">
      <div className="breadcrumbs text-sm px-4">
        <ul>
          <li><Link href="/admin">Dashboard</Link></li>
          <li className="font-semibold">Companies</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 -mt-4">
        <div className="w-full md:flex-1">
          <label className="input input-bordered flex items-center gap-2 w-full">
            <input
              type="text"
              className="grow"
              placeholder="Search companies..."
              onChange={handleSearch}
            />
            {isSearching ? (
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

        <div className="flex gap-2">
          {/* <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
              </svg>
              Sort
              {sortType !== 'none' && <div className="badge badge-sm ml-2">{sortType}</div>}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-lg">
              <li><a className={sortType === "az" ? "active" : ""} onClick={() => handleSort("az")}>Name (A-Z)</a></li>
              <li><a className={sortType === "za" ? "active" : ""} onClick={() => handleSort("za")}>Name (Z-A)</a></li>
              <li><a className={sortType === "newest" ? "active" : ""} onClick={() => handleSort("newest")}>Newest first</a></li>
              <li><a className={sortType === "oldest" ? "active" : ""} onClick={() => handleSort("oldest")}>Oldest first</a></li>
            </ul>
          </div> */}

          <Link
            href="/admin/companies/new"
            className="btn btn-primary "
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Company
          </Link>
        </div>
      </div>

      <div className="px-4">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="btn btn-sm">Retry</button>
          </div>
        ) : getFilteredAndSortedCompanies().length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedCompanies().map((company, index) => (
                  <tr key={company._id} className="hover">
                    <td className="font-medium">{index + 1}</td>
                    <td className="font-medium">{company.name}</td>
                    <td>{[company.city, company.state].filter(Boolean).join(', ')}</td>
                    <td>
                      <div className={`badge ${company.active ? 'bg-green-500 text-white px-4 py-[0.8rem]' : 'text-white bg-red-500 p-4'}`}>
                        {company.active ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/companies/${company._id}`}
                          className="btn btn-square btn-sm btn-ghost"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(company)}
                          className="btn btn-square btn-sm btn-ghost text-error"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete {companyToDelete?.name}? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn bg-red-500 text-white" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
