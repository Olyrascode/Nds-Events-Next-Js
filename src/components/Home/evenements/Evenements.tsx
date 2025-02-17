"use client";

import styles from "./evenements.module.scss"; // Fichier SCSS modulaire

export default function Evenements() {
  return (
    <div className={styles.evenementsContainer}>
      <h2>Nos événements</h2>

      <div className={styles.evenementsCardContainer}>
        {/* Carte 1 */}
        <div className={styles.card1}>
          <div className={styles.backgroundFilter}>
            <h3>Événement institutionnel</h3>
            <hr />
            <div className={styles.itemContainer}>
              <div className={styles.leftItem}>
                <ul>
                  <li>Lancement de produit</li>
                  <li>Inauguration de boutique</li>
                  <li>Conférence & Meetings</li>
                  <li>Team Building</li>
                </ul>
              </div>
              <div className={styles.rightItem}>
                <ul>
                  <li>Fête de fin d&apos;année</li>
                  <li>Gala Caritatif</li>
                  <li>Cérémonie de remise de prix</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Carte 2 */}
        <div className={styles.card2}>
          <div className={styles.backgroundFilter}>
            <h3>Événement institutionnel</h3>
            <hr />
            <div className={styles.itemContainer}>
              <div className={styles.leftItem}>
                <ul>
                  <li>Lancement de produit</li>
                  <li>Inauguration de boutique</li>
                  <li>Conférence & Meetings</li>
                  <li>Team Building</li>
                </ul>
              </div>
              <div className={styles.rightItem}>
                <ul>
                  <li>Fête de fin d&apos;année</li>
                  <li>Gala Caritatif</li>
                  <li>Cérémonie de remise de prix</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Carte 3 */}
        <div className={styles.card3}>
          <div className={styles.backgroundFilter}>
            <h3>Événement institutionnel</h3>
            <hr />
            <div className={styles.itemContainer}>
              <div className={styles.leftItem}>
                <ul>
                  <li>Lancement de produit</li>
                  <li>Inauguration de boutique</li>
                  <li>Conférence & Meetings</li>
                  <li>Team Building</li>
                </ul>
              </div>
              <div className={styles.rightItem}>
                <ul>
                  <li>Fête de fin d&apos;année</li>
                  <li>Gala Caritatif</li>
                  <li>Cérémonie de remise de prix</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
