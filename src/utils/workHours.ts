export function isOpenNow(workOpen?: string, workClose?: string): boolean | null {
  if (!workOpen || !workClose) return null;

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bishkek' }));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = workOpen.split(':').map(Number);
  const [closeH, closeM] = workClose.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes > openMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
}

export function formatWorkHours(workOpen?: string, workClose?: string): string {
  if (!workOpen || !workClose) return '';
  return `${workOpen} – ${workClose}`;
}
