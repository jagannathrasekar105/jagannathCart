import React, { useState, useEffect, useRef } from "react";

function FilterDropdown({
  categories,
  products,
  selectedFilters,
  toggleFilter,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex justify-start w-72 absolute top-4 left-4"
      ref={dropdownRef}
    >
      <div className="relative w-full">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-white text-black px-4 py-2 w-full rounded shadow border border-gray-300 text-left"
        >
          Filter by Category / Product
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 bg-white text-black mt-1 p-4 rounded shadow w-full border border-gray-300 max-h-48 overflow-auto text-left">
            <strong className="block mb-1">Categories</strong>
            {categories.map((cat) => (
              <label key={cat.id} className="block mb-1">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={selectedFilters.includes(cat.id.toString())}
                  onChange={() => toggleFilter(cat.id.toString())}
                  className="mr-2"
                />
                {cat.name}
              </label>
            ))}

            <hr className="my-2" />

            <strong className="block mb-1">Products</strong>
            {products.map((prod) => (
              <label key={prod.id} className="block mb-1">
                <input
                  type="checkbox"
                  value={prod.id}
                  checked={selectedFilters.includes(prod.id.toString())}
                  onChange={() => toggleFilter(prod.id.toString())}
                  className="mr-2"
                />
                {prod.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterDropdown;
