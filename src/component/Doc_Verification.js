import React from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./dov_verification.module.scss"
export const Doc_Verification = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <p className="error-message">No token found. Please log in.</p>;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    return <p className="error-message">Invalid token. Please log in again.</p>;
  }

  const { doc_verification } = decodedToken;

  return (
    <div className={styles.verificationstatus}>
      {doc_verification === "under process" && (
        <p className={styles.infomessage}>
          Your verification is under process.
        </p>
      )}
      {doc_verification === "rejected" && (
        <p className={styles.errormessage}>
          Your verification was rejected.
        </p>
      )}
    </div>
  );
};
