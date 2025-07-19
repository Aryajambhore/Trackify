import { useState } from "react";
import { X } from "lucide-react";
function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="px-8">
      <div className="flex justify-between my-8">
        <h1 className="text-lg font-bold">Categories</h1>
        <button
          onClick={toggleSidebar}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
        >
          Add new
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <div className="fixed text-black top-0 right-0 h-full w-120 bg-white shadow-lg z-40 p-6 ">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl text-black font-bold">
              Add Categories
            </h2>
            <X
              className="text-black w-5 h-5 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <p>Create new Categories here</p>
          <div className="mt-2 mb-2">
            <h1 className="mb-1 font-bold">Name</h1>
            <input type="text" className="w-full p-2 border rounded-lg" />
          </div>
          <button className="bg-blue-500 w-full text-white rounded-md p-2 ">
              Add
            </button>
        </div>
      )}
    </div>
  );
}
export default Categories;
