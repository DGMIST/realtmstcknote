const getRandomColor = (): string => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateGradientColor = (): string => {
  var randomColor1 = getRandomColor();
  var randomColor2 = getRandomColor();
  var angle = Math.floor(Math.random() * 360);
  var gradient =
    "linear-gradient(" +
    angle +
    "deg, " +
    randomColor1 +
    ", " +
    randomColor2 +
    ")";
  return gradient;
};
