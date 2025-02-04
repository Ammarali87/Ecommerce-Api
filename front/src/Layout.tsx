import { Outlet, Link } from "react-router-dom";
import SearchBar from "./component/SearchBar";

const Layout = () => {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search</Link></li>
        </ul>
    <SearchBar onSearch={function
     (_query: string): void {
  throw new Error("Function not implemented.");
            } }/>
      </nav>

      {/* Page Content */}
      <main>
        <Outlet /> {/* This renders child routes */}
      </main>

      {/* Footer */}
      <footer>
        <p>© 2025 My Website</p>
      </footer>
    </div>
  );
};

export default Layout;
