import { Link } from "react-router-dom";
import SimpleThumbnail from "../logo.png";
import { Container, Row, Col } from "react-bootstrap";
import ProfileHeader from "./auth/ProfileHeader";

const redirect = process.env.REACT_APP_MARKETING_URL_REDIRECT || "/";

export default function Navbar() {
  return (
    <Container fluid className="p-2 mb-2 flex shadow-md">
      <Row className="w-full">
        <Col md={2} className="flex items-center">
          <div
            onClick={() => {
              window.location.href = redirect;
            }}
            className="flex items-center no-underline cursor-pointer"
          >
            <img src={SimpleThumbnail} className="w-16" />
            <div className="logoText">
              <span>Simple Thumbnail</span>
            </div>
          </div>
        </Col>
        <Col />
        <Col md={2} className="flex items-center justify-end">
          <ProfileHeader />
        </Col>
      </Row>
    </Container>
  );
}
