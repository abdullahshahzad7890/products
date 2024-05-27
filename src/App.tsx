import { Route, Routes } from "react-router-dom";
import Products from "./views/Products/Products";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/Products" element={<Products />} />
      </Routes>
    </>
  );
};

export default App;
