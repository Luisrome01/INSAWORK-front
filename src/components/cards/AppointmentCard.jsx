import React from "react";
import styles from "./AppointmentCard.module.css";
import calendar from "../../assets/calendar.png";
import arrow from "../../assets/arrow-diagonal.png";

const AppointmentCard = ({ nombre, estado, fecha, onClick }) => {
  const getStatusColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "#FAD900";
      case "Completada":
        return "#00C851";
      case "Cancelada":
        return "#FF4444";
      default:
        return "#FAD900";
    }
  };

  return (
    <div className={styles.appointmentCard} onClick={onClick}>
      <div className={styles.appointmentName}>{nombre}</div>
      <div
        className={styles.appointmentStatusColor}
        style={{ backgroundColor: getStatusColor(estado) }}
      ></div>
      <div className={styles.appointmentStatus}>{estado}</div>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img src={calendar} alt="calendar" style={{ width: "11.05px", height: "11.475px" }} />
        </div>
      </div>
      <div className={styles.appointmentDate}>{fecha}</div>
      <div className={styles.rightIcon}>
        <img src={arrow} alt="arrow" style={{ width: "19.55px", height: "19.55px" }} />
      </div>
    </div>
  );
};

export default AppointmentCard;
