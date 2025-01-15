import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Navigation />
    </div>
  );
}

export default Layout;
