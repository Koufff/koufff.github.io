const fivePercents = new Array(20).fill(0);
fivePercents[0] = 1;

export const probability = (value) => {
  if (value === 5) {
    if (fivePercents[Math.round(Math.random() * 19)] === 1) {
      return true;
    }
  
    return false;
  } else if (value === 50) {
    return !!Math.round(Math.random());
  }
}
