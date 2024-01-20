import { Col, Row } from "react-bootstrap";

interface LabelAndFieldProps {
  label: string;
  fieldComponent: React.ReactNode;
}

export default function LabelAndField(props: LabelAndFieldProps) {
  const { label, fieldComponent } = props;

  return (
    <Row className="flex my-1 items-center">
      <Col className="flex justify-start items-baseline">
        <label className="font-bold mr-2 whitespace-nowrap">{label}</label>
        {fieldComponent}
      </Col>
    </Row>
  );
}
