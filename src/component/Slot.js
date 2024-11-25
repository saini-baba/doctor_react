import React from "react";
import styles from "./slot.module.scss";
import { jwtDecode } from "jwt-decode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];
const DoctorForm = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        day_off: "",
        available_time: { start: "", end: "" },
        lunch_time: { start: "", end: "" },
        fee: "",
        gender: "",
        location: { city: "", state: "" },
        age: "",
        experience: "",
        license_number: "",
        specialization: "",
      }}
      validationSchema={Yup.object({
        day_off: Yup.string().required("Day off is required"),
        available_time: Yup.object({
          start: Yup.string().required("Start time is required"),
          end: Yup.string()
            .required("End time is required")
            .test(
              "is-later",
              "End time must be later than start time for available time",
              function (value) {
                const { start } = this.parent; // Access sibling field
                if (!start || !value) return true; // Skip validation if either field is empty
                return (
                  new Date(`1970-01-01T${value}`) >
                  new Date(`1970-01-01T${start}`)
                );
              }
            ),
        }),
        lunch_time: Yup.object({
          start: Yup.string().required("Lunch start time is required"),
          end: Yup.string()
            .required("Lunch end time is required")
            .test(
              "is-later",
              "End time must be later than start time for lunch time",
              function (value) {
                const { start } = this.parent; // Access sibling field
                if (!start || !value) return true; // Skip validation if either field is empty
                return (
                  new Date(`1970-01-01T${value}`) >
                  new Date(`1970-01-01T${start}`)
                );
              }
            ),
        }),
        fee: Yup.number().required("Fee is required"),
        gender: Yup.string().required("Gender is required"),
        location: Yup.object({
          city: Yup.string().required("City is required"),
          state: Yup.string().required("State is required"),
        }),
        age: Yup.number()
          .min(18, "Age must be at least 18")
          .required("Age is required"),
        experience: Yup.number()
          .min(0, "Experience cannot be negative")
          .required("Experience is required"),
        license_number: Yup.string().required("License number is required"),
        specialization: Yup.string().required("Specialization is required"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        console.log(values);

        try {
          const response = await axios.post(
            "http://localhost:8000/doctor/data",
            values,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Response:", response.data);
          toast.success("Form submitted successfully! Login again");
          resetForm();
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } catch (error) {
          console.error("Error:", error.response?.data || error.message);
          toast.error("Error submitting the form. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <div>
              <label>Day Off:</label>
              <Field name="day_off" as="select">
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Field>
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="day_off" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Available Time:</label>
              <div>
                <Field name="available_time.start" type="time" />
                <Field name="available_time.end" type="time" />
              </div>
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="available_time.start" />
              </p>
              <p>
                <ErrorMessage name="available_time.end" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Lunch Time:</label>
              <div>
                <Field name="lunch_time.start" type="time" />
                <Field name="lunch_time.end" type="time" />
              </div>
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="lunch_time.start" />
              </p>
              <p>
                <ErrorMessage name="lunch_time.end" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Fee:</label>
              <Field name="fee" type="number" />
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="fee" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Gender:</label>
              <Field name="gender" as="select">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="gender" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Location:</label>
              <div>
                <Field name="location.city" placeholder="City" />
                <Field name="location.state" as="select">
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="location.city" />
              </p>
              <p>
                <ErrorMessage name="location.state" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Age:</label>
              <Field name="age" type="number" />
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="age" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Experience:</label>
              <Field name="experience" type="number" />
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="experience" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>License Number:</label>
              <Field name="license_number" />
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="license_number" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <label>Specialization:</label>
              <Field name="specialization" as="select">
                <option value="">Select Specialization</option>
                <option value="Cosmetic dermatology">
                  Cosmetic dermatology
                </option>
                <option value="Dermatopathology">Dermatopathology</option>
                <option value="Mohs surgery">Mohs surgery</option>
                <option value="Pediatric dermatology">
                  Pediatric dermatology
                </option>
                <option value="Immunodermatology">Immunodermatology</option>
                <option value="Trichology">Trichology</option>
              </Field>
            </div>
            <div className={styles.ErrorMessage}>
              <p>
                <ErrorMessage name="specialization" />
              </p>
            </div>
          </div>

          <button type="submit">
            {" "}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

const PatientForm = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        gender: "",
        location: { city: "", state: "" },
        age: "",
      }}
      validationSchema={Yup.object({
        gender: Yup.string().required("Gender is required"),
        location: Yup.object({
          city: Yup.string().required("City is required"),
          state: Yup.string().required("State is required"),
        }),
        age: Yup.number()
          .min(0, "Age cannot be negative")
          .required("Age is required"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        console.log(values);
        try {
          const response = await axios.post(
            "http://localhost:8000/patients/data",
            values,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Response:", response.data);
          toast.success("Form submitted successfully! Login again");
          resetForm();
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } catch (error) {
          console.error("Error:", error.response?.data || error.message);
          toast.error("Error submitting the form. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {() => (
        <Form>
          <div>
            <label>Gender</label>
            <Field name="gender" as="select">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Field>
            <p>
              <ErrorMessage name="gender" />
            </p>
          </div>

          <div>
            <label>Location</label>
            <Field name="location.city" placeholder="City" />
            <Field name="location.state" as="select">
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </Field>
            <p>
              <ErrorMessage name="location.city" />
            </p>
            <p>
              <ErrorMessage name="location.state" />
            </p>
          </div>

          <div>
            <label>Age</label>
            <Field name="age" type="number" />
            <p>
              <ErrorMessage name="age" />
            </p>
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export const Slot = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className={styles.errorMessage}>
        You are not authorized to view this page.
      </div>
    );
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return (
      <div className={styles.errorMessage}>
        Invalid token. Please log in again.
      </div>
    );
  }

  const { role } = decodedToken;
  return (
    <div className={styles.slotContainer}>
      <div className={styles.roleContainer}>
        <h2>Fill Your Details</h2>
      </div>
      {role === "doctor" && <DoctorForm />}
      {role === "patient" && <PatientForm />}
    </div>
  );
};
