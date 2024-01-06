import React, { useEffect } from "react";
import EditField from "../components/edit/EditField";
import { Text, Thumbnail } from "../lib/types";
import { text } from "stream/consumers";
import { typeString } from "../lib/utils";

interface EditAndRenderProps {
  thumbnail: Thumbnail;
  setThumbnail: React.Dispatch<React.SetStateAction<Thumbnail>>;
  onFinish: () => void;
}

export default function EditAndRender(props: EditAndRenderProps) {
  const { thumbnail, setThumbnail, onFinish } = props;

  const firstText = thumbnail.assets.find((a: any) => a.type === "text");
  const secondText = [...thumbnail.assets]
    .reverse()
    .find((a: any) => a.type === "text");

  const setFirstText = (text: string) => {
    setThumbnail((prev: Thumbnail) => {
      return {
        ...prev,
        assets: prev.assets.map((a) => {
          if (a.id !== firstText?.id) {
            return a;
          }

          return {
            ...a,
            text,
          };
        }),
      };
    });
  };

  const setSecondText = (text: string) => {
    setThumbnail((prev: Thumbnail) => {
      return {
        ...prev,
        assets: prev.assets.map((a) => {
          if (a.id !== secondText?.id) {
            return a;
          }

          return {
            ...a,
            text,
          };
        }),
      };
    });
  };

  useEffect(() => {
    setTimeout(() => {
      typeString("Wow Amazing!!!", 1000, setFirstText);

      setTimeout(() => {
        typeString("She Said What?!?", 1300, setSecondText);

        setTimeout(() => {
          onFinish();
        }, 1000);
      }, 1000);
    }, 300);
  }, []);

  return (
    <div className="flex-column">
      <div>
        <label className="font-bold m-2">Text</label>
        <EditField
          fieldName="text"
          value={(firstText as Text).text}
          defaultValue={""}
          onUpdate={(newFields) => {
            setFirstText(newFields.text);
          }}
        />
      </div>
      <div>
        <label className="font-bold m-2">Text</label>
        <EditField
          fieldName="text"
          value={(secondText as Text).text}
          defaultValue={""}
          onUpdate={(newFields) => {
            setSecondText(newFields.text);
          }}
        />
      </div>
    </div>
  );
}
