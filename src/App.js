import "./App.css";
import { Hero } from "./component/Hero";
import { Doctor } from "./component/Doctor";
import { Patient } from "./component/Patient";
import { Layout } from "./layout/Layout";
import { Layout2 } from "./layout/Layout2";
import { Route, Routes } from "react-router-dom";
import { Layout3 } from "./layout/Layout3";
import { Verification } from "./component/Verification";
import { Otp } from "./component/Otp";
import { PrivateRoute } from "./PrivateRoute/PrivateRoute";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Layout2 />}>
          <Route exact path="/" element={<Hero />}></Route>
          <Route
            path="/user/:user_id/verify/:token"
            element={<Verification />}
          />
          <Route exact path="/otp" element={<Otp />}></Route>
        </Route>
        <Route element={<Layout3 />}>
          <Route
            path="/doctor"
            element={
              <PrivateRoute>
                <Doctor />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient"
            element={
              <PrivateRoute>
                <Patient />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
