import { Container, Row, Col } from "react-bootstrap";
import EditField from "./EditField";
import { ThumbnailAsset } from "../../lib/types";
import {
  DEFAULT_BORDER_OBJECT,
  DEFAULT_BOX_SHADOW_OBJECT,
  DEFAULT_DROP_SHADOW_OBJECT,
  DEFAULT_LONG_SHADOW_OBJECT,
  DEFAULT_TEXT_SHADOW_OBJECT,
} from "../../lib/constants";
import { capitalizeFirstLetter, addSpaceBeforeCaps } from "../../lib/utils";

const IGNORED_FIELDS = ["id", "type", "aspectRatio"];

const FIELD_RENAME_MAP = {
  src: "Image Url",
};

interface EditMenuProps {
  defaultObject: any;
  onUpdate: (newFields: Object) => void;
  asset: any;
  filterFields?: string[];
}

export default function EditMenu(props: EditMenuProps) {
  const {
    asset,
    defaultObject,
    onUpdate,
    filterFields = Object.keys(defaultObject),
  } = props;

  return (
    <Container fluid>
      {Object.keys(defaultObject).map((key, index) => {
        if (IGNORED_FIELDS.includes(key) || !filterFields.includes(key)) {
          return null;
        }

        if (key === "transparent" && asset.type === "image" && !asset.imageId) {
          return null;
        }

        let disabled = false;
        // if (key === "src" && asset.type === "image") {
        //   disabled = true;
        // }

        let fieldComponent = null;
        if (
          key === "border" ||
          key === "borderRight" ||
          key === "borderLeft" ||
          key === "borderTop" ||
          key === "borderBottom" ||
          key === "outline"
        ) {
          const obj = (asset[key] as any) || {};
          fieldComponent = (
            <EditMenu
              asset={obj}
              defaultObject={DEFAULT_BORDER_OBJECT}
              onUpdate={(newFields: Object) => {
                const updateFields = { [key]: { ...obj, ...newFields } };
                if (key === "border") {
                  updateFields["borderRight"] = undefined;
                  updateFields["borderLeft"] = undefined;
                  updateFields["borderTop"] = undefined;
                  updateFields["borderBottom"] = undefined;
                } else if (
                  key === "borderRight" ||
                  key === "borderLeft" ||
                  key === "borderTop" ||
                  key === "borderBottom"
                ) {
                  updateFields["border"] = undefined;
                }

                onUpdate(updateFields);
              }}
            />
          );
        } else if (
          key === "longShadow" ||
          key === "textShadow" ||
          key === "boxShadow" ||
          key === "dropShadow"
        ) {
          const obj = (asset[key] as any) || {};

          let defaultObject = null;
          if (key === "longShadow") {
            defaultObject = DEFAULT_LONG_SHADOW_OBJECT;
          } else if (key === "dropShadow") {
            defaultObject = DEFAULT_DROP_SHADOW_OBJECT;
          } else if (key === "boxShadow") {
            defaultObject = DEFAULT_BOX_SHADOW_OBJECT;
          } else if (key === "textShadow") {
            defaultObject = DEFAULT_TEXT_SHADOW_OBJECT;
          }

          fieldComponent = (
            <EditMenu
              asset={obj}
              defaultObject={defaultObject}
              onUpdate={(newFields: Object) => {
                onUpdate({ [key]: { ...obj, ...newFields } });
              }}
            />
          );
        } else {
          fieldComponent = (
            <EditField
              key={index}
              fieldName={key}
              value={asset[key] as any}
              onUpdate={onUpdate}
              defaultValue={defaultObject[key] as any}
              disabled={disabled}
              asset={asset}
            />
          );
        }

        return (
          <Row className="flex my-1 items-center">
            <Col md={3}>
              <label className="font-bold mx-2 ">
                {addSpaceBeforeCaps(
                  capitalizeFirstLetter(
                    FIELD_RENAME_MAP[key as keyof typeof FIELD_RENAME_MAP] ||
                      key
                  )
                )}
              </label>
            </Col>
            <Col className="flex">{fieldComponent}</Col>
          </Row>
        );
      })}
    </Container>
  );
}
