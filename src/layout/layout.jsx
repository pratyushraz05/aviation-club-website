import "./Layout.css";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;