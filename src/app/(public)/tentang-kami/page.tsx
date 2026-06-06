import styles from './page.module.css';
import { Target, Eye, Gem } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami | Prime Property',
  description: 'Mengenal lebih dekat Prime Property, visi, misi, dan nilai perusahaan kami.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.title}>Mendefinisikan Ulang Kemewahan</h1>
          <p className={styles.subtitle}>
            Dedikasi tanpa henti untuk memberikan pengalaman properti eksklusif yang tidak tertandingi.
          </p>
        </div>
      </div>

      <div className={`container ${styles.contentContainer}`}>
        {/* Profile Section */}
        <section className={styles.section2Col}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>Profil Perusahaan</h2>
            <p>
              Didirikan dengan visi untuk memberikan standar baru dalam industri real estate, 
              <strong> Prime Property</strong> telah tumbuh menjadi agensi tepercaya bagi kalangan 
              elit yang mencari hunian eksklusif dan properti komersial bernilai tinggi.
            </p>
            <p>
              Dengan jaringan luas, keahlian mendalam tentang pasar lokal, dan komitmen teguh terhadap 
              kepuasan klien, kami tidak hanya menjual properti, tetapi merancang warisan untuk 
              generasi Anda selanjutnya.
            </p>
          </div>
          <div className={styles.visualContent}>
            <div className={styles.quoteBlock}>
              <p className={styles.quoteText}>
                "Kemewahan bukan sekadar tentang harga, melainkan harmoni antara estetika, fungsi, dan kualitas hidup."
              </p>
              <p className={styles.quoteAuthor}>— Founder, Prime Property</p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* Vision & Mission Section */}
        <section className={styles.section}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Eye size={32} /></div>
              <h3 className={styles.cardTitle}>Visi Kami</h3>
              <p>
                Menjadi pemimpin industri properti mewah di Indonesia yang dikenal karena 
                integritas, inovasi, dan layanan eksklusif tanpa kompromi.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.iconWrapper}><Target size={32} /></div>
              <h3 className={styles.cardTitle}>Misi Kami</h3>
              <p>
                Menghubungkan klien dengan properti impian mereka melalui proses yang transparan, 
                aman, dan memberikan nilai investasi maksimal di masa depan.
              </p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* Corporate Values */}
        <section className={styles.section}>
          <div className={styles.centerHeader}>
            <h2 className={styles.sectionTitle}>Nilai Perusahaan</h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <Gem size={24} className={styles.valueIcon} />
              <h4>Eksklusivitas</h4>
              <p>Kami menyajikan properti yang langka dan memiliki nilai estetika tinggi.</p>
            </div>
            <div className={styles.valueItem}>
              <Gem size={24} className={styles.valueIcon} />
              <h4>Integritas</h4>
              <p>Kejujuran dan transparansi adalah fondasi dari setiap transaksi kami.</p>
            </div>
            <div className={styles.valueItem}>
              <Gem size={24} className={styles.valueIcon} />
              <h4>Profesionalisme</h4>
              <p>Layanan premium oleh tim ahli yang berdedikasi penuh untuk klien.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
