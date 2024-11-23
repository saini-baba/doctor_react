import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import style from "./appointment.module.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const Appointment = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const { doctorId, doctorName, date } = useParams();
  // const today = new Date();
  const token = localStorage.getItem("token");
  const [slot, setSlot] = useState([]);
  // const [selectedDate, setSelectedDate] = useState("");
  // const dateOptions = Array.from({ length: 5 }, (_, i) => {
  //   const date = new Date(today);
  //   date.setDate(date.getDate() + i + 1);
  //   return date.toISOString().split("T")[0];
  // });

  const validateForm = (values) => {
    const errors = {};
    if (!values.description) {
      errors.description = "Description is required";
    } else if (values.description.length > 200) {
      errors.description = "Description can't exceed 200 characters";
    }
    // if (!values.appointment_date) {
    //   errors.appointment_date = "Please select a date";
    // }
    if (!values.slot_time) {
      errors.slot_time = "Please select a slot";
    }
    if (!values.img || values.img.length === 0) {
      errors.img = "At least one image is required";
    } else if (values.img.length > 5) {
      errors.img = "You can upload up to 5 images only";
    }
    return errors;
  };

  const handleImagePreview = (files) => {
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const getSlot = (date) => {
    axios
      .get(`http://localhost:8000/user/slot/${date}/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSlot(response.data.availableSlots || []);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    getSlot(date);
  }, [doctorId, date]);

  return (
    <div className={style.appointmentForm}>
      <h2>Book an Appointment with {doctorName}</h2>
      <Formik
        initialValues={{
          description: "",
          slot_time: "",
          img: [],
        }}
        validate={validateForm}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const formData = new FormData();

          formData.append("doc_id", doctorId);
          formData.append("description", values.description);
          formData.append("time", date);
          formData.append("slot", values.slot_time);
          Array.from(values.img).forEach((file) => {
            formData.append("files", file);
          });

          axios
            .post("http://localhost:8000/patients/disease", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              toast.success(response.data.message);
              setSubmitting(false);
              setTimeout(() => {
                window.location.href = "/patient";
              }, 3000);
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
              toast.error("Failed to book appointment");
              setSubmitting(false);
            })
            .finally(() => {
              resetForm();
              setSubmitting(false);
              setImagePreviews([]);
            });
        }}
      >
        {({ setFieldValue, errors, touched }) => (
          <Form>
            <div>
              <label htmlFor="description">Description</label>
              <Field
                name="description"
                as="textarea"
                placeholder="Enter a brief description"
              />
              {errors.description && touched.description && (
                <div className={style.error}>{errors.description}</div>
              )}
            </div>

            {/* <div>
              <label htmlFor="appointment_date">Appointment Date</label>
              <Field
                name="appointment_date"
                as="input"
                type="date"
                min={dateOptions[0]}
                max={dateOptions[4]}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  setSelectedDate(selectedValue); // Update selectedDate state
                  setFieldValue("appointment_date", selectedValue);
                }}
              />
              {errors.appointment_date && touched.appointment_date && (
                <div className={style.error}>{errors.appointment_date}</div>
              )}
            </div> */}

            {date && (
              <div>
                <label htmlFor="slot_time">Slot Time</label>
                <Field name="slot_time" as="select">
                  <option value="">Select a time slot</option>
                  {slot.map((timeSlot, index) => (
                    <option key={index} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </Field>
                {errors.slot_time && touched.slot_time && (
                  <div className={style.error}>{errors.slot_time}</div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="img">Upload Images</label>
              <input
                type="file"
                name="img"
                multiple
                accept="image/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  handleImagePreview(files);
                  setFieldValue("img", files);
                }}
              />
              {errors.img && touched.img && (
                <div className={style.error}>{errors.img}</div>
              )}
            </div>

            <div className={style.imagePreviews}>
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index + 1}`} />
              ))}
            </div>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
