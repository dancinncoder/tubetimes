import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../../pages/Home";
import Layout from "../layout/Layout";
import Favorite from "../../../pages/Favorite";
import Setting from "../../../pages/Setting";
import Map from "../../../pages/Map";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={"/"} element={<Home />} />
          <Route path={"/map"} element={<Map />} />
          <Route path={"/favorite"} element={<Favorite />} />
          <Route path={"/setting"} element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
