
module.exports = (decimal) => {
  const hexString = decimal.toString(16).padStart(6, '0');
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);

  const r1 = parseInt(result[1], 16) / 255;
  const g1 = parseInt(result[2], 16) / 255;
  const b1 = parseInt(result[3], 16) / 255;

  const maxColor = Math.max(r1, g1, b1);
  const minColor = Math.min(r1, g1, b1);
  //Calculate L:
  let L = (maxColor + minColor) / 2;
  let S = 0;
  let H = 0;
  if (maxColor != minColor) {
    //Calculate S:
    if (L < 0.5) {
      S = (maxColor - minColor) / (maxColor + minColor);
    } else {
      S = (maxColor - minColor) / (2.0 - maxColor - minColor);
    }
    //Calculate H:
    if (r1 == maxColor) {
      H = (g1 - b1) / (maxColor - minColor);
    } else if (g1 == maxColor) {
      H = 2.0 + (b1 - r1) / (maxColor - minColor);
    } else {
      H = 4.0 + (r1 - g1) / (maxColor - minColor);
    }
  }

  L = L * 100;
  S = S * 100;
  H = H * 60;
  if (H < 0) {
    H += 360;
  }
  return [Math.round(H / 0.036) / 100, Math.round(S), L];
};