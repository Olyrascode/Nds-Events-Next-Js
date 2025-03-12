"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import "../tentes-de-receptions/_TentesDeReceptions.scss";

function Pagodes() {
  const imagesCarrousel1 = [
    '/img/tentespliantes/pagodes-reception.jpg',
    '/img/pagodes/pagodes-reception-grenoble.webp',
    '/img/pagodes/pagode-reception-grenoble.webp',
  ];
  const imagesCarrousel2 = [
    { 
      src: '/img/tentesReceptions/optionsCarrousel/chauffage-tente-reception.webp',
      caption: 'Chauffage pour tente de réception'
    },
    { 
      src: '/img/tentesReceptions/optionsCarrousel/choix-couleurs-moquette-1.webp',
      caption: 'Moquette de couleur pour personnalisation'
    },
    { 
      src: '/img/tentesReceptions/optionsCarrousel/lumiere-tentes-reception.webp',
      caption: 'Éclairage pour vos soirées'
    },
    { 
      src: '/img/tentesReceptions/optionsCarrousel/luminaire-tente-reception.png',
      caption: 'Luminaires élégants pour réceptions'
    },
    { 
      src: '/img/tentesReceptions/optionsCarrousel/parquet-tentes-reception.webp',
      caption: 'Parquet en bois pour le sol'
    }
  ];
  
  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [currentImageIndex2, setCurrentImageIndex2] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextImage1 = () => {
    setCurrentImageIndex1((prevIndex) => (prevIndex + 1) % imagesCarrousel1.length);
  };

  const prevImage1 = () => {
    setCurrentImageIndex1((prevIndex) => (prevIndex - 1 + imagesCarrousel1.length) % imagesCarrousel1.length);
  };

  const nextImage2 = () => {
    setCurrentImageIndex2((prevIndex) => (prevIndex + 1) % imagesCarrousel2.length);
  };

  const prevImage2 = () => {
    setCurrentImageIndex2((prevIndex) => (prevIndex - 1 + imagesCarrousel2.length) % imagesCarrousel2.length);
  };

  return (
    <div className='sectionContainerTentesPliantes'>
      <div className='tentesHeader'>
        <h1>PAGODES</h1>
        <p>Découvrez notre sélection de tentes pliantes pour tous vos événements en extérieur.</p>
      </div>

      {/* Premier carrousel */}
      <div className="carrouselContainer">
        <div className="carrousel">
          <button onClick={prevImage1} className="carrousel-button left">←</button>
          <Image
            src={imagesCarrousel1[currentImageIndex1]}
            alt={`Slide ${currentImageIndex1 + 1}`}
            width={800}    // Ajustez la largeur souhaitée
            height={600}   // Ajustez la hauteur souhaitée
            className="carrousel-image"
          />
          <button onClick={nextImage1} className="carrousel-button right">→</button>
        </div>
        <div className="asideContainer">
          <h3>Les caractéristiques de nos tentes de réceptions</h3>
          <ul>
            <li>Disponible avec ou sans les murs autour</li>
            <li>Taille allant de 24m² à 364m²</li>
            <li>Parquet pour rehausser le niveau</li>
            <li>Moquette de tout type de couleurs</li>
            <li>Éclairage LED ou 400W</li>
            <li>Chauffage soufflant pour l&apos;hiver</li>
          </ul>
        </div>
      </div>

      {/* Deuxième carrousel */}
      <div className="carrouselContainer2">
        <h2>Les options disponibles pour nos tentes de réceptions</h2>
        <div className="carrousel2">
          <button onClick={prevImage2} className="carrousel-button left">←</button>
          <div className="carrousel-slides">
            <div className="slide">
              <Image
                src={imagesCarrousel2[currentImageIndex2].src}
                alt={`Slide ${currentImageIndex2 + 1}`}
                width={800}  // Ajustez selon vos besoins
                height={600}
              />
              <p className="image-caption">{imagesCarrousel2[currentImageIndex2].caption}</p>
            </div>
            <div className="slide">
              <Image
                src={imagesCarrousel2[(currentImageIndex2 + 1) % imagesCarrousel2.length].src}
                alt={`Slide ${(currentImageIndex2 + 2) % imagesCarrousel2.length}`}
                width={800}
                height={600}
              />
              <p className="image-caption">
                {imagesCarrousel2[(currentImageIndex2 + 1) % imagesCarrousel2.length].caption}
              </p>
            </div>
          </div>
          <button onClick={nextImage2} className="carrousel-button right">→</button>
        </div>
      </div>

      {/* Contenu en dessous */}
      <div className='bottomContainer'>
        <h3>Les caractéristiques principales de nos tentes pliantes</h3>
        <div>
          <ul>
            <li>Taille allant de 9m² à 32m²</li>
            <li>Prix allant de 65€ à 225€</li>
            <li>Location avec ou sans côtés</li>
            <li>Avec ou sans installation</li>
            <li>Chauffage soufflant disponible</li>
          </ul>
        </div>
        <section>
          <div className='choiceContainer'>
            <div className='choix1'>
              <h3>Une question ?</h3>
              {/* Remplacez <img> par <Image> ou fournissez une URL valide */}
              <Image
                src="/img/placeholder-question.png"
                alt="Question"
                width={200}
                height={150}
              />
              <button><a href="/contact">Contactez nous</a></button>
            </div>
            <div className='choix2'>
              <h3>Vous voulez réserver ?</h3>
              <Image
                src="/img/placeholder-reservation.png"
                alt="Réservation"
                width={200}
                height={150}
              />
              <button>Demander un devis</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Pagodes;
