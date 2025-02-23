import React from "react";

const Spinner = () => {
  return (
    <>
      <div class="flex justify-center items-center h-screen">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </>
  );
};

export default Spinner;
