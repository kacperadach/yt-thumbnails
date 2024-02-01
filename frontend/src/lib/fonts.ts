export const AVAILABLE_DEFAULT_FONTS = [
  "Arial",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Helvetica",
  "Impact",
  "Palatino",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

export type GoogleFont = {
  fontFamily: string;
  importName: string;
  load: () => Promise<any>;
};

export type FontOption = {
  name: string;
  fontFamily: string;
  import: () => Promise<any>;
  type: "default" | "google";
  url?: string;
  id?: string;
  weight?: number;
  isItalic?: boolean;
};

export async function getAllGoogleFonts() {
  const { getAvailableFonts } = await import("@remotion/google-fonts");
  return getAvailableFonts();
}

export async function getGoogleFontUrl(font: FontOption) {
  const loadedFont = await font.import();
  if (!loadedFont || !loadedFont.getInfo) {
    return { type: null, url: null };
  }

  const info = loadedFont.getInfo();

  if (info.fonts?.normal?.["400"]?.latin) {
    return { type: "font-face", url: info.fonts.normal["400"].latin };
  } else if (info.fonts?.normal?.["300"]?.latin) {
    return { type: "font-face", url: info.fonts.normal["300"].latin };
  } else if (info.fonts?.normal?.["400"]?.["0"]) {
    return { type: "font-face", url: info.fonts?.normal["400"]["0"] };
  } else {
    return { type: "css", url: loadedFont.getInfo().url };
  }
}

// export async function loadCustomFont(font: FontOption) {
// 	loadFontFace(font.fontFamily, font.url, font.weight, font.isItalic);
// }

export async function loadGoogleFont(font: FontOption) {
  const { type, url } = await getGoogleFontUrl(font);
  if (!type || !url) {
    return;
  }

  if (type === "font-face") {
    loadFontFace(font.fontFamily, url);
  } else {
    loadFontCss(url);
  }
}

export async function loadIfGoogleFont(fontName: string) {
  const font = (await getAllGoogleFonts()).find(
    (f) => f.fontFamily === fontName
  );
  if (!font) {
    return;
  }

  await loadGoogleFont({
    name: font.fontFamily,
    fontFamily: font.fontFamily,
    import: font.load,
    type: "google",
  });
}

function loadFontCss(fontUrl: string) {
  const linkElement = document.createElement("link");
  linkElement.href = fontUrl;
  linkElement.rel = "stylesheet";
  document.head.appendChild(linkElement);
}

function loadFontFace(
  fontFamily: string,
  fontUrl: string,
  weight = 400,
  isItalic = false
) {
  const fontStyle = isItalic ? "italic" : "normal";

  const styleElement = document.createElement("style");
  styleElement.textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: url("${fontUrl}");
            font-weight: ${weight};
            font-style: ${fontStyle};
        }
    `;
  document.head.appendChild(styleElement);
}
