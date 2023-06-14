import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center w-full max-w-md mx-auto my-8 p-4 bg-white rounded-md shadow">
      <input
        type="text"
        className="w-3/5 p-2 rounded-l-md outline-none"
        placeholder="Twitter handle only (not @)"
      />
      <button className="w-2/5 p-2 bg-prosperity hover:bg-yellow-400  rounded-md text-black">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
