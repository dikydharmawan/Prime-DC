import Link from 'next/link';
import styles from './PublicFooter.module.css';

export default function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Prime</span>
            <span className={styles.logoAccent}>Property</span>
          </div>
          <p className={styles.description}>
            Agensi real estate mewah terkemuka, menghadirkan properti eksklusif untuk gaya hidup elit Anda.
          </p>
        </div>
        
        <div className={styles.links}>
          <h3 className={styles.linkTitle}>Tautan Cepat</h3>
          <ul className={styles.linkList}>
            <li><Link href="/" className={styles.link}>Beranda</Link></li>
            <li><Link href="/tentang-kami" className={styles.link}>Tentang Kami</Link></li>
            <li><Link href="/kontak" className={styles.link}>Kontak</Link></li>
          </ul>
        </div>
        
        <div className={styles.contact}>
          <h3 className={styles.linkTitle}>Hubungi Kami</h3>
          <p className={styles.contactInfo}>Email: info@primeproperty.com</p>
          <p className={styles.contactInfo}>Telp: +62 811 234 5678</p>
          <p className={styles.contactInfo}>WA: +62 811 234 5678</p>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Prime Property. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
