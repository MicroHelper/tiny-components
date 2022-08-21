import React, { CSSProperties } from "react";
import clsx from "clsx";
import styles from "./PlusIcon.module.scss";

export interface Props {
  className?: string;
  style?: CSSProperties;
  size?: string;
  lineWidth?: string;
  lineLength?: string;
}

/** 显示一个加号图标 */
const PlusIcon = ({ className, style, size, lineWidth, lineLength }: Props) => {
  const innerStyle = {
    "--size": size,
    "--line-width": lineWidth,
    "--line-length": lineLength,
  };

  return (
    <div
      className={clsx(styles["plus-icon"], className)}
      style={{ ...style, ...innerStyle }}
    ></div>
  );
};

export default PlusIcon;
