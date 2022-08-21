import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

const crossmarkUnicode = "\u2715";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  containerId?: string;
}

/**
 * 对话框
 *
 * 默认容器id为root
 * 对话框打开时，会在body上添加no-scroll的类，需要在样式表另外定义
 */
const Modal = ({ isOpen, onClose, children, containerId }: ModalProps) => {
  const containerEl = document.getElementById(containerId || "root");

  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  if (!isOpen || !containerEl) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles["btn-close"]}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          {crossmarkUnicode}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    containerEl
  );
};

export default Modal;
