import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./patient.module.scss"
export const Patient = () => {
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem("token");

  // Set yesterday's date as the default selected date
  const yesterday = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 5))
    .toISOString()
    .split("T")[0];

  const [selectedDate, setSelectedDate] = useState(yesterday);

  const fetchDoctors = (date) => {
    axios
      .get(`http://localhost:8000/patients/doc-data/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setDoctors([]);
          toast.error("No doctors available");
        } else {
          toast.error("Failed to load doctors");
        }
      });
  };

  useEffect(() => {
    fetchDoctors(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className={`container  ${styles.patient}`}>
      <h2>All Doctors</h2>
      <div className={styles.date}>
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          min={yesterday}
          max={maxDate}
          onChange={handleDateChange}
        />
      </div>

      <div className={styles.doc}>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id}>
              <div>
                <p>Name: {doctor.name}</p>
                <p>Email: {doctor.email}</p>
                <p>Specialization: {doctor.specialization}</p>
                <p>No. of Appointments left: {11 - doctor.confirmedCount}</p>
              </div>
              <button>Book a Appointment</button>
            </div>
          ))
        ) : (
          <p>No doctors available for the selected date.</p>
        )}
      </div>
    </div>
  );
};
