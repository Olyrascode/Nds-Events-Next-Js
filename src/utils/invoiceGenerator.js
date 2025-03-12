

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = async (order) => {
  if (!order) {
    console.error('No order data provided.');
    return;
  }

  const doc = new jsPDF();

  try {
    // Ajout du logo (vérification du chemin)
    const logo = '../../img/divers/nds-events-logo.png'; // Chemin du logo
    try {
      doc.addImage(logo, 'PNG', 10, 10, 40, 20);
    } catch {
      console.warn('Logo introuvable ou chemin incorrect.');
    }

    // Informations de la facture (numéro, date, client)
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(
      `Facture ${order.id || 'N/A'} du ${
        order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'N/A'
      }`,
      120,
      20
    );
    doc.text(`Code client : ${order.billingInfo?.clientCode || 'N/A'}`, 120, 30);

    // Coordonnées bancaires
    doc.text('Coordonnées bancaires :', 10, 50);
    doc.text(`IBAN : FR76 3000 3022 4600 0200 0001 887`, 10, 55);
    doc.text(`BIC : SOGEFRPP`, 10, 60);

    // Date de paiement
    doc.text(
      `À régler avant le : ${
        order.paymentDueDate ? new Date(order.paymentDueDate).toLocaleDateString('fr-FR') : 'N/A'
      }`,
      120,
      40
    );

    // Adresse du client
    doc.setFontSize(10);
    doc.text(
      `À l'attention de : ${order.billingInfo?.firstName || ''} ${order.billingInfo?.lastName || ''}`,
      10,
      70
    );
    doc.text(order.billingInfo?.address || 'Adresse inconnue', 10, 75);
    doc.text(
      `${order.billingInfo?.zipCode || ''} ${order.billingInfo?.city || ''}`,
      10,
      80
    );

    // Tableau des produits
    const products = order.products?.map((product) => [
      product.reference || 'N/A',
      product.title || 'N/A',
      product.quantity || 0,
      `${product.price?.toFixed(2) || '0.00'} €`,
      `${((product.price || 0) * (product.quantity || 0)).toFixed(2)} €`,
    ]) || [];

    doc.autoTable({
      head: [['Réf. article', 'Description', 'Qté', 'PU HT', 'Mtt HT']],
      body: products,
      startY: 90,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
    });

    // Totaux
    const finalY = doc.lastAutoTable.finalY + 10;
    const subTotal = order.subTotal || 0;
    const taxRate = order.taxRate || 0;
    const taxAmount = order.taxAmount || 0;
    const total = order.total || 0;

    doc.setFontSize(12);
    doc.text(`Sous-total HT : ${subTotal.toFixed(2)} €`, 10, finalY);
    doc.text(`TVA (${taxRate}%): ${taxAmount.toFixed(2)} €`, 10, finalY + 10);
    doc.text(`Total TTC : ${total.toFixed(2)} €`, 10, finalY + 20);

    // Clause et note finale
    doc.setFontSize(10);
    doc.text(
      "Les ventes sont conclues avec réserve de propriété. Le transfert de propriété n'intervient qu'après paiement complet.",
      10,
      finalY + 40
    );
    doc.text(
      "En cas de retard de paiement, des pénalités de retard seront appliquées selon l'article L 441-6 du Code de commerce.",
      10,
      finalY + 45
    );

    // Téléchargement du fichier
    doc.save(`Facture_${order.id || 'N/A'}.pdf`);
  } catch (error) {
    console.error('Error generating invoice:', error);
  }
};
