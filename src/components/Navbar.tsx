import { Link } from "react-router-dom";
import logo from "../logo.svg";
import { Container, Row, Col } from "react-bootstrap";

export default function Navbar() {
  return (
    <Container fluid className="p-2 mb-2 flex shadow-md">
      <Row className="w-full">
        <Col md={1} className="flex justify-center">
          <Link to={"/"}>
            <img src={logo} className="w-16" />
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
