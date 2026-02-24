export function calculatePoints(amount) {
  let points = 10;
  if (amount.includes('reps')) {
    const num = parseInt(amount);
    if (!isNaN(num)) points = Math.floor(num / 10);
  }
  return points;
}
