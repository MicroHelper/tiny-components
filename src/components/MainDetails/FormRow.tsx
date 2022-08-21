import React, { ReactNode } from "react";
import styles from "./FormRow.module.scss";

interface Props {
  label?: ReactNode;
  control?: ReactNode;
  error?: ReactNode;
}

const FormRow = ({ label, control, error }: Props) => {
  return (
    <div className={styles["form-row"]}>
      <div className={styles.label}>{label}</div>
      <div className={styles.content}>
        {typeof control === "string" ? (
          <div className={styles.text}> {control}</div>
        ) : (
          control
        )}
        {error && (
          <div className={styles.text}>
            <div className={styles.error}>{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormRow;
