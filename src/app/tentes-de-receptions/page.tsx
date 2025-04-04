"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import "./_TentesDeReceptions.scss";
import Link from "next/link";

function TentesDeReception() {
  const imagesCarrousel1 = [
    "/img/tentesReceptions/tentes-pliantes.webp",
    "/img/tentesReceptions/tente-de-reception-avec-cote.webp",
    "/img/tentesReceptions/reception-tente-evenements.webp",
    "/img/tentesReceptions/grande-tente-reception-location.webp",
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

  // État pour les onglets dans l'accordéon
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Défilement automatique pour le premier carrousel
    const interval1 = setInterval(() => {
      setCurrentImageIndex1(
        (prevIndex) => (prevIndex + 1) % imagesCarrousel1.length
      );
    }, 5000);

    // Défilement automatique pour le deuxième carrousel
    const interval2 = setInterval(() => {
      setCurrentImageIndex2(
        (prevIndex) => (prevIndex + 1) % imagesCarrousel2.length
      );
    }, 5000);

    // Nettoyage des intervalles lors du démontage du composant
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [imagesCarrousel1.length, imagesCarrousel2.length]);

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

  // Fonction pour changer d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Contenu des sections (anciennement dans l'accordéon)
  const dimensionsContent = (
    <div>
      <p>
        Nous proposons une large gamme de tailles pour répondre à tous vos
        besoins d&apos;événements :
      </p>

      {/* Système d'onglets pour les différentes tailles */}
      <div className="tabs-container">
        <Box className="tabs-header">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="tailles de tentes"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="3-4 mètres" />
            <Tab label="5 mètres" />
            <Tab label="6 mètres" />
            <Tab label="7 mètres" />
            <Tab label="8 mètres et +" />
          </Tabs>
        </Box>

        {/* Contenu onglet 3-4 mètres */}
        <Box role="tabpanel" hidden={tabValue !== 0} className="tab-panel">
          {tabValue === 0 && (
            <>
              <Typography variant="h6" className="section-subtitle">
                Tentes de 3 et 4 mètres de large
              </Typography>
              <ul>
                <li>Tente 4x6m (24m²) - adaptée pour 15-20 personnes</li>
                <li>Tente 4x8m (32m²) - pour environ 25 personnes</li>
                <li>Tente 4x10m (40m²) - pour environ 30 personnes</li>
                <li>Tente 4x12m (48m²) - pour environ 40 personnes</li>
                <li>Tente 4x14m (56m²) - pour environ 45 personnes</li>
                <li>Tente 4x16m (64m²) - pour 50-60 personnes</li>
                <li>Tente 4x20m (80m²) - pour environ 70 personnes</li>
                <li>Tente 4x22m (88m²) - pour environ 75 personnes</li>
                <li>Tente 4x28m (112m²) - pour environ 90 personnes</li>
              </ul>
            </>
          )}
        </Box>

        {/* Contenu onglet 5 mètres */}
        <Box role="tabpanel" hidden={tabValue !== 1} className="tab-panel">
          {tabValue === 1 && (
            <>
              <Typography variant="h6" className="section-subtitle">
                Tentes de 5 mètres de large
              </Typography>
              <ul>
                <li>Tente 5x6m (30m²) - pour environ 25 personnes</li>
                <li>Tente 5x8m (40m²) - pour environ 30-35 personnes</li>
                <li>Tente 5x10m (50m²) - pour environ 40 personnes</li>
                <li>Tente 5x12m (60m²) - pour environ 50 personnes</li>
                <li>Tente 5x14m (70m²) - pour environ 60 personnes</li>
                <li>Tente 5x16m (80m²) - pour environ 70 personnes</li>
                <li>Tente 5x18m (90m²) - pour environ 75 personnes</li>
                <li>Tente 5x20m (100m²) - pour environ 80 personnes</li>
                <li>Tente 5x22m (110m²) - pour environ 90 personnes</li>
                <li>Tente 5x24m (120m²) - pour environ 100 personnes</li>
                <li>Tente 5x26m (130m²) - pour environ 110 personnes</li>
                <li>Tente 5x28m (140m²) - pour environ 120 personnes</li>
                <li>Tente 5x30m (150m²) - pour environ 130 personnes</li>
                <li>Tente 5x32m (160m²) - pour environ 135 personnes</li>
                <li>Tente 5x34m (170m²) - pour environ 145 personnes</li>
                <li>Tente 5x36m (180m²) - pour environ 150 personnes</li>
                <li>Tente 5x38m (190m²) - pour environ 160 personnes</li>
                <li>Tente 5x40m (200m²) - pour environ 170 personnes</li>
                <li>Tente 5x42m (210m²) - pour environ 180 personnes</li>
              </ul>
            </>
          )}
        </Box>

        {/* Contenu onglet 6 mètres */}
        <Box role="tabpanel" hidden={tabValue !== 2} className="tab-panel">
          {tabValue === 2 && (
            <>
              <Typography variant="h6" className="section-subtitle">
                Tentes de 6 mètres de large
              </Typography>
              <ul>
                <li>Tente 6x6m (36m²) - pour environ 30 personnes</li>
                <li>Tente 6x8m (48m²) - pour environ 40 personnes</li>
                <li>Tente 6x10m (60m²) - pour environ 50 personnes</li>
                <li>Tente 6x12m (72m²) - pour environ 60 personnes</li>
                <li>Tente 6x14m (84m²) - pour environ 70 personnes</li>
                <li>Tente 6x16m (96m²) - pour environ 80 personnes</li>
                <li>Tente 6x18m (108m²) - pour environ 90 personnes</li>
                <li>Tente 6x20m (120m²) - pour environ 100 personnes</li>
                <li>Tente 6x22m (132m²) - pour environ 110 personnes</li>
                <li>Tente 6x24m (144m²) - pour environ 120 personnes</li>
                <li>Tente 6x26m (156m²) - pour environ 130 personnes</li>
                <li>Tente 6x28m (168m²) - pour environ 140 personnes</li>
                <li>Tente 6x30m (180m²) - pour environ 150 personnes</li>
                <li>Tente 6x32m (192m²) - pour environ 160 personnes</li>
                <li>Tente 6x34m (204m²) - pour environ 170 personnes</li>
                <li>Tente 6x36m (216m²) - pour environ 180 personnes</li>
                <li>Tente 6x38m (228m²) - pour environ 190 personnes</li>
                <li>Tente 6x40m (240m²) - pour environ 200 personnes</li>
                <li>Tente 6x42m (252m²) - pour environ 210 personnes</li>
              </ul>
            </>
          )}
        </Box>

        {/* Contenu onglet 7 mètres */}
        <Box role="tabpanel" hidden={tabValue !== 3} className="tab-panel">
          {tabValue === 3 && (
            <>
              <Typography variant="h6" className="section-subtitle">
                Tentes de 7 mètres de large
              </Typography>
              <ul>
                <li>Tente 7x6m (42m²) - pour environ 35 personnes</li>
                <li>Tente 7x8m (56m²) - pour environ 45 personnes</li>
                <li>Tente 7x10m (70m²) - pour environ 60 personnes</li>
                <li>Tente 7x12m (84m²) - pour environ 70 personnes</li>
                <li>Tente 7x14m (98m²) - pour environ 80 personnes</li>
                <li>Tente 7x16m (112m²) - pour environ 95 personnes</li>
                <li>Tente 7x18m (126m²) - pour environ 105 personnes</li>
                <li>Tente 7x20m (140m²) - pour environ 120 personnes</li>
                <li>Tente 7x22m (154m²) - pour environ 130 personnes</li>
                <li>Tente 7x24m (168m²) - pour environ 140 personnes</li>
                <li>Tente 7x26m (182m²) - pour environ 150 personnes</li>
                <li>Tente 7x28m (196m²) - pour environ 165 personnes</li>
                <li>Tente 7x30m (210m²) - pour environ 175 personnes</li>
                <li>Tente 7x32m (224m²) - pour environ 190 personnes</li>
                <li>Tente 7x34m (238m²) - pour environ 200 personnes</li>
                <li>Tente 7x36m (252m²) - pour environ 210 personnes</li>
                <li>Tente 7x38m (266m²) - pour environ 225 personnes</li>
                <li>Tente 7x40m (280m²) - pour environ 235 personnes</li>
                <li>Tente 7x42m (294m²) - pour environ 250 personnes</li>
              </ul>
            </>
          )}
        </Box>

        {/* Contenu onglet 8 mètres et plus */}
        <Box role="tabpanel" hidden={tabValue !== 4} className="tab-panel">
          {tabValue === 4 && (
            <>
              <Typography variant="h6" className="section-subtitle">
                Tentes de 8 mètres et plus de large
              </Typography>
              <ul>
                <li>Tente 8x8m (64m²) - pour environ 55 personnes</li>
                <li>Tente 8x10m (80m²) - pour environ 65 personnes</li>
                <li>Tente 8x12m (96m²) - pour environ 80 personnes</li>
                <li>Tente 8x18m (144m²) - pour environ 120 personnes</li>
                <li>Tente 8x20m (160m²) - pour environ 135 personnes</li>
                <li>Tente 8x22m (176m²) - pour environ 150 personnes</li>
                <li>Tente 8x24m (192m²) - pour environ 160 personnes</li>
                <li>Tente 10x10m (100m²) - pour environ 85 personnes</li>
                <li>Tente 10x15m (150m²) - pour environ 125 personnes</li>
                <li>Tente 12x10m (120m²) - pour environ 100 personnes</li>
                <li>Tente 12x12m (144m²) - pour environ 120 personnes</li>
                <li>Tente 12x14m (168m²) - pour environ 140 personnes</li>
                <li>Tente 13x14m (182m²) - pour environ 150 personnes</li>
                <li>Tente 14x14m (196m²) - pour environ 165 personnes</li>
                <li>Tente 20x14m (280m²) - pour environ 235 personnes</li>
                <li>
                  Tente 13x28m (364m²) - notre plus grande tente, jusqu&apos;à
                  300 personnes
                </li>
              </ul>
            </>
          )}
        </Box>
      </div>

      <p className="footer-note">
        Possibilité de configuration en tentes accolées pour créer des espaces
        plus grands. D&apos;autres dimensions sont disponibles sur demande.
      </p>
    </div>
  );

  const optionsContent = (
    <div>
      <p>Personnalisez votre tente avec nos nombreuses options :</p>
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
    <div>
      <p>
        Informations importantes pour la location de nos tentes de réception :
      </p>
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
    <div>
      <p>Pour une expérience optimale avec nos tentes de réception :</p>
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
        <h1>TENTES DE RECEPTIONS</h1>
        <p>
          Découvrez notre sélection de tentes pliantes pour tous vos événements
          en extérieur.
        </p>
      </div>

      {/* Premier carrousel */}
      <div className="carrouselContainer">
        <div className="carrousel">
          <div className="carrousel-buttons">
            <button onClick={prevImage1} className="carrousel-button left">
              ←
            </button>
            <button onClick={nextImage1} className="carrousel-button right">
              →
            </button>
          </div>
          <div className="image-container">
            <Image
              src={imagesCarrousel1[currentImageIndex1]}
              alt={`Slide ${currentImageIndex1 + 1}`}
              width={600}
              height={400}
            />
          </div>
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
          Tout savoir sur nos tentes de réception
        </Typography>
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h3" className="section-subtitle">
            Dimensions disponibles
          </Typography>
          <div className="dimensions-content">{dimensionsContent}</div>
        </Box>{" "}
      </div>

      {/* Deuxième carrousel */}
      <div className="carrouselContainer2">
        <h2>Les options disponibles pour nos tentes de réceptions</h2>
        <Box sx={{ my: 4 }}>
          <div className="options-content">{optionsContent}</div>
        </Box>
        <div className="carrousel2">
          <div className="carrousel-buttons">
            <button onClick={prevImage2} className="carrousel-button left">
              ←
            </button>
            <button onClick={nextImage2} className="carrousel-button right">
              →
            </button>
          </div>
          <div className="carrousel-slides">
            <div className="slide">
              <Image
                src={imagesCarrousel2[currentImageIndex2].src}
                alt={`Slide ${currentImageIndex2 + 1}`}
                width={600}
                height={400}
              />
              <p className="image-caption">
                {imagesCarrousel2[currentImageIndex2].caption}
              </p>
            </div>
            <div className="slide mobile-hidden">
              <Image
                src={
                  imagesCarrousel2[
                    (currentImageIndex2 + 1) % imagesCarrousel2.length
                  ].src
                }
                alt={`Slide ${
                  (currentImageIndex2 + 2) % imagesCarrousel2.length
                }`}
                width={600}
                height={400}
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
        </div>
      </div>

      {/* Contenu en dessous */}
      <div className="bottomContainer">
        <section className="dark-section">
          <h3>Conditions de locations</h3>
          <Box sx={{ my: 4 }}>
            <div className="conditions-content">{conditionsContent}</div>
          </Box>
        </section>
        <section>
          <h3>Conseils et recommandations</h3>
          <Box sx={{ my: 4 }}>
            <div className="conseils-content">{conseilsContent}</div>
          </Box>
        </section>
        <div className="choiceContainer">
          <div className="choix1">
            <h3>Une question ?</h3>
            {/* Remplacez "src" par le chemin d'une image appropriée */}

            <button>
              <Link href="/contact">Contactez nous</Link>
            </button>
          </div>
          <div className="choix2">
            <h3>Vous voulez réserver ?</h3>

            <button>Demander un devis</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TentesDeReception;
