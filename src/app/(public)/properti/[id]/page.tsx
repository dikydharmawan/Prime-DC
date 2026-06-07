import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ChevronLeft, MessageSquare, ExternalLink } from 'lucide-react';
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

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicPropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { 
      id,
      deleted_at: null
    },
  });

  if (!property) {
    notFound();
  }

  // Pre-fill WhatsApp URL
  const waMessage = `Halo Prime Property, saya tertarik dengan properti "${property.nama_property}" di kawasan ${property.kawasan}. Mohon info selengkapnya.`;
  const waUrl = `https://wa.me/628123456789?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className={`container ${styles.detailPage}`}>
      {/* Back Link */}
      <Link href="/" className={styles.backLink}>
        <ChevronLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className={styles.contentLayout}>
        {/* Left Column: Image */}
        <div className={styles.imageColumn}>
          {property.image_url ? (
            <div className={styles.imageWrapper}>
              <img src={property.image_url} alt={property.nama_property} className={styles.propertyImage} />
            </div>
          ) : (
            <div className={styles.imagePlaceholder}>
              <MapPin size={48} color="var(--accent-gold)" />
              <p>Gambar tidak tersedia untuk properti ini</p>
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className={styles.infoColumn}>
          <div className={styles.header}>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${property.status === 'In Stock' ? styles.inStock : styles.soldOut}`}>
                {property.status}
              </span>
              <span className={styles.badgeSpec}>{property.tipe}</span>
              <span className={styles.badgeSpec}>{property.siap}</span>
            </div>
            <h1 className={styles.title}>{property.nama_property}</h1>
            <p className={styles.location}>
              <MapPin size={16} color="var(--accent-gold)" /> {property.kawasan}
            </p>
          </div>

          <div className={styles.priceContainer}>
            <label className={styles.priceLabel}>Nilai Investasi</label>
            <h2 className={styles.price}>{formatRupiah(property.price)}</h2>
          </div>

          {property.deskripsi && (
            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Deskripsi</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {property.deskripsi}
              </p>
            </div>
          )}

          {/* Specs Grid */}
          <div className={styles.specsSection}>
            <h3 className={styles.sectionTitle}>Spesifikasi Properti</h3>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Lebar</span>
                <span className={styles.specValue}>{property.lebar} m</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Panjang</span>
                <span className={styles.specValue}>{property.panjang} m</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Luas Tanah</span>
                <span className={styles.specValue}>{property.lebar * property.panjang} m²</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Tingkat</span>
                <span className={styles.specValue}>{property.tingkat} Lantai</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Hadap</span>
                <span className={styles.specValue}>{property.hadap}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Carport</span>
                <span className={styles.specValue}>{property.carport > 0 ? `${property.carport} Mobil` : 'Tidak Ada'}</span>
              </div>
              {property.group && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Grup</span>
                  <span className={styles.specValue}>{property.group}</span>
                </div>
              )}
              {property.unit && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Unit</span>
                  <span className={styles.specValue}>{property.unit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fasilitas Chips */}
          {property.fasilitas && (
            <div className={styles.specsSection}>
              <h3 className={styles.sectionTitle}>Fasilitas</h3>
              <div className={styles.fasilitasChips}>
                {property.fasilitas.split(',').map((f: string, i: number) => (
                  <span key={i} className={styles.fasilitasChip}>{f.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className={styles.actionSection}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
              Hubungi via WhatsApp
            </a>
            <Link href={`/kontak?properti=${encodeURIComponent(property.nama_property)}`} className="btn-outline" style={{ width: '100%', padding: '16px' }}>
              <MessageSquare size={16} /> Kirim Pesan / Inquiry
            </Link>
            {property.maps_link && (
              <a href={property.maps_link.startsWith('http') ? property.maps_link : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.maps_link)}`} target="_blank" rel="noopener noreferrer" className={styles.mapCard}>
                <div className={styles.mapCardIcon}>
                  <MapPin size={24} />
                </div>
                <div className={styles.mapCardContent}>
                  <h4>Lokasi Properti</h4>
                  <p>Buka peta interaktif untuk melihat rute dan area sekitar.</p>
                  <span className={styles.mapCardBtn}>Lihat Rute <ExternalLink size={14} /></span>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
