import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./doctor.module.scss";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

export const Doctor = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Accepted");
  const [filterDate, setFilterDate] = useState("");
  const [slot, setSlot] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [edit, setEdit] = useState({});
  const [currentDiseaseId, setCurrentDiseaseId] = useState(null);

  const token = localStorage.getItem("token");
  const galleryRefs = useRef({});

  const getdata = () => {
    axios
      .get(`http://localhost:8000/doctor/disease/${status}/${filterDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data.diseases);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setData(null);
          toast.error("No data");
        } else {
          toast.error("Failed to load data");
        }
      });
  };

  const updateDateAndFetchData = async () => {
    const currentDate = new Date();
    let minDate, maxDate;

    if (status === "Accepted") {
      minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      maxDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
      setFilterDate(minDate.toISOString().split("T")[0]);
    } else if (status === "Confirmed") {
      minDate = new Date();
      maxDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
      setFilterDate(minDate.toISOString().split("T")[0]);
    } else if (status === "Completed") {
      minDate = null;
      maxDate = new Date();
      setFilterDate(maxDate.toISOString().split("T")[0]);
    }

    const dateInput = document.getElementById("filterDate");
    if (dateInput) {
      dateInput.min = minDate ? minDate.toISOString().split("T")[0] : "";
      dateInput.max = maxDate ? maxDate.toISOString().split("T")[0] : "";
    }
  };

  useEffect(() => {
    updateDateAndFetchData();
  }, [status, token]);

  useEffect(() => {
    if (status === "Accepted") {
      getslot();
    }
    if (filterDate) {
      getdata();
    }
  }, [filterDate]);

  const getslot = () => {
    axios
      .get(`http://localhost:8000/doctor/slot/${filterDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSlot(response.data.availableSlots);
        const availableSlots = response.data.availableSlots;
        availableSlots.forEach((slot) => {
          setEdit((prev) => ({
            ...prev,
            [slot.id]: true,
          }));
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  // Handle Edit button click
  const handleEditClick = (diseaseId, currentSlot) => {
    setEdit((prev) => ({
      ...prev,
      [diseaseId]: true, // Set the selected disease to edit mode
    }));
    setCurrentDiseaseId(diseaseId);
    setSelectedSlot(currentSlot);
  };

  // Handle Confirm booking button
  const handleConfirmBooking = () => {
    // Confirm booking logic (e.g., update the slot for the disease)
    axios
      .put(
        `http://localhost:8000/doctor/disease/${currentDiseaseId}`,
        { slot_time: selectedSlot },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        toast.success("Booking confirmed!");
        setEdit(true); // Hide select and show Edit button again
        getdata(); // Refresh data
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
        toast.error("Failed to confirm booking");
      });
  };

  // Handle Close button click
  const handleCloseClick = (diseaseId) => {
    setEdit((prev) => ({
      ...prev,
      [diseaseId]: false, // Set the selected disease to edit mode
    })); // Show Edit button again
  };

  return (
    <div className={`container ${styles.doctorContainer}`}>
      <div className={styles.filterContainer}>
        <p>Filter Patient:</p>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Accepted">Accepted</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
        </select>

        <label>
          Select Date:
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.dataContainer}>
        {data ? (
          data.map((disease) => (
            <div key={disease.id} className={styles.diseaseCard}>
              <div>
                <p>Doctor: {disease.Doctor.name}</p>
                <p>Patient: {disease.Patient.name}</p>
                <p>Status: {disease.status}</p>
                <p>
                  Appointment on:{" "}
                  {new Date(disease.appointment_date).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "Asia/Kolkata",
                    }
                  )}
                </p>
                <div>
                  <p>Slot: {disease.slot_time}</p>
                </div>

                {disease.description && (
                  <p>Description: {disease.description}</p>
                )}
              </div>

              {disease.img && disease.img.length > 0 ? (
                <LightGallery
                  plugins={[lgThumbnail, lgZoom, lgVideo]}
                  elementClassNames={styles.imageGallery}
                >
                  {JSON.parse(disease.img).map((imgPath, index) => {
                    const imageUrl = `http://localhost:8000/${imgPath}`;
                    return (
                      <a
                        key={index}
                        href={imageUrl}
                        data-sub-html={`<h4>Disease Image ${index + 1}</h4>`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Disease image ${index + 1}`}
                          className={styles.diseaseImage}
                        />
                      </a>
                    );
                  })}
                </LightGallery>
              ) : (
                <p>No images available</p>
              )}

              <div className={styles.button}>
                <p>
                  Booked on:{" "}
                  {new Date(disease.updatedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Kolkata",
                  })}{" "}
                  at{" "}
                  {new Date(disease.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <div>
                  {edit[disease.id] ? (
                    <>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a new slot
                        </option>
                        {slot.map((slotTime, index) => (
                          <option key={index} value={slotTime}>
                            {slotTime}
                          </option>
                        ))}
                      </select>
                      <button onClick={handleConfirmBooking}>
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => {
                          handleCloseClick(disease.id);
                        }}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleEditClick(disease.id, disease.slot_time)
                        }
                      >
                        Edit Slot
                      </button>
                      <button>Confirm</button>
                      <button>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.nodata}>
            <p>No data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};
