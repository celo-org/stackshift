import React from "react";
import styles from "./Coin.module.scss";

export default function Coin({ isHead }: { isHead: boolean }) {
  return (
    <div className={styles.purse}>
      <div
        className={[styles.coin, isHead ? styles.isHead : styles.isTail].join(
          " "
        )}
      >
        <div className={styles.front}></div>
        <div className={styles.back}></div>
        <div className={styles.side}>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
          <div className={styles.spoke}></div>
        </div>
      </div>
    </div>
  );
}
