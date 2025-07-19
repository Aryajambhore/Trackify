import { Link } from "react-router-dom";
function Navbar() {
  const navigation = [
    { name: "Overview", path: "/" },
    { name: "Transaction", path: "/Transaction" },
    { name: "Accounts", path: "/Accounts" },
    { name: "Categories", path: "/Categories" },
    { name: "Settings", path: "/Settings" },
  ];
  return (
    <header className="text-white shadow-md">
      <nav className="container mx-auto py-5 flex justify-between items-center ">
        <h1 className="text-3xl font-bold">Trackify</h1>
        <ul className="flex gap-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                className="w-xxl text-center px-3 py-2 rounded-3xl hover:bg-blue-200 hover:text-black transition-colors duration-200"
                to={item.path}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
export default Navbar;
