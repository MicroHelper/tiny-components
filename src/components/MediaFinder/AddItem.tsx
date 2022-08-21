import React, { useId } from "react";
import PlusIcon from "../PlusIcon";
import styles from "./Item.module.scss";

interface Props {
  onUpload: (files: FileList | null) => void;
  accepts?: Accepts;
}

const AddItem = ({
  onUpload,
}: // accepts
Props) => {
  const inputId = useId();

  return (
    <div className={styles["add-item"]}>
      <PlusIcon
        className={styles.plus}
        size="113px"
        lineLength={`${(113 * 80) / 300}px`}
        lineWidth={`${(113 * 10) / 300}px`}
      />

      <label htmlFor={inputId} className={styles.label} />
      <input
        id={inputId}
        className={styles.input}
        // accept="image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg"
        accept="image/*"
        type="file"
        onChange={(e) => onUpload(e.target.files)}
      />
    </div>
  );
};

export default AddItem;
