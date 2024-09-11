import React from "react";
import styles from "./PatientCard.module.css";
import company from "../../assets/company.png";
import arrow from "../../assets/arrow-diagonal.png";

const PatientCard = ({ nombre, cedula, photo, companyName, onClick }) => {
  return (
    <div className={styles.patientCard} onClick={onClick}>
      <div className={styles.patientPhoto}>
        <img className={styles.photo} src={photo} alt="patient" />
      </div>
      <div className={styles.patientName}>{nombre}</div>
      <div className={styles.patientStatus}>{cedula}</div>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img src={company} alt="company" style={{ width: "14px", height: "14px" }} />
        </div>
      </div>
      <div className={styles.patientDate}>{companyName}</div>
      <div className={styles.rightIcon}>
        <img src={arrow} alt="arrow" style={{ width: "19.55px", height: "19.55px" }} />
      </div>
    </div>
  );
};

export default PatientCard;
