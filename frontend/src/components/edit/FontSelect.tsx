import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  AVAILABLE_DEFAULT_FONTS,
  FontOption,
  GOOGLE_FONTS,
  getGoogleFontUrl,
  loadGoogleFont,
} from "../../lib/fonts";
import { Dropdown } from "react-bootstrap";

interface FontSelectProps {
  selectedFont: string;
  onUpdate: (font: string) => void;
}

export default function FontSelect(props: FontSelectProps) {
  const { selectedFont, onUpdate } = props;

  const [fontFilter, setFontFilter] = useState<"default" | "google">("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedFonts, setLoadedFonts] = useState<FontOption[]>([]);
  const [visibleFonts, setVisibleFonts] = useState<FontOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadedFontsRef = useRef(loadedFonts);

  const allAvailableFonts: FontOption[] = useMemo(() => {
    const defaultFontOptions: FontOption[] = AVAILABLE_DEFAULT_FONTS.map(
      (font) => {
        return {
          name: font,
          fontFamily: font,
          import: () => Promise.resolve(),
          type: "default",
        };
      }
    );
    const googleFontOptions: FontOption[] = GOOGLE_FONTS.map((font) => {
      return {
        name: font.fontFamily,
        fontFamily: font.fontFamily,
        import: font.load,
        type: "google",
      };
    });

    let allFonts = [];
    if (fontFilter === "default") {
      allFonts.push(...defaultFontOptions);
    } else if (fontFilter === "google") {
      allFonts.push(...googleFontOptions);
    }

    // Filter fonts based on the search input
    if (searchQuery !== "") {
      allFonts = allFonts.filter((font) =>
        font.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort fonts prioritizing those that start with the search input and then alphabetically
    const lowerCaseSearchInput = searchQuery.toLowerCase();
    allFonts.sort((a: FontOption, b: FontOption) => {
      // Assign scores to types
      // If from different types, sort by score.
      const score: { google: number; default: number } = {
        google: 1,
        default: 2,
      };

      // If from the same type, sort by name.
      if (a.type === b.type) {
        const aNameLowerCase = a.name.toLowerCase();
        const bNameLowerCase = b.name.toLowerCase();
        if (
          aNameLowerCase.startsWith(lowerCaseSearchInput) &&
          !bNameLowerCase.startsWith(lowerCaseSearchInput)
        ) {
          return -1;
        } else if (
          !aNameLowerCase.startsWith(lowerCaseSearchInput) &&
          bNameLowerCase.startsWith(lowerCaseSearchInput)
        ) {
          return 1;
        }
        return aNameLowerCase.localeCompare(bNameLowerCase);
      }

      return score[a.type] - score[b.type];
    });

    return allFonts;
  }, [searchQuery, fontFilter]);

  const unloadFont = useCallback(
    async (font: FontOption) => {
      let url;
      if (font.type === "google") {
        const googleFontUrl = await getGoogleFontUrl(font);
        if (!googleFontUrl.url) {
          return;
        }
        url = googleFontUrl.url;
      } else if (font.type === "default") {
        return;
      }

      const fontToUnload = new FontFace(font.name, `url(${url})`);
      document.fonts.delete(fontToUnload);
      setLoadedFonts((prev) =>
        prev.filter((loadedFont) => loadedFont !== font)
      );
    },
    [setLoadedFonts]
  );

  useEffect(() => {
    if (dropdownOpen) {
      return;
    }

    loadedFonts.forEach((font) => {
      unloadFont(font);
    });
  }, [dropdownOpen, loadedFonts, unloadFont]);

  useEffect(() => {
    const canLoad = (font: FontOption) => {
      if (!font) {
        return false;
      }

      if (font.type === "default") {
        return false;
      } else if (font.type === "google") {
        return !!font.import;
      }
      return false;
    };

    const loadFont = async (font: FontOption) => {
      //   if (!document.fonts.check(`1em "${font.fontFamily}"`)) {
      if (font.type === "google") {
        await loadGoogleFont(font);
      }
      //   }
    };

    observer.current = new IntersectionObserver((entries) => {
      let highestIndex = 0;

      entries.forEach(async (entry) => {
        const index = parseInt(
          (entry.target as HTMLElement).dataset.index || "",
          10
        );
        const font = allAvailableFonts[index];
        if (!entry.isIntersecting) {
          if (loadedFontsRef.current.includes(font)) {
            unloadFont(font);
          }

          setVisibleFonts((prev) =>
            prev.filter((visibleFont) => visibleFont !== font)
          );

          return;
        }

        setVisibleFonts((prev) => {
          if (prev.includes(font)) {
            return prev;
          }
          return [...prev, font];
        });

        if (index > highestIndex) {
          highestIndex = index;
        }

        if (canLoad(font)) {
          setLoadedFonts((prev) => [...prev, font]);
          loadFont(font);
        }
      });

      // Preload the next 5 fonts
      for (let i = highestIndex + 1; i < highestIndex + 5; i++) {
        const font = allAvailableFonts[i];
        if (canLoad(font)) {
          loadFont(font);
        }
      }
    });
  }, [allAvailableFonts, unloadFont, dropdownOpen]);

  useEffect(() => {
    const { current: currentObserver } = observer;
    if (!currentObserver) {
      return;
    }
    const elements = document.querySelectorAll(".font-option");
    elements.forEach((el) => currentObserver.observe(el));
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [allAvailableFonts, dropdownOpen]);

  return (
    <Dropdown
      className="bg-white text-black"
      onToggle={() => setDropdownOpen((prev) => !prev)}
    >
      <Dropdown.Toggle className="bg-white text-black border border-2 rounded-md">
        {selectedFont}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="flex-column border-bottom py-2">
          <div className="flex justify-center items-center ">
            <button
              className={`border rounded mx-2 p-2 ${
                fontFilter === "default" && "bg-brand-green text-white"
              }`}
              onClick={() => setFontFilter("default")}
            >
              Default
            </button>
            <button
              className={`border rounded mx-2 p-2 ${
                fontFilter === "google" && "bg-brand-green text-white"
              }`}
              onClick={() => setFontFilter("google")}
            >
              Google
            </button>
          </div>
          <div>
            <input
              className="border rounded m-2 p-1"
              placeholder="Search"
              value={searchQuery}
              onChange={(e: any) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ maxHeight: "20rem" }} className="overflow-scroll">
          {allAvailableFonts.map((font, index) => {
            return (
              <Dropdown.Item
                data-index={index}
                key={index}
                onClick={() => onUpdate(font.fontFamily)}
                style={{
                  fontFamily: visibleFonts.includes(font)
                    ? `${font.fontFamily}`
                    : undefined,
                  fontWeight: font.weight,
                  maxWidth: "12rem",
                }}
                className="font-option"
              >
                {font.name}
              </Dropdown.Item>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
