"use client";

import Image from "next/image";
import styles from "./partners.module.scss";

export default function Partners() {
  return (
    <div className={styles.partnersContainer}>
      <h2>Ils nous ont fait confiance</h2>

      <div className={styles.partnersLogoTop}>
        <ul>
          <li>
            <Image
              src="/img/partners/edfLogo.webp"
              alt="EDF"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/ceaLogo.webp"
              alt="CEA"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/alstomLogo.webp"
              alt="Alstom"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/actisLogo.webp"
              alt="Actis"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/societeGeneraleLogo.webp"
              alt="Société Générale"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
        </ul>
      </div>

      <div className={styles.partnersLogoBottom}>
        <ul>
          <li>
            <Image
              src="/img/partners/hpLogo.webp"
              alt="HP"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/IkeaLogo.webp"
              alt="Ikea"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/schneiderLogo.webp"
              alt="Schneider"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
          <li>
            <Image
              src="/img/partners/laTroncheLogo.webp"
              alt="La Tronche"
              width={100}
              height={50}
              style={{ width: "100%", height: "auto" }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
