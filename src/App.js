import "./App.css";
import { Hero } from "./component/Hero";
import { Doctor } from "./component/Doctor";
import { Patient } from "./component/Patient";
import { Layout } from "./layout/Layout";
import { Layout2 } from "./layout/Layout2";
import { Route, Routes } from "react-router-dom";
import { Layout3 } from "./layout/Layout3";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Layout2 />}>
          <Route exact path="/" element={<Hero />}></Route>
        </Route>
        <Route element={<Layout3 />}>
          <Route element={<Doctor />} path="/doctor"></Route>
          <Route element={<Patient />} path="/patient"></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
