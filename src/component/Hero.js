import React from "react";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./hero.module.scss";

export const Hero = () => {
  const navigate = useNavigate();
  const indianStates = [
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
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Andaman & Nicobar Islands",
    "Chandigarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Lakshadweep",
    "Puducherry",
  ];

  return (
    <div className={styles.hero}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          picked: "",
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
          if (!values.verificationMethod) {
            errors.verificationMethod = "Please select a verification method";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            console.log(values);

            const response = await axios.post(
              "http://localhost:8000/user/registration",
              {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.picked.toLowerCase(),
              }
            );
            console.log("Server Response:", response);
            if (values.verificationMethod === "otp") {
              try {
                await axios.post(
                  `http://localhost:8000/user/${response.data.user_id}/verifyOpt`
                );
                toast.success("OTP sent to your email.");
                setTimeout(() => {
                  navigate("/otp", {
                    state: { user_id: response.data.user_id },
                  });
                }, 3000);
              } catch (error) {
                console.error("Error sending OTP:", error);
                toast.error("Failed to send OTP. Please try again.");
              }
            } else {
              try {
                await axios.post(
                  `http://localhost:8000/user/${response.data.user_id}/verify`
                );
                toast.success(
                  "Registration successful and verification link sent to your email."
                );
              } catch (emailError) {
                console.error("Error sending verification email:", emailError);
                toast.error(
                  "Registration successful, but failed to send verification email. Please try again."
                );
              }
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
           

            <div>
              <div className={styles.input}>
                <p>Who are you:</p>
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
              
            </div>


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
