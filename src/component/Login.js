import { React, useState } from "react";
import styles from "./login.module.scss";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { Formik, Field, Form } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export const Login = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.main}>
      
      <button
        onClick={() => {
          setModalIsOpen(true);
          props.toggle();
        }}
      >
        Login
      </button>
      <Modal
        className={`container ${styles.form}`}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        bodyOpenClassName={styles.modal_open}
      >
        <button className={styles.button} onClick={() => setModalIsOpen(false)}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Email is required";
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
                "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            axios
              .get(
                `http://localhost:8000/user/login/${values.email}/${values.password}`
              )
              .then(function (response) {
                // toast.success("Login successful");
                console.log(response);
                setModalIsOpen(false);
                const { token, role } = response.data;
                if (token) {
                  localStorage.setItem("token", token);
                  if (role === "doctor") {
                    navigate("/doctor");
                  } else if (role === "patient") {
                    navigate("/patient");
                  }
                }
              })
              .catch((error) => {
                if (error instanceof AxiosError) {
                  if (error.response && error.response.status === 404) {
                    toast.error("Invalid credentials");
                  } else {
                    toast.error("Error during login:", error);
                  }
                }
              })
              .finally(() => {
                resetForm();
                setSubmitting(false);
              });
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={styles.content}>
              <h2>Login</h2>
              <div className={styles.input}>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={styles.field}
                />
                {errors.email && touched.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>
              <div className={styles.input}>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={styles.field}
                />
                {errors.password && touched.password && (
                  <div className={styles.error}>{errors.password}</div>
                )}
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
      <Toaster />
    </div>
  );
};
