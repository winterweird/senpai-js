interface IFontSourceMap {
  [name: string]: string;
}

export async function loadFonts(index: IFontSourceMap): Promise<void> {
  await Promise.all(
    Object.entries(index).map(async function([name, src]) {
      const response = await fetch(src);
      const buffer = await response.arrayBuffer();
      const font = new FontFace(name, buffer);
      await font.loaded;
      document.fonts.add(font);
    })
  );
};