"use client";

import Link from "next/link";
import styles from "./galeryShop.module.scss";

export default function GaleryShop() {
  return (
    <div className={styles.galeryContainer}>
      <div className={styles.left}>
          <Link className={styles.topLeft}  href="/tentes">
        <div className={styles.div1}>
            <h3 >Tentes de réception</h3>
        </div>
          </Link>
        <div className={styles.bottomLeft}>
          <Link className={styles.div2} href="/la-table">
            <h3 >Vaisselle</h3>
          </Link>
          <Link className={styles.div3} href="/decorations">
            <h3 >Décoration</h3>
          </Link>
        </div>
      </div>

        <Link className={styles.center} href="/le-mobilier">
      <div className={styles.div4}>
          <h3 >Mobilier</h3>
      </div>
        </Link>

      <div className={styles.right}>
        <Link className={styles.topRight} href="/autres-produits">
          <h3 >Sonorisation</h3>
        </Link>
        <Link className={styles.bottomRight} href="/autres-produits">
          <h3 >Borne à selfies</h3>
        </Link>
      </div>
    </div>
  );
}
