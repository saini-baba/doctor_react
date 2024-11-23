import { React, useState } from "react";
import styles from "./login.module.scss";
import Modal from "react-modal";
import axios from "axios";
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
              errors.password = "Password is required";
            } else if (
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
                values.password
              )
            ) {
              errors.password =
                "Password must include uppercase, lowercase, number, and special character";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            axios
              .post(`http://localhost:8000/user/login`, {
                email: values.email,
                password: values.password,
              })
              .then(async (response) => {
                setModalIsOpen(false);
                const { token, role, data, verification } = response.data;
                localStorage.setItem("token", token);
                if (token) {
                  if (role === "admin") {
                    return navigate(`/admin`, {
                      replace: true,
                    });
                  }
                  if (role === "doctor") {
                    if (!data) {
                      // console.log("iam here");

                      return navigate(`/user/data/${role}`, {
                        replace: true,
                      });
                    }

                    if (
                      verification === "under process" ||
                      verification === "rejected"
                    ) {
                      return navigate(`/doctor/verification/${verification}`, {
                        replace: true,
                      });
                    }

                    return navigate(`/doctor`, {
                      replace: true,
                    });
                  }

                  if (role === "patient") {
                    if (!data) {
                      console.log("iam here");
                      return navigate(`/user/data/${role}`, {
                        replace: true,
                      });
                    }
                    return navigate(`/patient`, {
                      replace: true,
                    });
                  }
                }
              })
              .catch(async (error) => {
                if (error.response.status === 403) {
                  setModalIsOpen(false);
                  toast.error("Your account is not verified.");
                  try {
                    await axios.post(
                      `http://localhost:8000/user/${error.response.data.user_id}/verify`
                    );
                    toast.success(
                      "Verification link sent to your email. Please check your inbox.",
                      {
                        duration: 5000,
                      }
                    );
                  } catch (emailError) {
                    console.error(
                      "Error sending verification email:",
                      emailError
                    );
                    toast.error(
                      "Verification link could not be sent. Please try again later."
                    );
                  }
                } else {
                  if (error.response && error.response.status === 404) {
                    setModalIsOpen(false);
                    if (
                      error.response.data.message ===
                      "No slot data found for the doctor."
                    ) {
                      toast.error(
                        "No slot data found for the doctor. Redirecting to slot page."
                      );
                      setTimeout(() => {
                        navigate(`/slot/${error.response.data.user_id}`);
                      }, 3000);
                    } else {
                      toast.error("Invalid credentials");
                    }
                  } else {
                    toast.error(
                      "An error occurred during login. Please try again."
                    );
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
