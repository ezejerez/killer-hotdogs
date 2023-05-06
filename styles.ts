interface Palette {
  [key: string]: { color: string; backgroundColor: string };
}

export const palette: Palette = {
  light: {
    color: "#000",
    backgroundColor: "#fff",
  },
  dark: {
    color: "#fff",
    backgroundColor: "#012",
  },
};
