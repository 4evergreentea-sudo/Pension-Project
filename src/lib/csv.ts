import type { SavedConsultation } from '../types';
import { formatDate } from '../utils/format';

export const downloadConsultationsAsCSV = (consultations: SavedConsultation[]) => {
  if (consultations.length === 0) return;

  const headers = [
    'ID', '상담 일시', '고객명', '나이', '은퇴나이', '남은기간', '월납입액', 
    '투자목적', '위험성향', '총자산', '상담요약'
  ];

  const rows = consultations.map(c => [
    c.id,
    formatDate(c.createdAt),
    c.customerName,
    c.age,
    c.retirementAge,
    c.retirementYears,
    c.monthlyContribution,
    c.mainGoal,
    c.riskProfile,
    c.totalAssets,
    `"${c.headline?.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    '\uFEFF' + headers.join(','), // UTF-8 BOM for Korean support in Excel
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `pension-consultations-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
