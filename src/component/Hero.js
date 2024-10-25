import React from "react";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./hero.module.scss";
import { Verification } from "./Verification";

export const Hero = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className={styles.hero}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          picked: "",
          specialization: "",
          verificationMethod: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = "Required";
          } else if (
            !/^(?:Dr\.?\s)?[A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/.test(
              values.name
            )
          ) {
            errors.name = "Please enter a valid full name";
          }

          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Required";
          } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
              values.password
            )
          ) {
            errors.password =
              "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
          }

          if (!values.picked) {
            errors.picked = "Please select a role";
          }

          if (values.picked === "Doctor" && !values.specialization) {
            errors.specialization = "Please select a specialization";
          }

          if (!values.verificationMethod) {
            errors.verificationMethod = "Please select a verification method";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const response = await axios.post(
              "http://localhost:8000/user/registration",
              {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.picked.toLowerCase(),
                specialization:
                  values.picked === "Doctor" ? values.specialization : null,
                verificationMethod: values.verificationMethod,
              }
            );

            if (values.verificationMethod === "otp") {
              navigate("/otp");
            } else {
              toast.success("Verification link sent to your email.");
            }
          } catch (error) {
            console.error(error);
            toast.error("Registration failed. Please try again.");
          } finally {
            resetForm();
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <h2>New here!</h2>

            {/* Name Input */}
            <div className={styles.input}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {errors.name && touched.name && (
                <div className={styles.error}>{errors.name}</div>
              )}
            </div>

            {/* Email Input */}
            <div className={styles.input}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && (
                <div className={styles.error}>{errors.email}</div>
              )}
            </div>

            {/* Role Selection */}
            <div className={styles.input}>
              <p>Role:</p>
              <div role="group" aria-labelledby="my-radio-group">
                <label>
                  <Field
                    type="radio"
                    name="picked"
                    value="Doctor"
                    className={styles.radio}
                  />
                  Doctor
                </label>
                <label>
                  <Field
                    type="radio"
                    name="picked"
                    value="Patient"
                    className={styles.radio}
                  />
                  Patient
                </label>
              </div>
              {errors.picked && touched.picked && (
                <div className={styles.error}>{errors.picked}</div>
              )}
            </div>

            {/* Specialization (Only for Doctor) */}
            {values.picked === "Doctor" && (
              <div className={styles.input}>
                <label htmlFor="specialization">Specialization:</label>
                <select
                  name="specialization"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.specialization}
                >
                  <option value="" label="Select specialization" />
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
                </select>
                {errors.specialization && touched.specialization && (
                  <div className={styles.error}>{errors.specialization}</div>
                )}
              </div>
            )}

            {/* Password Input */}
            <div className={styles.input}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && (
                <div className={styles.error}>{errors.password}</div>
              )}
            </div>
            <div className={styles.input}>
              <p>Verification Method:</p>
              <div role="group" aria-labelledby="verification-method-group">
                <label>
                  <Field
                    type="radio"
                    name="verificationMethod"
                    value="link"
                    className={styles.radio}
                  />
                  Verify using link
                </label>
                <label>
                  <Field
                    type="radio"
                    name="verificationMethod"
                    value="otp"
                    className={styles.radio}
                  />
                  Verify using OTP
                </label>
              </div>
              {errors.verificationMethod && touched.verificationMethod && (
                <div className={styles.error}>{errors.verificationMethod}</div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
