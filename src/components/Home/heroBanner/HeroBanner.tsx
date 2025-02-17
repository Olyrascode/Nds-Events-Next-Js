"use client";

import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import styles from './heroBanner.module.scss'; // Vérifie que ton fichier CSS existe

export default function HeroBanner() {
  return (
    <div className={styles.homeHero}>
      <div className={styles.heroLocation}>
        <p>Location de matériels de réception en Rhône-Alpes</p>
      </div>

      <div className={styles.heroBanner}>
      <h2 className={styles.homeTitle}>
  <Image
    src="/img/home/logoHomePage.png"
    alt="Logo"
    width={500}
    height={200}
    layout="responsive"
  />
</h2>
        
        <h3 className={styles.homeSubtitle}>
          Votre référence en location évènementielle
        </h3>

        <Link href="/products">
          <button className={styles.homeCta}>Découvrez notre boutique</button>
        </Link>
      </div>
    </div>
  );
}
