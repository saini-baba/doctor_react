import React from "react";
import styles from "./hero.module.scss";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
export const Hero = () => {
  return (
    <div className={styles.hero}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          picked: "",
          specialization: "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = "Required";
          } else if (
            /^(?:Dr\.?\s)?[A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/.test(
              values.name
            )
          ) {
            errors.email = "pls enter a valid fullname";
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
              "password must be at least of 8 characters and include an uppercase letter, lowercase letter, number, and special character";
          }

          if (!values.picked) {
            errors.picked = "Please select a role";
          }

          if (values.picked === "Doctor" && !values.specialization) {
            errors.specialization = "Please select a specialization";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(async () => {
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
                }
              );
              toast.success(response.data);
              console.log(response);
            } catch (error) {
              console.error(error);
              toast.error(error);
            } finally {
              resetForm();
              setSubmitting(false);
            }
          }, 400);
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

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
