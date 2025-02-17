"use client";

import styles from "./galeryShop.module.scss";

export default function GaleryShop() {
  return (
    <div className={styles.galeryContainer}>
      <div className={styles.left}>
        <div className={styles.topLeft}>
          <div className={styles.div1}>Tentes de réception</div>
        </div>
        <div className={styles.bottomLeft}>
          <div className={styles.div2}>Vaisselle</div>
          <div className={styles.div3}>Décoration</div>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.div4}>Mobilier</div>
      </div>
      <div className={styles.right}>
        <div className={styles.topRight}>Sonorisation</div>
        <div className={styles.bottomRight}>Borne à selfies</div>
      </div>
    </div>
  );
}
