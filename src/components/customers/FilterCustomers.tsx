import React from "react";

interface FilterCustomersProps {
  userNameFilter: string;
  setUserNameFilter: (value: string) => void;
  plateFilter: string;
  setPlateFilter: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

const FilterCustomers: React.FC<FilterCustomersProps> = ({
  userNameFilter,
  setUserNameFilter,
  plateFilter,
  setPlateFilter,
  setCurrentPage, 
}) => {
  const handleUserNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameFilter(e.target.value);
    setCurrentPage(1); 
  };

  const handlePlateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlateFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      <input
        type="text"
        placeholder="حسب الاسم"
        value={userNameFilter}
        onChange={handleUserNameFilterChange}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="حسب اللوحة"
        value={plateFilter}
        onChange={handlePlateFilterChange}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FilterCustomers;