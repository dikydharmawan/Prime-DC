'use client';

import { useState } from 'react';
import PropertyTable from './PropertyTable';
import UserManagement from './UserManagement';
import AuditLogs from './AuditLogs';
import styles from './DashboardContainer.module.css';
import { Building, Users, History } from 'lucide-react';

interface DashboardContainerProps {
  userRole: string;
}

export default function DashboardContainer({ userRole }: DashboardContainerProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'users' | 'logs'>('properties');

  if (userRole !== 'Superadmin') {
    return <PropertyTable userRole={userRole} />;
  }

  return (
    <div className={styles.container}>
      <div className={`no-print ${styles.tabs}`}>
        <button
          onClick={() => setActiveTab('properties')}
          className={`${styles.tabBtn} ${activeTab === 'properties' ? styles.activeTab : ''}`}
        >
          <Building size={16} />
          Daftar Properti
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.activeTab : ''}`}
        >
          <Users size={16} />
          Manajemen Akun Agent
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`${styles.tabBtn} ${activeTab === 'logs' ? styles.activeTab : ''}`}
        >
          <History size={16} />
          Log Aktivitas Mutasi
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'properties' && <PropertyTable userRole={userRole} />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'logs' && <AuditLogs />}
      </div>
    </div>
  );
}
