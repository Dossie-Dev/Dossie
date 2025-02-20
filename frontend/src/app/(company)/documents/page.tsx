"use client";

import React from "react";
import CardSkeleton from "@/components/ui/CardSkeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const Documents = () => {

  const router = useRouter();

useEffect(() => {
  const userRole = localStorage.getItem("userRole");
  
  if (userRole !== "user") {
    router.push("/login");
  }
}, []);



  return (
      <div className="pt-8 mx-16 flex flex-col justify-center items-center gap-8">
        <div className="flex gap-2">
          <label
            className="input input-bordered flex items-center gap-2"
            style={{ width: "700px" }}
          >
            <input
              type="text"
              className="grow"
              placeholder="Search"
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

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn px-8 text-primary">
              Sort
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow mt-2">
              <li>
                <a className="text-primary">Alphabet (A-Z)</a>
              </li>
              <li>
                <a className="text-primary">Alphabet (Z-A)</a>
              </li>
              <li>
                <a className="text-primary">Date (first - last)</a>
              </li>
              <li>
                <a className="text-primary">Date (last - first)</a>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="px-16 mt-8 font-bold text-xl text-primary">Folders</h2>
      {/* <div className="grid grid-cols-4 px-16 py-8 gap-4">
        {loading
          ? Array(12)
              .fill(0)
              .map((_, idx) => <CardSkeleton key={idx} />)
          : filteredFolders.map((folder) => (
              <div
                key={folder.folderId}
                onClick={() => router.push(`/folders/${folder.folderId}`)}
                className="cursor-pointer"
              >
                <FolderCard folder={folder} />
              </div>
            ))}
      </div> */}
      </div>
  );
};

export default Documents;