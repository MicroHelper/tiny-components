import React, { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Main.module.scss";

type IdType = string | number;

interface Props<ItemId extends IdType> {
  title?: string;
  itemIds: Array<ItemId>;
  renderItem: (id: ItemId) => ReactNode;
  onSelect: (id: ItemId) => void;
  onCreate: () => void;
  onRemove: (id: ItemId) => void;
  currentId?: ItemId;
  className?: string;
}

const Main = <ItemKey extends IdType = string>({
  title,
  itemIds,
  renderItem,
  onSelect,
  onCreate,
  onRemove,
  currentId,
  className,
}: Props<ItemKey>) => {
  return (
    <div className={clsx(styles.main, className)}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button onClick={onCreate}>新增</button>
      </div>
      {itemIds?.length ? (
        <ul className={styles.content}>
          {itemIds.map((id) => (
            <li
              key={id}
              onClick={() => onSelect(id)}
              className={id === currentId ? styles.active : undefined}
            >
              {renderItem(id)}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  onRemove(id);
                }}
                className={styles.remove}
                role="img"
                aria-label="remove"
              >
                ❌
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>暂无数据</div>
      )}
    </div>
  );
};

export default Main;
