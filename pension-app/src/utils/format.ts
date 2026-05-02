export const formatCurrency = (amount: number): string => {
  if (amount >= 100000000) {
    const eok = Math.floor(amount / 100000000);
    const remaining = Math.round((amount % 100000000) / 10000);
    return `${eok}억 ${remaining > 0 ? remaining.toLocaleString() + '만' : ''}원`;
  }
  return `${Math.round(amount / 10000).toLocaleString()}만원`;
};

export const formatPercent = (value: number): string => {
  return `${value}%`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
