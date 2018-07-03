interface IFontSourceMap {
  [name: string]: string;
}
const fontIndex: IFontSourceMap = require("../../assets/fonts/*.otf");

export async function loadFonts(): Promise<void> {
  await Promise.all(
    Object.entries(fontIndex).map(async function([name, src]) {
      const response = await fetch(src);
      const buffer = await response.arrayBuffer();
      const font = new FontFace(name, buffer);
      await font.loaded;
      document.fonts.add(font);
    })
  );
};