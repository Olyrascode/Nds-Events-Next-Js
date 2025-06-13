import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Fonction pour formater les nombres en devise EUR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(amount || 0)
    .replace(/\s/g, " "); // Remplace tous les types d'espaces (y compris insécables) par un espace standard
};

export const generateInvoicePDF = async (order, isDelivery) => {
  console.log(
    "[invoiceGenerator] Called with isDelivery:",
    isDelivery,
    "Order ID:",
    order?._id
  ); // Log pour débogage
  if (!order) {
    console.error("No order data provided.");
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15; // Marge générale
  const bottomMargin = 20; // Nouvelle marge inférieure
  let yPosition = 0; // Suivi de la position verticale

  try {
    // --- Header ---
    yPosition = margin;

    // Logo à gauche
    const logo = "/img/divers/nds-events-logo.png"; // Assurez-vous que ce chemin est correct pour votre build
    try {
      // Tentative d'ajout du logo. Si l'image n'est pas trouvée, affiche un avertissement.
      // Il est préférable de gérer le chargement de l'image de manière asynchrone ou de l'intégrer en base64.
      doc.addImage(logo, "PNG", margin, yPosition, 20, 20);
    } catch (e) {
      console.warn("Logo introuvable au chemin:", logo, e);
      doc.text("NDS Event's Logo", margin, yPosition + 5);
    }

    // Coordonnées de l'entreprise à droite
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("NDS Event's", pageWidth - margin, yPosition, { align: "right" });
    doc.text("8 Avenue Victor Hugo", pageWidth - margin, yPosition + 5, {
      align: "right",
    });
    doc.text("38130 Échirolles", pageWidth - margin, yPosition + 10, {
      align: "right",
    });
    doc.text("Tél : 04-80-80-98-51", pageWidth - margin, yPosition + 15, {
      align: "right",
    });
    doc.text("nds.grenoble@gmail.com", pageWidth - margin, yPosition + 20, {
      align: "right",
    });

    yPosition += 30; // Espace après les coordonnées de l'entreprise

    // Encadré (Titre du document) à gauche
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const documentTitleText = isDelivery ? "Bon de livraison" : "Facture";
    // Log pour vérifier la valeur juste avant l'écriture dans le PDF
    console.log(
      `[invoiceGenerator] Determined documentTitleText: ${documentTitleText} for Order ID: ${order._id}`
    );
    doc.text(
      `${documentTitleText} N° : ${order._id || "N/A"}`,
      margin,
      yPosition
    );
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Date : ${
        order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("fr-FR")
          : "N/A"
      }`,
      margin,
      yPosition + 5
    );
    doc.text(`Code client : ${order.userId || "N/A"}`, margin, yPosition + 10);

    // Coordonnées bancaires sous l'encadré facture
    yPosition += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Coordonnées bancaires :", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`IBAN : FR76 3000 3022 4600 0200 0001 887`, margin, yPosition + 5);
    doc.text(`BIC : SOGEFRPP`, margin, yPosition + 10);

    // Informations Client à droite
    let clientInfoY = yPosition - 20; // Aligner avec le début de l'encadré facture
    doc.setFont("helvetica", "bold");
    doc.text("Client :", pageWidth - margin, clientInfoY, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(
      order.billingInfo?.companyName || "",
      pageWidth - margin,
      clientInfoY + 5,
      { align: "right" }
    );
    doc.text(
      `À l\'attention de : ${order.billingInfo?.firstName || ""} ${
        order.billingInfo?.lastName || ""
      }`,
      pageWidth - margin,
      clientInfoY + 10,
      { align: "right" }
    );
    doc.text(
      order.billingInfo?.address || "Adresse inconnue",
      pageWidth - margin,
      clientInfoY + 15,
      { align: "right" }
    );
    doc.text(
      `${order.billingInfo?.zipCode || ""} ${order.billingInfo?.city || ""}`,
      pageWidth - margin,
      clientInfoY + 20,
      { align: "right" }
    );
    doc.text(
      order.billingInfo?.phone || "",
      pageWidth - margin,
      clientInfoY + 25,
      { align: "right" }
    );
    doc.text(
      order.billingInfo?.email || order.user?.email || "",
      pageWidth - margin,
      clientInfoY + 30,
      { align: "right" }
    );

    yPosition += 20; // Espace après les coordonnées bancaires

    // Objet de la facture et Conditions
    doc.setFont("helvetica", "bold");
    doc.text("Objet :", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Location du ${
        order.startDate
          ? new Date(order.startDate).toLocaleDateString("fr-FR")
          : "N/A"
      } au ${
        order.endDate
          ? new Date(order.endDate).toLocaleDateString("fr-FR")
          : "N/A"
      }`,
      margin + 15,
      yPosition
    );

    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Conditions de règlement :", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text("Comptant", margin + 45, yPosition);

    yPosition += 10; // Espace

    // --- Mode de réception et Frais de livraison ---
    doc.setFont("helvetica", "bold");
    doc.text("Mode de réception :", margin, yPosition);
    doc.setFont("helvetica", "normal");

    if (order.deliveryMethod === "pickup") {
      doc.text("Récupération au dépôt", margin + 45, yPosition);
      yPosition += 5;
    } else if (order.deliveryMethod === "delivery") {
      doc.text("Livraison à l'adresse suivante :", margin + 45, yPosition);
      yPosition += 5;
      if (order.shippingInfo) {
        doc.text(order.shippingInfo.address || "", margin + 45, yPosition);
        yPosition += 5;
        doc.text(
          `${order.shippingInfo.zipCode || ""} ${
            order.shippingInfo.city || ""
          }`,
          margin + 45,
          yPosition
        );
        yPosition += 5;
      } else {
        doc.text(
          "(Adresse de livraison non spécifiée)",
          margin + 45,
          yPosition
        );
        yPosition += 5;
      }
    } else {
      doc.text("N/A", margin + 45, yPosition);
      yPosition += 5;
    }

    let shippingFeeHT = 0;
    let shippingFeeTVAAmount = 0;
    const shippingFeeTvaRate = 20; // Taux de TVA supposé pour les frais de port

    if (
      order.deliveryMethod === "delivery" &&
      order.shippingFee &&
      order.shippingFee > 0
    ) {
      const shippingFeeTTC = order.shippingFee;
      doc.setFont("helvetica", "bold");
      doc.text("Frais de livraison TTC:", margin, yPosition); // Indiquer TTC pour clarté
      doc.setFont("helvetica", "normal");
      doc.text(formatCurrency(shippingFeeTTC), margin + 45, yPosition); // Ajuster l'indentation
      yPosition += 5;

      shippingFeeHT = shippingFeeTTC / (1 + shippingFeeTvaRate / 100);
      shippingFeeTVAAmount = shippingFeeTTC - shippingFeeHT;
    }

    yPosition += 10; // Espace avant le tableau

    // --- Tableau des produits ---
    // Regroupement des produits par catégorie

    // Liste des titres de sections explicites qui doivent apparaître si des produits leur appartiennent
    const explicitSectionTitles = [
      "Tentes rapides - Location",
      "Mobilier et autres - Location",
      "Prestations",
      "Frais VHR",
    ];

    const groupedProducts = (order.products || []).reduce((acc, product) => {
      let targetGroup = product.category; // Utilise la catégorie du produit

      // Si la catégorie du produit n'est pas l'une des sections explicites,
      // ou si la catégorie est vide/nulle, la mettre dans "Autres".
      if (!targetGroup || !explicitSectionTitles.includes(targetGroup)) {
        targetGroup = "Autres";
      }

      if (!acc[targetGroup]) {
        acc[targetGroup] = [];
      }
      acc[targetGroup].push(product);
      return acc;
    }, {});

    const tableColumns = [
      "Réf.",
      "Désignation",
      "Qté",
      "PU HT",
      "%TVA",
      "Mtt HT",
      "Mtt TTC",
      "Livré",
      "Récupéré",
    ];
    const tableBody = [];

    // Calcul des totaux
    let totalHT_products = 0; // Modifié: Total HT pour les produits uniquement
    const tvaDetails_products = {}; // Modifié: Détails TVA pour les produits uniquement

    // NOTE: Les frais de port (shippingFeeHT, shippingFeeTVAAmount) sont calculés plus haut
    // et seront ajoutés séparément dans la section des totaux.

    // Définir l'ORDRE d'affichage des sections souhaitées dans le PDF
    const displaySectionsOrder = [
      "Tentes rapides - Location",
      "Mobilier et autres - Location",
      "Prestations",
      "Frais VHR",
      "Autres", // "Autres" est la dernière section où les produits non catégorisés explicitement apparaîtront
    ];

    displaySectionsOrder.forEach((sectionTitle) => {
      if (
        groupedProducts[sectionTitle] &&
        groupedProducts[sectionTitle].length > 0
      ) {
        tableBody.push([
          {
            content: sectionTitle,
            colSpan: tableColumns.length,
            styles: { fontStyle: "bold", fillColor: [230, 230, 230] },
          },
        ]);

        groupedProducts[sectionTitle].forEach((product) => {
          const nbLots = product.quantity || 1;
          const sizeOfLot = product.lotSize || 1;
          const actualItemQuantity = nbLots * sizeOfLot;

          const unitPriceTTC_perItem = product.price || 0;
          let optionsTotalTTC = 0;
          if (
            product.selectedOptions &&
            typeof product.selectedOptions === "object"
          ) {
            Object.values(product.selectedOptions).forEach((optionValue) => {
              if (optionValue && typeof optionValue.price === "number") {
                optionsTotalTTC += optionValue.price;
              }
            });
          }

          // Calcul différent selon le type de produit
          let lineTotalTTC;
          if (product.type === "pack") {
            // Pour les packs, product.price est déjà le prix total
            lineTotalTTC = unitPriceTTC_perItem + optionsTotalTTC;
          } else {
            // Pour les produits normaux, calculer comme avant
            const itemsBaseTotalTTC = actualItemQuantity * unitPriceTTC_perItem;
            lineTotalTTC = itemsBaseTotalTTC + optionsTotalTTC;
          }

          const tvaRate = product.taxRate || 20;
          const mttHT = lineTotalTTC / (1 + tvaRate / 100);
          const puHT_calculated_from_unit =
            unitPriceTTC_perItem / (1 + tvaRate / 100);

          tableBody.push([
            product.reference ||
              product.product?.toString() ||
              product._id?.toString() ||
              "N/A",
            product.name || product.title || "N/A",
            product.type === "pack" ? product.quantity : actualItemQuantity, // Afficher la bonne quantité
            formatCurrency(puHT_calculated_from_unit),
            `${tvaRate}%`,
            formatCurrency(mttHT),
            formatCurrency(lineTotalTTC),
            "",
            "",
          ]);

          // Affichage des produits inclus dans le pack
          if (
            product.type === "pack" &&
            product.products &&
            product.products.length > 0
          ) {
            product.products.forEach((packProduct) => {
              // Gestion de la structure de données (ancien vs nouveau format)
              const productDetails = packProduct.product || packProduct;
              const quantityInPack = packProduct.quantity || 1;
              const totalQuantity = quantityInPack * product.quantity;

              tableBody.push([
                { content: "", styles: { cellWidth: "wrap" } },
                {
                  content: `   ${productDetails.title || "Produit inconnu"}`,
                  styles: {
                    fontStyle: "italic",
                    cellWidth: "wrap",
                    fontSize: 7,
                    overflow: "linebreak",
                    cellPadding: 1,
                    halign: "left",
                    minCellWidth: 30,
                    maxCellWidth: 80,
                  },
                },
                {
                  content: `${totalQuantity}`,
                  styles: {
                    fontStyle: "italic",
                    fontSize: 8,
                    halign: "center",
                  },
                },
                "",
                "",
                "",
                "",
                "",
                "",
              ]);
            });
          }

          // Ajout des lignes pour les options sélectionnées (FRONTEND)
          if (
            product.selectedOptions &&
            typeof product.selectedOptions === "object"
          ) {
            Object.values(product.selectedOptions).forEach((optionValue) => {
              if (
                optionValue &&
                (typeof optionValue.value === "string" ||
                  typeof optionValue.price === "number")
              ) {
                let optionDisplayText = "  - ";
                if (
                  typeof optionValue.value === "string" &&
                  optionValue.value
                ) {
                  optionDisplayText += `${optionValue.value}`;
                }
                if (
                  typeof optionValue.price === "number" &&
                  optionValue.price > 0
                ) {
                  if (
                    typeof optionValue.value === "string" &&
                    optionValue.value
                  ) {
                    optionDisplayText += ` (${formatCurrency(
                      optionValue.price
                    )})`;
                  } else {
                    optionDisplayText += `${formatCurrency(optionValue.price)}`;
                  }
                }
                if (optionDisplayText.trim() !== "-") {
                  tableBody.push([
                    { content: "", styles: { cellWidth: "wrap" } },
                    {
                      content: optionDisplayText,
                      styles: { fontStyle: "italic", cellWidth: "auto" },
                    },
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                  ]);
                }
              }
            });
          }

          totalHT_products += mttHT; // Modifié: Accumuler dans totalHT_products
          // Agrégation par taux de TVA
          if (!tvaDetails_products[tvaRate]) {
            // Modifié: Utiliser tvaDetails_products
            tvaDetails_products[tvaRate] = { base: 0, amount: 0 };
          }
          tvaDetails_products[tvaRate].base += mttHT; // Modifié
          tvaDetails_products[tvaRate].amount += lineTotalTTC - mttHT; // Modifié
        });
      }
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableBody,
      startY: yPosition,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        font: "helvetica", // Utiliser une police sans-serif
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [70, 70, 70],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        yPosition = data.cursor.y; // Mettre à jour yPosition après chaque page
      },
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // --- Section Totaux ---
    const totalBoxWidth = 90; // Augmenté pour plus d'espace
    const totalBoxX = pageWidth - margin - totalBoxWidth;

    doc.setFontSize(10);

    // --- TOTAUX PRODUITS ---
    doc.setFont("helvetica", "bold");
    doc.text("Sous-total Produits HT", totalBoxX, yPosition);
    doc.text(
      formatCurrency(totalHT_products),
      totalBoxX + totalBoxWidth,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 6;

    let totalTVA_products = 0;
    doc.setFont("helvetica", "normal");
    Object.keys(tvaDetails_products) // Modifié
      .sort()
      .forEach((rate) => {
        const detail = tvaDetails_products[rate]; // Modifié
        totalTVA_products += detail.amount; // Modifié
      });

    yPosition += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Sous-total TVA Produits", totalBoxX, yPosition);
    doc.text(
      formatCurrency(totalTVA_products),
      totalBoxX + totalBoxWidth,
      yPosition,
      {
        // Modifié
        align: "right",
      }
    );
    yPosition += 6;

    const totalTTC_products = totalHT_products + totalTVA_products; // Modifié
    doc.setFontSize(11); // Un peu plus grand pour le sous-total TTC produits
    doc.setFont("helvetica", "bold");
    doc.text("Sous-total Produits TTC", totalBoxX, yPosition);
    doc.text(
      formatCurrency(totalTTC_products),
      totalBoxX + totalBoxWidth,
      yPosition,
      {
        // Modifié
        align: "right",
      }
    );
    yPosition += 8; // Espace

    // --- TOTAUX LIVRAISON (si applicable) ---
    doc.setFontSize(10);
    if (
      order.deliveryMethod === "delivery" &&
      order.shippingFee &&
      order.shippingFee > 0
    ) {
      doc.setFont("helvetica", "bold");
      doc.text("Livraison HT", totalBoxX, yPosition);
      doc.text(
        formatCurrency(shippingFeeHT),
        totalBoxX + totalBoxWidth,
        yPosition,
        {
          align: "right",
        }
      );
      yPosition += 6;

      doc.setFont("helvetica", "normal");
      doc.text(`TVA Livraison ${shippingFeeTvaRate}%`, totalBoxX, yPosition);
      doc.text(
        formatCurrency(shippingFeeTVAAmount),
        totalBoxX + totalBoxWidth,
        yPosition,
        { align: "right" }
      );
      yPosition += 5;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Total Livraison TTC", totalBoxX, yPosition);
      doc.text(
        formatCurrency(order.shippingFee),
        totalBoxX + totalBoxWidth,
        yPosition,
        {
          align: "right",
        }
      );
      yPosition += 8; // Espace
    }

    // --- GRAND TOTAL ---
    const grandTotalHT = totalHT_products + shippingFeeHT;
    const grandTotalTVA = totalTVA_products + shippingFeeTVAAmount;
    const grandTotalTTC = totalTTC_products + (order.shippingFee || 0);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL HT GÉNÉRAL", totalBoxX, yPosition);
    doc.text(
      formatCurrency(grandTotalHT),
      totalBoxX + totalBoxWidth,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 6;

    doc.text("TOTAL TVA GÉNÉRAL", totalBoxX, yPosition);
    doc.text(
      formatCurrency(grandTotalTVA),
      totalBoxX + totalBoxWidth,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 6;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TTC GÉNÉRAL", totalBoxX, yPosition);
    doc.text(
      formatCurrency(grandTotalTTC),
      totalBoxX + totalBoxWidth,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 10;

    // Montant en lettres (omise pour l'instant car complexe)
    // doc.text('Arrêtée la présente facture à la somme de : ... euros', margin, yPosition);
    // yPosition += 5;

    doc.setFont("helvetica", "bolditalic");
    doc.text("En votre aimable règlement.", margin, yPosition);
    yPosition += 10;

    // --- Footer ---
    // Pour s'assurer que le footer est en bas
    const footerY = pageHeight - bottomMargin; // Utilisation de bottomMargin
    if (yPosition > footerY - 20) {
      // Laisser de l'espace pour le footer
      doc.addPage();
      yPosition = margin;
      // Redessiner le footer sur la nouvelle page si nécessaire (pas implémenté ici)
    } else {
      yPosition = footerY - 20; // Ajuster pour laisser de la place
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PIÈCES ORIGINE : DVS 7064 (04/04/24)", margin, yPosition); // Exemple statique, adapter si nécessaire
    yPosition += 6; // Augmentation de l'espacement
    doc.text(
      "- Les ventes sont conclues avec réserve de propriété et le transfert de propriété n'intervient qu'après complet paiement du prix, (loi 80.335 du 10 mai 1980).",
      margin,
      yPosition,
      { maxWidth: pageWidth - margin * 2 }
    );
    yPosition += 6; // Augmentation de l'espacement
    doc.text(
      "- L'acceptation des livraisons ou des documents afférents à cette livraison vaut acceptation de la présente clause. Le paiement du prix s'entend de l'encaissement effectif du paiement.",
      margin,
      yPosition,
      { maxWidth: pageWidth - margin * 2 }
    );
    yPosition += 6; // Augmentation de l'espacement
    doc.text(
      "- En cas de retard de paiement, il sera appliqué des pénalités de retard égales au taux de refinancement de la BCE + 10% sans qu'un rappel soit nécessaire (article L 441-6 du Code de commerce). Conformément au décret n° 2012-1115 du 2 octobre 2012, lemontant de l'indemnité forfaitaire pour frais de recouvrement due au créancier en cas de retard de paiement est fixé à 40 euros.",
      margin,
      yPosition,
      { maxWidth: pageWidth - margin * 2 }
    );

    // Numéro de page (optionnel)
    // doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    // --- Téléchargement ---
    const fileName = isDelivery
      ? `Bon_de_livraison_${order._id || "N_A"}.pdf`
      : `Facture_${order._id || "N_A"}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating invoice:", error);
  }
};
