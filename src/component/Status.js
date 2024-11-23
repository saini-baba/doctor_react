import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./status.module.scss";

export const Status = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Accepted");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const token = localStorage.getItem("token");

  const fetchData = () => {
    axios
      .get(`http://localhost:8000/patients/dis-data/${filterDate}/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data.diseases);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setData(null);
          toast.error("No data available for the selected date and status.");
        } else {
          toast.error("Failed to fetch data.");
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [status, filterDate]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const selectedDay = new Date(newDate).getDay(); // 0 = Sunday
    if (selectedDay === 0) {
      toast.error("Sunday is not selectable. Please choose another date.");
      return;
    }
    setFilterDate(newDate);
  };

  const calculateDateRange = () => {
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate() + 5); // Next 5 days
    return {
      minDate: currentDate.toISOString().split("T")[0],
      maxDate: maxDate.toISOString().split("T")[0],
    };
  };

  const { minDate, maxDate } = calculateDateRange();

  const handleCancelClick = (diseaseId) => {
    const reason = window.prompt("Please provide a reason for cancellation:");
    if (reason) {
      const confirmCancel = window.confirm(
        "Do you want to cancel this appointment?"
      );
      if (confirmCancel) {
        cancelDisease(diseaseId, reason);
      }
    }
  };

  const cancelDisease = (diseaseId, reason) => {
    axios
      .patch(
        `http://localhost:8000/user/cancel`,
        {
          id: diseaseId,
          reason: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Appointment Cancelled!");
        fetchData();
      })
      .catch(() => {
        toast.error("Failed to cancel appointment.");
      });
  };

  const handleConfirmBooking = (currentDiseaseId) => {
    axios
      .patch(
        `http://localhost:8000/user/confirm`,
        { id: currentDiseaseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Booking confirmed!");
        fetchData();
      })
      .catch(() => {
        toast.error("Failed to confirm booking.");
      });
  };

  return (
    <div className={styles.container}>
      <div className={`container ${styles.statusContainer}`}>
        <div className={styles.filterContainer}>
          <p>Filter Appointments:</p>

          <div>
            <label>Status:</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className={styles.dropdown}
            >
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label>Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.dataContainer}>
          {data ? (
            data.map((disease) => (
              <div key={disease.id} className={styles.diseaseCard}>
                <p>Doctor: {disease.Doctor.name}</p>
                <p>Status: {disease.status}</p>
                <p>
                  Appointment Date:{" "}
                  {new Date(disease.appointment_date).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p>Slot: {disease.slot_time}</p>
                <p>
                  Booked on:{" "}
                  {new Date(disease.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(disease.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p>Description: {disease.description || "N/A"}</p>

                {disease.status === "Pending" && (
                  <p className={styles.pendingExplanation}>
                    The doctor has changed the slot for this appointment. Please
                    confirm the new time to proceed with the appointment.
                  </p>
                )}

                <div className={styles.actionButtons}>
                  {disease.status === "Accepted" && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleCancelClick(disease.id)}
                    >
                      Cancel
                    </button>
                  )}
                  {disease.status === "Pending" && (
                    <>
                      <button
                        className={styles.confirmButton}
                        onClick={() => handleConfirmBooking(disease.id)}
                      >
                        Confirm
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancelClick(disease.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
