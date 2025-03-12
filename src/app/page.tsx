
import HeroBanner from '@/components/Home/heroBanner/HeroBanner';
import ShortDescription from '@/components/Home/shortDescription/ShortDescription';
import GaleryShop from '@/components/Home/galeryShop/GaleryShop';
import Evenements from '@/components/Home/evenements/Evenements';
import Partners from '@/components/Home/partners/Partners';
import Faq from '@/components/Home/faq/Faq';


import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <HeroBanner />
      <ShortDescription />
      <GaleryShop />
      <Evenements />
      <Partners />
      <div id='faq'>
      <Faq />
      </div>
    </div>
  );
}
