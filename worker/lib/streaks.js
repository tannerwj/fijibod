export function calculateCurrentStreak(workoutDays) {
  let streak = 0;
  if (workoutDays.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    let expected = today;
    for (const row of workoutDays) {
      if (row.day === expected) {
        streak++;
        const d = new Date(expected);
        d.setDate(d.getDate() - 1);
        expected = d.toISOString().split('T')[0];
      } else if (row.day < expected) {
        break;
      }
    }
  }
  return streak;
}

export function calculateLongestStreak(workoutDays) {
  let longest = 0, run = 0;
  for (let i = 0; i < workoutDays.length; i++) {
    if (i === 0) {
      run = 1;
    } else {
      const prev = new Date(workoutDays[i - 1].day);
      prev.setDate(prev.getDate() - 1);
      run = prev.toISOString().split('T')[0] === workoutDays[i].day ? run + 1 : 1;
    }
    longest = Math.max(longest, run);
  }
  return longest;
}
