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
import { Status } from "./component/Status";
import { Slot } from "./component/Slot";
import { Admin } from "./component/Admin";
import { Doc_Verification } from "./component/Doc_Verification";
import { Appointment } from "./component/Appointment";
import { PrivateRoute } from "./PrivateRoute/PrivateRoute";
import { PrivateRouteForDoc } from "./PrivateRoute/PrivateRouteForDoc";
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
              <PrivateRoute requiredRole="doctor">
                <Doctor />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient"
            element={
              <PrivateRoute requiredRole="patient">
                <Patient />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient/appointment/:doctorId/:doctorName/:date"
            element={
              <PrivateRoute requiredRole="patient">
                <Appointment />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient/status"
            element={
              <PrivateRoute requiredRole="patient">
                <Status />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRouteForDoc requiredRole="admin">
                <Admin />
              </PrivateRouteForDoc>
            }
          />
          <Route
            path="/user/data/:role"
            element={
              <PrivateRouteForDoc requiredRole={["doctor", "patient"]}>
                <Slot />
              </PrivateRouteForDoc>
            }
          />
          <Route
            path="/doctor/verification/:verification"
            element={
              <PrivateRouteForDoc requiredRole="doctor">
                <Doc_Verification />
              </PrivateRouteForDoc>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
