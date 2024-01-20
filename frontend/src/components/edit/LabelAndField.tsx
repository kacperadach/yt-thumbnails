import { Col, Row } from "react-bootstrap";

interface LabelAndFieldProps {
  label: string;
  fieldComponent: React.ReactNode;
  wrap?: boolean;
}

export default function LabelAndField(props: LabelAndFieldProps) {
  const { label, fieldComponent, wrap } = props;

  return (
    <Row className="flex my-1 items-center" style={{ minHeight: "2.5rem" }}>
      <Col className={`flex justify-start items-center ${wrap && "flex-wrap"}`}>
        <label
          style={{ minHeight: "2.5rem" }}
          className="font-bold mr-2 whitespace-nowrap flex items-center"
        >
          {label}
        </label>
        {fieldComponent}
      </Col>
    </Row>
  );
}
