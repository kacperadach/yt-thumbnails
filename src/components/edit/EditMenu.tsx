import { Container, Row, Col } from "react-bootstrap";
import EditField from "./EditField";
import { ThumbnailAsset } from "../../lib/types";
import {
  DEFAULT_BORDER_OBJECT,
  DEFAULT_LONG_SHADOW_OBJECT,
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
                onUpdate({ [key]: { ...obj, ...newFields } });
              }}
            />
          );
        } else if (key === "longShadow") {
          const obj = (asset[key] as any) || {};
          fieldComponent = (
            <EditMenu
              asset={obj}
              defaultObject={DEFAULT_LONG_SHADOW_OBJECT}
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
