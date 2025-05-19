import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Fonction pour formater les nombres en devise EUR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount || 0);
};

export const generateInvoicePDF = async (order) => {
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
      doc.addImage(logo, "PNG", margin, yPosition, 40, 20);
    } catch (e) {
      console.warn("Logo introuvable au chemin:", logo, e);
      doc.text("NDS Event's Logo", margin, yPosition + 10);
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

    // Encadré Facture à gauche
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Facture N° : ${order._id || "N/A"}`, margin, yPosition);
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

    yPosition += 15; // Espace avant le tableau

    // --- Tableau des produits ---
    // Regroupement des produits par catégorie (ajuster les catégories si nécessaire)
    const groupedProducts = (order.products || []).reduce((acc, product) => {
      const category = product.category || "Autres"; // Catégorie par défaut
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    const tableColumns = [
      "Réf.",
      "Désignation",
      "Qté",
      "Remise",
      "PU HT",
      "%TVA",
      "Mtt HT",
      "Mtt TTC",
    ];
    const tableBody = [];

    // Calcul des totaux
    let totalHT = 0;
    const tvaDetails = {}; // Pour stocker les montants par taux de TVA

    // Définir les sections souhaitées
    const sections = [
      "Tentes rapides - Location",
      "Mobilier et autres - Location",
      "Prestations",
      "Frais VHR",
      "Autres",
    ];

    sections.forEach((section) => {
      if (groupedProducts[section]) {
        // Ajouter une ligne de titre de section
        tableBody.push([
          {
            content: section,
            colSpan: tableColumns.length,
            styles: { fontStyle: "bold", fillColor: [230, 230, 230] },
          },
        ]);

        groupedProducts[section].forEach((product) => {
          const quantity = product.quantity || 1;
          // Supposons que product.price est le PRIX UNITAIRE TTC que vous avez stocké
          const unitPriceTTC = product.price || 0;
          const lineTotalTTC = unitPriceTTC * quantity; // Calcul correct du total de ligne TTC

          const remise = product.discountPercentage || 0; // Remise en %
          const tvaRate = product.taxRate || 20; // Taux de TVA (défaut 20%)

          // Calcul à partir du TTC
          const mttHT = lineTotalTTC / (1 + tvaRate / 100);
          const tvaAmount = lineTotalTTC - mttHT;
          // Le PU HT est calculé sur la base du prix unitaire TTC (unitPriceTTC) et non du total de ligne.
          // Si unitPriceTTC est bien le prix unitaire, alors puHT se calcule à partir de unitPriceTTC / (1 + tvaRate/100)
          const puHT_calculated_from_unit = unitPriceTTC / (1 + tvaRate / 100);

          tableBody.push([
            product.reference ||
              product.product?.toString() ||
              product._id?.toString() ||
              "N/A", // product.product si c'est l'ID du produit référencé
            product.name || product.title || "N/A", // Utiliser product.name (souvent stocké) ou product.title
            quantity,
            remise > 0 ? `${remise}%` : "", // Afficher la remise en %
            formatCurrency(puHT_calculated_from_unit), // PU HT calculé à partir du PU TTC
            `${tvaRate}%`,
            formatCurrency(mttHT), // Montant HT de la ligne (basé sur lineTotalTTC)
            formatCurrency(lineTotalTTC), // Montant TTC de la ligne
          ]);

          totalHT += mttHT;
          // Agrégation par taux de TVA
          if (!tvaDetails[tvaRate]) {
            tvaDetails[tvaRate] = { base: 0, amount: 0 };
          }
          tvaDetails[tvaRate].base += mttHT;
          tvaDetails[tvaRate].amount += tvaAmount;
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
    const totalBoxWidth = 80;
    const totalBoxX = pageWidth - margin - totalBoxWidth;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Base HT", totalBoxX, yPosition); // Modifié pour correspondre à la demande
    doc.text(formatCurrency(totalHT), totalBoxX + totalBoxWidth, yPosition, {
      align: "right",
    });
    yPosition += 6;

    let totalTVA = 0;
    doc.setFont("helvetica", "normal");
    Object.keys(tvaDetails)
      .sort()
      .forEach((rate) => {
        const detail = tvaDetails[rate];
        doc.text(
          `TVA ${rate}% sur ${formatCurrency(detail.base)}`,
          totalBoxX,
          yPosition
        );
        doc.text(
          formatCurrency(detail.amount),
          totalBoxX + totalBoxWidth,
          yPosition,
          { align: "right" }
        );
        totalTVA += detail.amount;
        yPosition += 5;
      });

    yPosition += 2; // Petit espace
    doc.setFont("helvetica", "bold");
    doc.text("Cumul TVA", totalBoxX, yPosition); // Modifié
    doc.text(formatCurrency(totalTVA), totalBoxX + totalBoxWidth, yPosition, {
      align: "right",
    });
    yPosition += 6;

    // Ajout Total HT (redondant mais demandé)
    doc.text("Total HT", totalBoxX, yPosition);
    doc.text(formatCurrency(totalHT), totalBoxX + totalBoxWidth, yPosition, {
      align: "right",
    });
    yPosition += 6;

    // Ajout Total TVA (redondant mais demandé)
    doc.text("Total TVA", totalBoxX, yPosition);
    doc.text(formatCurrency(totalTVA), totalBoxX + totalBoxWidth, yPosition, {
      align: "right",
    });
    yPosition += 6;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total TTC", totalBoxX, yPosition);
    const totalTTC = totalHT + totalTVA;
    doc.text(formatCurrency(totalTTC), totalBoxX + totalBoxWidth, yPosition, {
      align: "right",
    });
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
    yPosition += 4;
    doc.text(
      "- Les ventes sont conclues avec réserve de propriété et le transfert de propriété n'intervient qu'après complet paiement du prix, (loi 80.335 du 10 mai 1980).",
      margin,
      yPosition,
      { maxWidth: pageWidth - margin * 2 }
    );
    yPosition += 4; // Réduit l'espace
    doc.text(
      "- L'acceptation des livraisons ou des documents afférents à cette livraison vaut acceptation de la présente clause. Le paiement du prix s'entend de l'encaissement effectif du paiement.",
      margin,
      yPosition,
      { maxWidth: pageWidth - margin * 2 }
    );
    yPosition += 4; // Réduit l'espace
    doc.text(
      "- En cas de retard de paiement, il sera appliqué des pénalités de retard égales au taux de refinancement de la BCE + 10% sans qu'un rappel soit nécessaire (article L 441-6 du Code de commerce). Conformément au décret n° 2012-1115 du 2 octobre 2012, lemontant de l'indemnité forfaitaire pour frais de recouvrement due au créancier en cas de retard de paiement est fixé à 40 euros.",
      margin,
      yPosition,
      { maxWidth: pageWidth - margin * 2 }
    );

    // Numéro de page (optionnel)
    // doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    // --- Téléchargement ---
    doc.save(`Facture_${order._id || "N_A"}.pdf`);
  } catch (error) {
    console.error("Error generating invoice:", error);
  }
};
