import Link from "next/link"; // 🔧 Utilisation de Next.js Link
import Image from "next/image"; // Importation du composant Image de Next.js
import "./_Footer.scss";

function Footer() {
  return (
    <footer>
      <div className="container1">
        <Link href="/">
          <Image
            src="/img/home/logoHomePage.png"
            alt="Logo NDS"
            width={150}
            height={60}
            loading="lazy"
            className="footer-logo"
          />
        </Link>
        <p>
          Isère Réception est une boutique officielle de location de matériel de
          l'agence NDS Event's. Agence du groupe Star Control Europ SAS - 8
          Avenue Victor Hugo, 38130 Echirolles - FRANCE
        </p>
      </div>
      <div className="menuContainer">
        <div className="container2">
          <ul>
            <li>
              <Link href="/a-propos">A propos</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/contact">Contact</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/mentions-legales">Mentions légales</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/conditions-generales-de-vente">CGVs</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/#faq">FAQ</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
          </ul>
        </div>
        <div className="container3">
          <ul>
            <li>
              <Link href="/produits">Nos Produits</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/packs-complets">Tous nos packs</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>

            <li>
              <Link href="/la-table">La table</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/le-mobilier">Le mobilier</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/tentes">Tentes</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/decorations">Décoration</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
            <li>
              <Link href="/autres-produits">Autres produits</Link>{" "}
              {/* 🔧 Remplacement de "to" par "href" */}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
