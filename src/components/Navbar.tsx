import { Link } from "react-router-dom";
import SimpleThumbnail from "../logo.png";
import { Container, Row, Col } from "react-bootstrap";

export default function Navbar() {
  return (
    <Container fluid className="p-2 mb-2 flex shadow-md">
      <Row className="w-full">
        <Col md={2} className="flex items-center">
          <Link to={"/"} className="flex items-center no-underline">
            <img src={SimpleThumbnail} className="w-16" />
            <div className="logoText">
              <span>Simple Thumbnail</span>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
