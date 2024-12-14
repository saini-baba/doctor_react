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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Doctor = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Accepted");
  const [filterDate, setFilterDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0]
  );
  const [slot, setSlot] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [edit, setEdit] = useState({});
  const [currentDiseaseId, setCurrentDiseaseId] = useState(null);
  const [toggle, setToggle] = useState(true);
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

  const updateDateAndFetchData = () => {
    const currentDate = new Date();
    let minDate, maxDate;

    if (status === "Accepted" || status === "Pending") {
      minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      maxDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
      setFilterDate(minDate.toISOString().split("T")[0]);
    } else if (status === "Confirmed") {
      minDate = new Date();
      maxDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
      setFilterDate(minDate.toISOString().split("T")[0]);
      // setToggle((prevToggle) => !prevToggle);
    } else if (status === "Completed") {
      minDate = null;
      maxDate = new Date();
      setFilterDate(maxDate.toISOString().split("T")[0]);
      // setToggle((prevToggle) => !prevToggle);
    } else if (status === "Cancelled") {
      const today = new Date();
      minDate = null;
      maxDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
      setFilterDate(today.toISOString().split("T")[0]);
      // setToggle((prevToggle) => !prevToggle);
    }
    setToggle((prevToggle) => !prevToggle);
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
  }, [toggle, filterDate]);

  const getslot = () => {
    axios
      .get(`http://localhost:8000/user/slot/${filterDate}/null`, {
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

  const handleEditClick = (diseaseId, currentSlot) => {
    setEdit((prev) => ({
      ...prev,
      [diseaseId]: true,
    }));
    setCurrentDiseaseId(diseaseId);
    // console.log("id", currentDiseaseId);

    setSelectedSlot(currentSlot);
  };

  const handleConfirmBooking = (id, slot) => {
    console.log("id:" + id, "slot:" + slot);

    axios
      .patch(
        `http://localhost:8000/user/confirm`,
        {
          id: id,
          slot: slot,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        toast.success("Booking confirmed!");
        setEdit(true);
        getdata();
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
        toast.error("Failed to confirm booking");
      });
  };

  const handleCloseClick = (diseaseId) => {
    setEdit((prev) => ({
      ...prev,
      [diseaseId]: false,
    }));
  };

  const handleCancelClick = (diseaseId) => {
    const reason = window.prompt("Please provide a reason for cancellation:");

    if (reason) {
      // Show confirm and close options
      const confirmCancel = window.confirm(
        "Do you want to cancel this appointment?"
      );

      if (confirmCancel) {
        // Call the API to update the disease status to "Cancelled" and log the reason
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
      .then((response) => {
        toast.success("Appointment Cancelled!");
        getdata();
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
        toast.error("Failed to cancel appointment");
      });
  };
  const validationSchema = Yup.object({
    prescription: Yup.string()
      .required("Prescription is required")
      .min(10, "Prescription should be at least 10 characters long"),
    next_appointment_date: Yup.date().min(
      new Date(),
      "Date cannot be in the past"
    ),
  });
  const handleSubmit = async (values, diseaseId) => {
    console.log("Form values:", values);
    console.log("Disease ID:", diseaseId);
    try {
      const response = await axios.patch(
        "http://localhost:8000/doctor/complete",
        {
          prescription: values.prescription,
          next_appointment_date: values.next_appointment_date,
          id: diseaseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className={`container ${styles.doctorContainer}`}>
      <div className={styles.filterContainer}>
        <p>Filter Patient:</p>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>

          <option value="Cancelled">Cancelled</option>
        </select>

        <label>
          Select Date:
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (selectedDate.getDay() === 0) {
                toast.error(
                  "Sunday is not selectable. Please choose another date."
                );
                e.target.value = filterDate;
              } else {
                setFilterDate(e.target.value);
              }
            }}
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
                {status === "Cancelled" &&
                  disease.CancellationReason?.reason && (
                    <p>{disease.CancellationReason.reason}</p>
                  )}
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
                  {status === "Accepted" &&
                    !slot.includes(disease.slot_time) && (
                      <p style={{ color: "red" }}>This slot is not free</p>
                    )}
                </div>

                {disease.description && (
                  <p>Description: {disease.description}</p>
                )}
                {status === "Confirmed" && (
                  <>
                    <Formik
                      initialValues={{
                        prescription: "",
                        next_appointment_date: "",
                      }}
                      validationSchema={validationSchema}
                      onSubmit={(values) => handleSubmit(values, disease.id)}
                    >
                      {({ handleSubmit }) => (
                        <>
                          {/* Form Fields */}
                          <Form id="prescriptionForm">
                            <div>
                              <label htmlFor="prescription">
                                Prescription:
                              </label>
                              <Field
                                as="textarea"
                                id="prescription"
                                name="prescription"
                                rows="4"
                                placeholder="Enter prescription details"
                              />
                              <ErrorMessage
                                name="prescription"
                                component="div"
                                className="error"
                              />
                            </div>
                            <div>
                              <label htmlFor="next_appointment_date">
                                Next Appointment Date:
                              </label>
                              <Field
                                type="date"
                                id="next_appointment_date"
                                name="next_appointment_date"
                              />
                              <ErrorMessage
                                name="next_appointment_date"
                                component="div"
                                className="error"
                              />
                            </div>
                          </Form>
                        </>
                      )}
                    </Formik>
                  </>
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
                  {new Date(disease.createdAt).toLocaleDateString("en-IN", {
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
                {status === "Confirmed" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById("prescriptionForm")
                          .dispatchEvent(
                            new Event("submit", {
                              cancelable: true,
                              bubbles: true,
                            })
                          );
                      }}
                    >
                      Submit
                    </button>
                  </>
                )}

                {status === "Accepted" && (
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

                        <button
                          onClick={() =>
                            handleConfirmBooking(disease.id, disease.slot_time)
                          }
                        >
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
                        <button
                          onClick={() =>
                            handleConfirmBooking(disease.id, disease.slot_time)
                          }
                        >
                          Confirm Booking
                        </button>
                        <button onClick={() => handleCancelClick(disease.id)}>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
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
