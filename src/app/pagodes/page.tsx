"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Typography, Box } from "@mui/material";
import Link from "next/link";
import "../tentes-de-receptions/_TentesDeReceptions.scss";

function Pagodes() {
  const imagesCarrousel1 = [
    "/img/tentespliantes/pagodes-reception.jpg",
    "/img/pagodes/pagodes-reception-grenoble.webp",
    "/img/pagodes/pagode-reception-grenoble.webp",
  ];
  const imagesCarrousel2 = [
    {
      src: "/img/tentesReceptions/optionsCarrousel/chauffage-tente-reception.webp",
      caption: "Chauffage pour tente de réception",
    },
    {
      src: "/img/tentesReceptions/optionsCarrousel/choix-couleurs-moquette-1.webp",
      caption: "Moquette de couleur pour personnalisation",
    },
    {
      src: "/img/tentesReceptions/optionsCarrousel/lumiere-tentes-reception.webp",
      caption: "Éclairage pour vos soirées",
    },
    {
      src: "/img/tentesReceptions/optionsCarrousel/luminaire-tente-reception.png",
      caption: "Luminaires élégants pour réceptions",
    },
    {
      src: "/img/tentesReceptions/optionsCarrousel/parquet-tentes-reception.webp",
      caption: "Parquet en bois pour le sol",
    },
  ];

  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [currentImageIndex2, setCurrentImageIndex2] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextImage1 = () => {
    setCurrentImageIndex1(
      (prevIndex) => (prevIndex + 1) % imagesCarrousel1.length
    );
  };

  const prevImage1 = () => {
    setCurrentImageIndex1(
      (prevIndex) =>
        (prevIndex - 1 + imagesCarrousel1.length) % imagesCarrousel1.length
    );
  };

  const nextImage2 = () => {
    setCurrentImageIndex2(
      (prevIndex) => (prevIndex + 1) % imagesCarrousel2.length
    );
  };

  const prevImage2 = () => {
    setCurrentImageIndex2(
      (prevIndex) =>
        (prevIndex - 1 + imagesCarrousel2.length) % imagesCarrousel2.length
    );
  };

  // Contenu des sections (anciennement dans l'accordéon)
  const dimensionsContent = (
    <div className="dimensions-content">
      <p>
        Nous proposons une gamme de pagodes pour répondre à tous vos besoins
        d&apos;événements :
      </p>

      <h4>Pagodes carrées</h4>
      <ul>
        <li>Pagode 3x3m (9m²) - idéale pour petites réceptions</li>
        <li>Pagode 4x4m (16m²) - adaptée pour petit espace cocktail</li>
        <li>Pagode 5x5m (25m²) - parfaite pour espace d&apos;accueil</li>
        <li>Pagode 6x6m (36m²) - idéale pour environ 30 personnes</li>
      </ul>

      <h4>Utilisations courantes</h4>
      <ul>
        <li>Espaces d&apos;accueil et réception</li>
        <li>Points de restauration pour buffets</li>
        <li>Zones cocktail lors d&apos;événements</li>
        <li>Espaces VIP pour festivals</li>
        <li>Protection solaire lors d&apos;événements en extérieur</li>
      </ul>

      <p className="footer-note">
        Possibilité de configuration en pagodes accolées pour créer des espaces
        plus grands ou modulables.
      </p>
    </div>
  );

  const optionsContent = (
    <div className="options-content">
      <p>Personnalisez votre pagode avec nos nombreuses options :</p>
      <ul>
        <li>
          <strong>Sol :</strong> Parquet en bois, moquette (différentes couleurs
          disponibles)
        </li>
        <li>
          <strong>Éclairage :</strong> Spots LED, guirlandes lumineuses, lustres
          décoratifs
        </li>
        <li>
          <strong>Chauffage :</strong> Chauffages soufflants pour maintenir une
          température agréable
        </li>
        <li>
          <strong>Mobilier :</strong> Tables, chaises, buffets, bars
        </li>
        <li>
          <strong>Décoration :</strong> Rideaux, tentures, voilages
        </li>
        <li>
          <strong>Sonorisation :</strong> Système audio sur demande
        </li>
      </ul>
    </div>
  );

  const conditionsContent = (
    <div className="conditions-content">
      <p>Informations importantes pour la location de nos pagodes :</p>
      <ul>
        <li>Durée minimale de location : 2 jours</li>
        <li>Installation et démontage inclus dans le prix</li>
        <li>
          Un terrain plat et accessible est nécessaire pour l&apos;installation
        </li>
        <li>Caution demandée à la réservation</li>
        <li>Assurance responsabilité civile recommandée</li>
        <li>Réservation à effectuer au minimum 2 semaines à l&apos;avance</li>
      </ul>
    </div>
  );

  const conseilsContent = (
    <div className="conseils-content">
      <p>Pour une expérience optimale avec nos pagodes :</p>
      <ul>
        <li>Prévoyez 1m² par personne pour un cocktail debout</li>
        <li>Comptez 1.5m² par personne pour un repas assis</li>
        <li>En cas de météo incertaine, optez pour les côtés amovibles</li>
        <li>
          Pour les événements en soirée, n&apos;oubliez pas de prévoir un
          éclairage adapté
        </li>
        <li>
          En hiver ou mi-saison, les chauffages sont fortement recommandés
        </li>
        <li>
          Notre équipe est disponible pour vous conseiller sur la configuration
          idéale
        </li>
      </ul>
    </div>
  );

  return (
    <div className="sectionContainerTentesPliantes">
      <div className="tentesHeader">
        <h1>PAGODES</h1>
        <p>
          Découvrez notre sélection de tentes pliantes pour tous vos événements
          en extérieur.
        </p>
      </div>

      {/* Premier carrousel */}
      <div className="carrouselContainer">
        <div className="carrousel">
          <button onClick={prevImage1} className="carrousel-button left">
            ←
          </button>
          <Image
            src={imagesCarrousel1[currentImageIndex1]}
            alt={`Slide ${currentImageIndex1 + 1}`}
            width={800} // Ajustez la largeur souhaitée
            height={600} // Ajustez la hauteur souhaitée
            className="carrousel-image"
          />
          <button onClick={nextImage1} className="carrousel-button right">
            →
          </button>
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

      {/* Section de contenu (anciennement accordéon) */}
      <div className="content-section">
        <Typography variant="h4" component="h2" className="section-title">
          Tout savoir sur nos pagodes
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h3" className="section-subtitle">
            Dimensions disponibles
          </Typography>
          {dimensionsContent}
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h3" className="section-subtitle">
            Options et accessoires
          </Typography>
          {optionsContent}
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h3" className="section-subtitle">
            Conditions de location
          </Typography>
          {conditionsContent}
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h3" className="section-subtitle">
            Conseils et recommandations
          </Typography>
          {conseilsContent}
        </Box>
      </div>

      {/* Deuxième carrousel */}
      <div className="carrouselContainer2">
        <h2>Les options disponibles pour nos tentes de réceptions</h2>
        <div className="carrousel2">
          <button onClick={prevImage2} className="carrousel-button left">
            ←
          </button>
          <div className="carrousel-slides">
            <div className="slide">
              <Image
                src={imagesCarrousel2[currentImageIndex2].src}
                alt={`Slide ${currentImageIndex2 + 1}`}
                width={800}
                height={600}
              />
              <p className="image-caption">
                {imagesCarrousel2[currentImageIndex2].caption}
              </p>
            </div>
            <div className="slide">
              <Image
                src={
                  imagesCarrousel2[
                    (currentImageIndex2 + 1) % imagesCarrousel2.length
                  ].src
                }
                alt={`Slide ${
                  (currentImageIndex2 + 2) % imagesCarrousel2.length
                }`}
                width={800}
                height={600}
              />
              <p className="image-caption">
                {
                  imagesCarrousel2[
                    (currentImageIndex2 + 1) % imagesCarrousel2.length
                  ].caption
                }
              </p>
            </div>
          </div>
          <button onClick={nextImage2} className="carrousel-button right">
            →
          </button>
        </div>
      </div>

      {/* Contenu en dessous */}
      <div className="bottomContainer">
        <section className="dark-section">
          <h3>Conditions de location</h3>
          <Box sx={{ my: 4 }}>{conditionsContent}</Box>
        </section>
        <section>
          <h3>Conseils et recommandations</h3>
          <Box sx={{ my: 4 }}>{conseilsContent}</Box>
        </section>
        <div className="choiceContainer">
          <div className="choix1">
            <h3>Une question ?</h3>
            {/* Remplacez <img> par <Image> ou fournissez une URL valide */}
            <Image
              src="/img/placeholder-question.png"
              alt="Question"
              width={200}
              height={150}
            />
            <button>
              <Link href="/contact">Contactez nous</Link>
            </button>
          </div>
          <div className="choix2">
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
      </div>
    </div>
  );
}

export default Pagodes;
