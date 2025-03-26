import React from "react";

interface PaginationProps {
  currentPage: number;
  totalUsers: number; // Total number of users
  usersPerPage: number; // Number of users per page
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalUsers,
  usersPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Always show the first 3 pages
    for (let i = 1; i <= 3; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if there are pages between the first 3 and the last page
    if (totalPages > 4) {
      pageNumbers.push("...");
    }

    // Always show the last page
    if (totalPages > 3) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((page, index) => {
      if (page === "...") {
        return (
          <li key={index}>
            <span className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500">
              ...
            </span>
          </li>
        );
      }

      return (
        <li key={index}>
          <button
            onClick={() => onPageChange(page as number)}
            className={`flex items-center justify-center px-3 h-8 text-sm font-medium border rounded-lg ${
              currentPage === page
                ? "text-white bg-blue-600 border-blue-600"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}>
            {page}
          </button>
        </li>
      );
    });
  };

  return (
    <nav aria-label="Page navigation" className="flex justify-center my-6" style={{ direction: "ltr" }}>
      <ul className="flex items-center space-x-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}>
            <span className="sr-only">Previous</span>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            }`}>
            <span className="sr-only">Next</span>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;