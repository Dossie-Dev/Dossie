"use client";

const CardSkeleton = () => {
  return (
    <div className="card bg-[#f0f6ff] animate-pulse">
      <div className="card-body">
        <div className="h-12 w-12 bg-gray-300 rounded-full mb-2"></div> {/* Placeholder for icon */}
        <div className="h-4 bg-gray-300 rounded mb-2"></div> {/* Placeholder for title */}
        <div className="h-3 bg-gray-300 rounded w-1/2"></div> {/* Placeholder for file count */}
      </div>
    </div>
  );
};

export default CardSkeleton;
