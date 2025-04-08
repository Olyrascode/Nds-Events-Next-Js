"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./heroBanner.module.scss"; // Vérifie que ton fichier CSS existe

export default function HeroBanner() {
  return (
    <div className={styles.homeHero}>
      <div className={styles.heroBanner}>
        <h1 className={styles.homeTitle}>
          <span className={styles.srOnly}>NDS Events</span>
          <Image
            src="/img/home/logoHomePage.png"
            alt=""
            width={500}
            height={200}
            priority
            fetchPriority="high"
            quality={90}
            className={styles.logoImage}
            aria-hidden="true"
          />
        </h1>

        <h2 className={styles.homeSubtitle}>
          Votre référence en location évènementielle
        </h2>

        <Link href="/tous-nos-produits" className={styles.ctaLink}>
          <button className={styles.homeCta}>Découvrez notre boutique</button>
        </Link>
      </div>
    </div>
  );
}
