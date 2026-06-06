import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';
import ExecutiveSummary from '@/components/dashboard/ExecutiveSummary';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/agent/login');
  }

  const role = session.role;
  let summaryProps = null;

  if (role === 'Superadmin') {
    // Fetch stats for Superadmin
    const [totalCount, soldOutCount, inStockProps, kawasanGroups] = await Promise.all([
      prisma.property.count({ where: { deleted_at: null } }),
      prisma.property.count({ where: { status: 'Sold Out', deleted_at: null } }),
      prisma.property.findMany({ 
        where: { status: 'In Stock', deleted_at: null },
        select: { price: true }
      }),
      // Simple raw approach for top kawasan since SQLite group by text is basic
      prisma.property.groupBy({
        by: ['kawasan'],
        _count: { kawasan: true },
        where: { deleted_at: null },
        orderBy: { _count: { kawasan: 'desc' } },
        take: 1
      })
    ]);

    const inStockValue = inStockProps.reduce((sum, p) => sum + p.price, 0);
    const soldOutRate = totalCount === 0 ? 0 : Math.round((soldOutCount / totalCount) * 100);
    const topKawasan = kawasanGroups.length > 0 ? kawasanGroups[0].kawasan : '-';

    summaryProps = {
      totalCount,
      inStockValue,
      soldOutRate,
      topKawasan,
    };
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Utama</h1>
        <p className={styles.subtitle}>Selamat datang, {role}.</p>
      </div>

      {role === 'Superadmin' && summaryProps && (
        <div className={styles.summarySection}>
          <ExecutiveSummary {...summaryProps} />
        </div>
      )}

      <div className={styles.tableSection}>
        <DashboardContainer userRole={role} />
      </div>
    </div>
  );
}
