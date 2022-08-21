import React from "react";
import clsx from "clsx";
import styles from "./Item.module.scss";

export interface Props {
  imageUrl: string;
  isSelected?: boolean;
  onChange: (value: boolean) => void;
}

const Item = ({ imageUrl, isSelected, onChange }: Props) => {
  return (
    <div
      className={clsx(styles.item, isSelected && styles.selected)}
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={() => onChange(!isSelected)}
    ></div>
  );
};

export default Item;
