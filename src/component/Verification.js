import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./verification.module.scss";
export const Verification = () => {
  const { user_id, token } = useParams();
  const [isVerified, setIsVerified] = useState(null);
  const navigate = useNavigate();
  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/user/${user_id}/verify/${token}`
      );
      setIsVerified(true);
      setTimeout(() => navigate("/"), 5000);
    } catch (error) {
      setIsVerified(false);
      console.error("verification failed:", error);
    }
  };
  useEffect(() => {
    verifyEmail();
  }, [user_id, token, navigate]);

  if (isVerified === null) {
    return (
      <div>
        <img src="load.gif" alt="verifying" />
        <p>verifying your email...</p>
      </div>
    );
  }

  return (
    <div>
      {isVerified ? (
        <div className={styles.verification}>
          <img
            src="https://cdn-icons-png.flaticon.com/256/7595/7595571.png"
            alt="successfully"
          />
          <p>Your email has been successfully verified!</p>
        </div>
      ) : (
        <div className={styles.verification}>
          <img
            src="https://w7.pngwing.com/pngs/833/287/png-transparent-check-mark-international-red-cross-and-red-crescent-movement-american-red-cross-red-cross-mark-round-red-x-logo-miscellaneous-text-logo.png"
            alt="failed"
          />
          <p>Verification failed. Please try again.</p>
        </div>
      )}
    </div>
  );
};
