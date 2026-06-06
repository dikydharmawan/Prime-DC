import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { Shield, Star, Home, MapPin } from 'lucide-react';
import styles from './page.module.css';

const prisma = new PrismaClient();

// Helper to format currency
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function LandingPage() {
  // Fetch up to 6 highlighted properties (e.g. in stock, ordered by newest)
  const highlightedProperties = await prisma.property.findMany({
    where: { 
      status: 'In Stock',
      deleted_at: null
    },
    orderBy: { created_at: 'desc' },
    take: 6,
  });

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>
            Elegansi <span className={styles.heroHighlight}>Tanpa Batas</span>. <br />
            Investasi Properti Masa Depan.
          </h1>
          <p className={styles.heroSubtitle}>
            Temukan hunian mewah dan ruang komersial premium yang dirancang eksklusif untuk melengkapi gaya hidup Anda.
          </p>
          <Link href="/kontak" className={`btn-primary ${styles.heroBtn}`}>
            Hubungi Kami
          </Link>
        </div>

        {/* Wave Animation Overlay */}
        <div className={styles.wavesContainer}>
          <svg className={styles.waves} xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
            </defs>
            <g className={styles.parallax}>
              <use href="#gentle-wave" x="48" y="0" fill="rgba(201, 169, 97, 0.05)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(201, 169, 97, 0.1)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(26, 26, 26, 0.2)" />
              <use href="#gentle-wave" x="48" y="7" fill="var(--bg-main)" />
            </g>
          </svg>
        </div>
      </section>

      {/* Properti Unggulan Section */}
      <section className={styles.propertiesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Properti Unggulan</h2>
            <p className={styles.sectionSubtitle}>Koleksi eksklusif dari portfolio terbaik kami.</p>
          </div>

          {highlightedProperties.length > 0 ? (
            <div className={styles.propertyGrid}>
              {highlightedProperties.map(property => (
                <Link href={`/properti/${property.id}`} key={property.id} className={styles.propertyCard}>
                  {property.image_url ? (
                    <div className={styles.propertyImageContainer}>
                      <img src={property.image_url} alt={property.nama_property} className={styles.propertyImage} />
                    </div>
                  ) : (
                    <div className={styles.propertyImagePlaceholder}>
                      <MapPin size={32} color="var(--accent-gold)" />
                      <span>{property.kawasan}</span>
                    </div>
                  )}
                  <div className={styles.propertyContent}>
                    <div className={styles.propertyHeader}>
                      <h3 className={styles.propertyTitle}>{property.nama_property}</h3>
                      <span className={styles.propertyBadge}>{property.status}</span>
                    </div>
                    <p className={styles.propertyPrice}>{formatRupiah(property.price)}</p>
                    <div className={styles.propertyDetails}>
                      <span>{property.tipe}</span> • 
                      <span>{property.lebar} x {property.panjang} m</span> • 
                      <span>{property.tingkat} Lantai</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Home size={48} color="var(--accent-gold)" opacity={0.5} />
              <p>Belum ada properti unggulan saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Mengapa Prime Property */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mengapa Prime Property?</h2>
            <p className={styles.sectionSubtitle}>Keunggulan layanan dan dedikasi kami untuk Anda.</p>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Star size={32} />
              </div>
              <h3 className={styles.featureTitle}>Kualitas Premium</h3>
              <p className={styles.featureDesc}>Kami hanya menawarkan properti dengan standar kualitas tinggi, lokasi strategis, dan desain arsitektur yang menawan.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Shield size={32} />
              </div>
              <h3 className={styles.featureTitle}>Keamanan Transaksi</h3>
              <p className={styles.featureDesc}>Setiap proses transaksi dijamin legalitasnya. Tim ahli kami mendampingi Anda dari awal hingga serah terima kunci.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Home size={32} />
              </div>
              <h3 className={styles.featureTitle}>Investasi Menguntungkan</h3>
              <p className={styles.featureDesc}>Nilai investasi yang terus bertumbuh dengan pemilihan lokasi di kawasan dengan potensi perkembangan tertinggi.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
