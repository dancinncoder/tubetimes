import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

function Layout() {
  return (
    <div className="flex flex-col relative">
      <Header />
      <Outlet />
      <Navigation />
    </div>
  );
}

export default Layout;
