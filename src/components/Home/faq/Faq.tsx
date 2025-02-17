"use client";

import { useState } from "react";
import styles from "./faq.module.scss";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export default function Faq() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setActiveItem((prev) => (prev === id ? null : id));
  };

  const data: FAQItem[] = [
            {
            id: 'faq1',
            question: '1 - Comment fonctionnent les tarifs ?',
            answer: 'Les <strong>tarifs de base</strong> indiqués sur chaque produit sont des tarifs donnés de <em>1 à 4 jours de location</em>, soit un week-end complet du vendredi au lundi par exemple.<br/>Pour une location supérieure à 4 jours, les tarifs sont augmentés de <span style="color: red;">15% par jour</span> en moyenne selon les produits.',
        },
        {
            id: 'faq2',
            question: '2 - Comment passer ma commande et la valider ?',
            answer: 'Il est très simple de passer une commande, il suffit de vous laisssez guider tout au long du processus !<br/><ul><li>Aller sur la page du produit concerné,</li><li>Sélectionner vos dates de location sur le calendrier,</li><li>Sélectionner la quantité de produits puis ajouter au panier.</li></ul><br/>Renouvellez cette étape pour chaque produit désiré.<br/><ul><li>Connectez-vous ou inscrivez-vous,</li><li>Indiquez vos coordonnées,</li><li>Choisissez votre mode de livraison (livraison par NDS ou récupération par vos soins à nos locaux),</li><li>Indiquez les heures souhaitées de livraison/récupération,</li><li>Acceptez les conditions générales de vente et choisissez votre moyen de paiement.</li></ul>',
        },
        {
            id: 'faq3',
            question: '3 - Comment choisir mes dates de location?',
            answer: '<strong>Vos dates de locations doivent précisemment être sélectionnées du premier au dernier jour.</strong><br/>Le premier sera le jour de départ du matériel de nos locaux,<br/>Le dernier sera le jour de retour du matériel à nos locaux.<br/>Nos locaux sont fermés au public le samedi, mais les livraisons/récupérations restent possible.<br/>Nous sommes fermés le dimanche.<br/><br/> <strong>Exemple 1 : Votre événement est un mardi, mais vous voulez installer le matériel le lundi et le désinstaller le mercredi.</strong><br/>Il faudra alors simplement réserver votre matériel du lundi au mercredi (et non pas le mardi uniquement).</strong><br/>Exemple 2 : Votre événement est un samedi soir ou un dimanche et vous voulez venir chercher/ramener le matériel vous-même.<br/>Nos locaux étant fermés au public le samedi et le dimanche, il faudra alors réserver votre matériel du vendredi au lundi.<br/><br/> <strong>Exemple 3 : Votre événement est un samedi soir ou un dimanche et vous voulez être livrés.</strong> Nos locaux étant fermés le dimanche, il faudra alors réserver votre matériel du vendredi ou samedi, jusqu"au lundi.'
        },
        {
            id: 'faq4',
            question: '4 - Quel moyen de paiement puis-je utiliser ?',
            answer: 'Nous acceptons les moyens de paiement suivants :<br/><ul><li>Carte bancaire via Stripe,</li><li>Carte bancaire en 3 ou 4 fois (selon le montant de votre commande) via Alma,</li><li>Virement bancaire,</li><li>Chèque bancaire,</li><li>Espèces.</li></ul><br/><strong>Attention :</strong> Aucune commande n\'est enregistrée, ni aucun matériel réservé tant que le paiement ne nous est pas parvenu. Seuls les paiements par carte bancaire valident votre commande instantanément.<br/><br/>Pour les paiements par virement, chèque ou espèces, vous devez régler votre commande sous 48 heures pour valider cette dernière et réserver le matériel.'
        },
         {
            id: 'faq5',
            question: '5 - Quels sont les horaires et conditions de livraison ou de récupération ?',
            answer: '<strong>Horaires :</strong><br/>Lors de la commande, vous indiquerez vos souhaits horaires de livraison et récupération (ou de récupération et restitution par vos soins).<br/>Nous tenterons alors de respecter au maximum votre souhait mais cela n\'est pas toujours possible.<br/><ul><li>Dans le cadre d\'une livraison/récupération par NDS, il vous sera alors donné et confirmé un créneau horaire de 3 heures pour la livraison comme pour la récupération (exemple 9h-12h).</li><li>Dans le cadre d\'une récupération/restitution par vos soins à nos locaux, il vous sera alors donné un créneau horaire de 1 heure (exemple 16h-17h).</li></ul><br/><strong>Conditions :</strong><br/>Dans le cadre d\'une livraison/récupération par NDS, le matériel est déposé et repris exclusivement à côté du camion. Le livreur de la société NDS ne pourra en aucun cas transporter le matériel.<br/>Par ailleurs, l\'accès à l\'espace de livraison doit être possible avec un véhicule de type fourgon 20m², 3,5t, de dimensions L7xl2,5xH3,5m; par une route carrossable dont la pente est inférieure à 15%. Si l\'accès à l\'espace de livraison s\'avère impossible dans ces conditions, vous devez alors le déclarer à l\'avance afin que l\'on trouve une solution différente. Enfin, vous devez impérativement être présent lors de la livraison et la récupération.<br/><br/>Dans le cadre d\'une récupération/restitution par vos soins, le matériel sera chargé et déchargé exclusivement par vos soins dans votre véhicule, sous votre responsabilité.<br/><br/>Pour plus d\'informations, se référer aux Conditions Générales de Vente.'
        },
        {
            id: 'faq6',
            question: '6 - Comment doit-je verser mon dépôt de garantie (caution), et quel est le montant?',
            answer: 'Vous devrez obligatoirement remettre un <strong>dépôt de garantie</strong> par chèque bancaire au début de la période de location dont le montant vous sera transmis par mail au préalable.<br/><br/>Le montant du dépôt de garantie correspond à <strong>80% de la valeur Hors Taxe</strong> du matériel. Pour indication, cela correspond à environ 6 fois la valeur de la location sur 2/4 jours.<br/><br/><strong>Exemple :</strong> Si votre commande du vendredi au lundi coûte 100€ TTC, le dépôt de garantie à déposer sera alors d\'environ 600€.<br/><br/>Votre dépôt de garantie ne sera pas débité pendant la période de location et sera intégralement restitué en fin de période de location si aucun dégât n\'est constaté, si la commande a bien été payée, et si les conditions de livraison/récupération ont été respectées (chargements, déchargements, accès, etc...).<br/><br/>Pour plus d\'informations, se référer aux Conditions Générales de Vente.'
        },
        {
            id: 'faq7',
            question: '7 - Qu"en est-il si je casse ou si je perds du matériel ?',
            answer: 'Si vous cassez ou perdez du matériel pendant la période de location, il faudra simplement régler le montant des produits à remplacer au retour du matériel. Une fois réglé, le dépôt de garantie vous sera alors immédiatement restitué.<br/><br/>Pour les petites casses et pertes (vaisselle ou petit mobilier par exemple), les livreurs disposent de tableaux avec tous les tarifs de remplacements, vous pourrez alors régler directement le problème.<br/><br/>Pour les casses et pertes plus importantes (casses de tentes par exemple, ou appareils nécessitant des réparations), il sera alors effectué un chiffrage dans les 7 jours. Une fois le chiffrage reçu, vous disposerez de 14 jours pour régler votre facture. A réception de votre règlement, votre dépôt de garantie vous sera immédiatement restitué.<br/><br/>Pour plus d"informations, se référer aux Conditions Générales de Vente.'
        },
        {
            id: 'faq8',
            question: '8 - Qu"en est-il du rangement et du nettoyage du matériel loué ?',
            answer: 'Tout le matériel que nous louons est livré rangé, trié, empilé, etc... principalement dans des caisses de transport lorsque cela est possible.<br/><br/>Le <strong>lavage de la vaisselle</strong> et le <strong>lavage des tissus</strong> sont compris dans les prix de locations.<br/><br/>Pour tous les autres matériels, tout est loué propre et sec, vous devez le rendre exactement dans le même état qu\'à son départ.<br/>Pour la vaisselle et les tissus, il suffit juste de les ramener dans leurs contenants d\'origine, triés et rangés, sans les laver.<br/><br/><strong>Attention :</strong> En cas de retour de matériel sale (hors vaisselle et tissus), le lavage sera alors facturé au temps passé.<br/><br/>Pour plus d\'informations, se référer aux Conditions Générales de Vente.'
        },
        {
            id: 'faq9',
            question: '9 - Que faire si je veux annuler ou modifier ma commande ?',
            answer: 'Lorsque vous réservez du matériel, il ne peut donc bien entendu plus être loué à un autre client.<br/>C\'est pour cela que nous sommes dans l\'obligation d\'appliquer des <strong>frais d\'annulation</strong> pour toute annulation ou modification à la baisse d\'une commande.<br/>+ nous nous rapprochons des dates de locations, + les frais augmentent.<br/><br/>Pour une modification de commande à la hausse, cela restera simplement sous réserve de disponibilité.<br/><br/>Pour plus d\'informations, se référer aux Conditions Générales de Vente.'
        },
        {
            id: 'faq10',
            question: '10 - Que faire si j"ai un problème avec le matériel pendant la location ?',
            answer: 'Tout d\'abord, le matériel que nous livrons est systématiquement vérifié, à son retour comme à son départ.<br/>Ensuite, les quantités que nous livrons sont vérifiées deux fois lors des préparations et chargements.<br/>Il est donc extrêmement rare qu\'il y ait des erreurs de quantités ou des problèmes matériels.<br/><br/>Cependant, pour éviter tout litige, nous vous conseillons de vérifier votre commande dès sa réception, et nous appeler dès que possible afin que l\'on règle le problème.<br/><br/>Par ailleurs, n\'étant pas à l\'abri d\'un problème quelconque, vous disposerez toujours d\'un numéro de téléphone d\'urgence indiqué sur la fiche de livraison qui vous sera remise, sur lequel un technicien disponible en permanence vous répondra pour solutionner vos problèmes dans la mesure du possible.'
        },
    // Ajoute les autres questions ici...
  ];

  return (
    <div className={styles.faqContainer}>
      <h2>Une question ? Consultez notre FAQ</h2>
      <div className={styles.accordion}>
        {data.map((item) => (
          <div key={item.id} className={styles.accordionItem}>
            <div
              className={`${styles.accordionHeader} ${
                activeItem === item.id ? styles.active : ""
              }`}
              onClick={() => toggleItem(item.id)}
            >
              {item.question}
            </div>
            <div
              className={styles.accordionContent}
              style={{
                maxHeight: activeItem === item.id ? "none" : "0",
                overflow: activeItem === item.id ? "visible" : "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <p dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
