"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardSkeleton from "@/components/ui/CardSkeleton";
import FolderCard from "@/components/ui/FolderCard";

const Folders = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredFolders, setFilteredFolders] = useState([]);
  const router = useRouter();

  const insuranceFolders = [
    // Add your folder data here
  ];

  useEffect(() => {
    // Simulate a loading delay for initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
      setFilteredFolders(insuranceFolders); // Initialize with all folders
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filterFolders = () => {
    setLoading(true);
    let filtered = insuranceFolders;

    if (searchTerm) {
      filtered = filtered.filter((folder) =>
        folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((folder) => folder.category === selectedCategory);
    }

    setFilteredFolders(filtered);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      filterFolders();
    }, 300); // Debounce the filtering for better performance

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <header
        aria-label="Site Header"
        className="pt-8 mx-16 flex flex-col justify-center items-center gap-8"
      >
        <label
          className="input input-bordered flex items-center gap-2"
          style={{ width: "700px" }}
        >
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
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
        </label>

        <div className="flex gap-4">
          <div
            onClick={() => handleCategoryChange("All")}
            tabIndex={0}
            role="button"
            className="btn m-1 px-8 bg-[#ecf4ff] text-primary"
          >
            All
          </div>

          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 mb-4 px-16 bg-[#ecf4ff] text-primary"
            >
              General Insurance
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => handleCategoryChange("Motor & Property")} className="text-primary">
                  Motor & Property
                </a>
              </li>
              <li>
                <a onClick={() => handleCategoryChange("Marine & Aviation")} className="text-primary">
                  Marine & Aviation
                </a>
              </li>
              <li>
                <a onClick={() => handleCategoryChange("Engineering")} className="text-primary">
                  Engineering
                </a>
              </li>
              <li>
                <a onClick={() => handleCategoryChange("Agriculture")} className="text-primary">
                  Agriculture
                </a>
              </li>
              <li>
                <a onClick={() => handleCategoryChange("Liability")} className="text-primary">
                  Liability
                </a>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 px-16 bg-[#ecf4ff] text-primary"
            >
              Long Term Insurance
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-96 p-2 shadow"
            >
              <li>
                <a onClick={() => handleCategoryChange("Life Insurance")} className="text-primary">
                  Life Insurance
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleCategoryChange("Health (medical expense) Insurance")}
                  className="text-primary"
                >
                  Health (medical expense) Insurance
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleCategoryChange("World Wide Travel Insurance")}
                  className="text-primary"
                >
                  World Wide Travel Insurance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <h2 className="px-16 mt-8 font-bold text-xl text-primary">Folders</h2>
      <div className="grid grid-cols-4 px-16 py-8 gap-4">
        {loading ? (
          Array(12)
            .fill(0)
            .map((_, idx) => <CardSkeleton key={idx} />)
        ) : (
          filteredFolders.map((folder) => (
            <div
              key={folder.folderId}
              onClick={() => router.push(`/documents/${folder.folderId}`)}
            >
              <FolderCard folder={folder} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Folders;
