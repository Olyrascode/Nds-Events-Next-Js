"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./_TentesPliantes.scss";

function TentesPliantes() {
  const images = [
    "/img/tentespliantes/tente-reception.jpg",
    "/img/tentespliantes/tente-pliante-reception.jpg",
    "/img/tentespliantes/tente-de-reception-sans-cote.jpg",
    "/img/tentespliantes/pagodes-reception.jpg",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="sectionContainer">
      <div className="tentesHeader">
        <h1>TENTES PLIANTES</h1>
        <p>
          Découvrez notre sélection de tentes pliantes pour tous vos événements
          en extérieur.
        </p>
      </div>
      <div className="carrouselContainer">
        <div className="carrousel">
          <button onClick={prevImage} className="carrousel-button left">
            ←
          </button>
          <Image
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            width={600}
            height={400}
          />
          <button onClick={nextImage} className="carrousel-button right">
            →
          </button>
        </div>
        <div className="asideContainer">
          <h3>Nos Tailles</h3>
          <ul>
            <li>3x3m | 9m²</li>
            <li>4x4m | 16m²</li>
            <li>3x6m | 18m²</li>
            <li>4x6m | 24m²</li>
            <li>4x8m | 32m²</li>
          </ul>
        </div>
      </div>

      <div className="bottomContainer">
        <h3>Les caractéristiques principales de nos tentes pliantes</h3>
        <div>
          <ul>
            <li>Taille allant de 9m² à 32m²</li>
            <li>Prix allant de 65€ à 225€</li>
            <li>Possibilité de location avec ou sans côtés</li>
            <li>Avec ou sans installation</li>
            <li>Possibilité de pose d&apos;un chauffage soufflant</li>
          </ul>
        </div>
        <section>
          <div className="choiceContainer">
            <div className="choix1">
              <h3>Une question ?</h3>

              <button>
                <a href="/contact">Contactez nous</a>
              </button>
            </div>
            <div className="choix2">
              <h3>Vous voulez réserver ?</h3>

              <button>Demander un devis</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TentesPliantes;
