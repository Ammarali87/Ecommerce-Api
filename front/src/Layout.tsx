import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col justify-between
     bg-emerald-400">
      {/* Navbar */}
      <nav className="fixed-top bg-amber-400 flex ">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search</Link></li>
        </ul>
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
