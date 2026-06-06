import { Building, TrendingUp, PieChart, MapPin } from 'lucide-react';
import styles from './ExecutiveSummary.module.css';

interface ExecutiveSummaryProps {
  totalCount: number;
  inStockValue: number;
  soldOutRate: number;
  topKawasan: string;
}

export default function ExecutiveSummary({
  totalCount,
  inStockValue,
  soldOutRate,
  topKawasan
}: ExecutiveSummaryProps) {
  
  const formatRupiah = (number: number) => {
    if (number >= 1000000000) {
      return `Rp ${(number / 1000000000).toFixed(1).replace('.0', '')} Miliar`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}><Building size={24} /></div>
        <div className={styles.content}>
          <p className={styles.label}>Total Inventory</p>
          <h3 className={styles.value}>{totalCount} <span className={styles.subtext}>Properti</span></h3>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapper}><TrendingUp size={24} /></div>
        <div className={styles.content}>
          <p className={styles.label}>Nilai In-Stock</p>
          <h3 className={styles.value}>{formatRupiah(inStockValue)}</h3>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapper}><PieChart size={24} /></div>
        <div className={styles.content}>
          <p className={styles.label}>Sold Out Rate</p>
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${soldOutRate}%` }}></div>
            </div>
            <h3 className={styles.value}>{soldOutRate}%</h3>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconWrapper}><MapPin size={24} /></div>
        <div className={styles.content}>
          <p className={styles.label}>Top Kawasan</p>
          <h3 className={styles.value}>{topKawasan}</h3>
        </div>
      </div>
    </div>
  );
}
