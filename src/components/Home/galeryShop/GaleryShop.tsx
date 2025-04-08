"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./galeryShop.module.scss";

export default function GaleryShop() {
  return (
    <div className={styles.galeryContainer}>
      <div className={styles.left}>
        <Link className={styles.topLeft} href="/tentes">
          <div className={styles.imageContainer}>
            <Image
              src="/img/galery/tentes.png"
              alt="Tentes de réception"
              fill
              sizes="(max-width: 1400px) 100vw, 33vw"
              priority={false}
              loading="lazy"
              quality={75}
            />
            <h3>Tentes de réception</h3>
          </div>
        </Link>
        <div className={styles.bottomLeft}>
          <Link className={styles.div2} href="/la-table">
            <div className={styles.imageContainer}>
              <Image
                src="/img/galery/Vaisselle.png"
                alt="Vaisselle"
                fill
                sizes="(max-width: 1400px) 100vw, 16.5vw"
                loading="lazy"
                quality={75}
              />
              <h3>Vaisselle</h3>
            </div>
          </Link>
          <Link className={styles.div3} href="/decorations">
            <div className={styles.imageContainer}>
              <Image
                src="/img/galery/Decoration.png"
                alt="Décoration"
                fill
                sizes="(max-width: 1400px) 100vw, 16.5vw"
                loading="lazy"
                quality={75}
              />
              <h3>Décoration</h3>
            </div>
          </Link>
        </div>
      </div>

      <Link className={styles.center} href="/le-mobilier">
        <div className={styles.imageContainer}>
          <Image
            src="/img/galery/Mobilier.jpg"
            alt="Mobilier"
            fill
            sizes="(max-width: 1400px) 100vw, 33vw"
            loading="lazy"
            quality={75}
          />
          <h3>Mobilier</h3>
        </div>
      </Link>

      <div className={styles.right}>
        <Link className={styles.topRight} href="/autres-produits">
          <div className={styles.imageContainer}>
            <Image
              src="/img/galery/Sonorisation.png"
              alt="Sonorisation"
              fill
              sizes="(max-width: 1400px) 100vw, 33vw"
              loading="lazy"
              quality={75}
            />
            <h3>Sonorisation</h3>
          </div>
        </Link>
        <Link className={styles.bottomRight} href="/autres-produits">
          <div className={styles.imageContainer}>
            <Image
              src="/img/galery/Borne_a_Selfies.png"
              alt="Borne à selfies"
              fill
              sizes="(max-width: 1400px) 100vw, 33vw"
              loading="lazy"
              quality={75}
            />
            <h3>Borne à selfies</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
