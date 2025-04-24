"use client";
import styles from "./anniv-widget.module.scss";
import Plus from "@/shared/svgs/plus.svg";

export default function AnnivWidget() {
  return (
    <div className={styles.emptyContainer}>
      <Plus />
    </div>
  );
}
