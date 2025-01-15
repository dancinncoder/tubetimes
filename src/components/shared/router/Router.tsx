import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../../pages/Home";
import Layout from "../layout/Layout";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={"/"} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
