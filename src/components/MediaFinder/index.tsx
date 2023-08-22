import React, { useState } from "react";
import Modal from "../Modal";
import AddItem from "./AddItem";
import Item from "./Item";
import { Accepts, Media } from "./media";
import styles from "./index.module.scss";

export interface MediaFinderProps {
  items: Array<Media>;
  getImageUrl: (fileName: string) => string;
  onSelect: (ids: Array<string | number>) => void;
  onUpload: (files: FileList | null) => void;
  onDelete: (ids: Array<string | number>) => void;
  onClose: () => void;
  accepts?: Accepts;
}

const MediaFinder = ({
  items,
  getImageUrl,
  onSelect,
  onUpload,
  onDelete,
  onClose,
  accepts,
}: MediaFinderProps) => {
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.caption}>媒体库</div>
          <div>
            <button
              className={styles["btn-default"]}
              onClick={() => {
                onDelete(selectedIds);
                setSelectedIds([]);
              }}
            >
              删除所选项
            </button>
          </div>
        </div>
        <div className={styles.main}>
          <AddItem onUpload={onUpload} accepts={accepts} />
          {items.map(({ _id, fileName }) => (
            <Item
              key={_id}
              imageUrl={getImageUrl(fileName)}
              isSelected={selectedIds.includes(_id)}
              onChange={(value) =>
                setSelectedIds(
                  value
                    ? [...selectedIds, _id]
                    : selectedIds.filter((id) => id !== _id)
                )
              }
            />
          ))}
        </div>
        <div className={styles.footer}>
          <button className={styles["btn-default"]} onClick={onClose}>
            取消
          </button>
          <button
            className={styles["btn-primary"]}
            onClick={() => onSelect(selectedIds)}
          >
            插入所选项目
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MediaFinder;
