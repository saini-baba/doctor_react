import { React, useState, useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./otp.module.scss";

export const Otp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    if (!state || !state.user_id) {
      navigate("/", { replace: true }); 
    } else {
      if (timer > 0) {
        const countdown = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(countdown);
      }
    }
  }, [timer, state, navigate]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/user/${state?.user_id}/verifyOpt`
      );
      if (response.status === 200) {
        toast.success("OTP resent successfully");
        setTimer(300);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.otp) {
        errors.otp = "OTP is required";
      } else if (values.otp.length !== 4 || !/^\d{4}$/.test(values.otp)) {
        errors.otp = "OTP must be exactly 4 digits";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/user/verifyOtp",
          {
            user_id: state?.user_id,
            otp: values.otp,
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong");
        } else {
          toast.error("Network error");
        }
      }
    },
  });

  return (
    <div className={styles.form}>
      <div>
        <h2>Enter OTP</h2>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <input
              type="text"
              name="otp"
              maxLength="4"
              placeholder="Enter OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.otp && formik.errors.otp ? (
              <div>{formik.errors.otp}</div>
            ) : null}
          </div>
          <button type="submit">Submit</button>
        </form>

        <div>
          <p>Time remaining: {formatTime(timer)}</p>
        </div>

        <button onClick={resendOtp} disabled={timer > 0}>
          Resend OTP
        </button>
      </div>
    </div>
  );
};
