import { Link } from "react-router-dom";
import SimpleThumbnail from "../../logo.png";
import { Container, Row, Col } from "react-bootstrap";
import ProfileHeader from "../auth/ProfileHeader";
import { APP_NAME } from "../../lib/constants";
import { useNavigate } from "react-router-dom";
import { editingThumbnailId, selectedAssetId } from "../../lib/signals";

const redirect = process.env.REACT_APP_MARKETING_URL_REDIRECT || "/";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="p-2 mb-2 flex flex-shrink shadow-md"
      style={{ minHeight: "5rem" }}
    >
      <Row className="w-full">
        <Col md={2} className="flex items-center">
          <div
            onClick={() => {
              navigate("/");
              editingThumbnailId.value = null;
              selectedAssetId.value = null;
            }}
            className="flex items-center no-underline cursor-pointer"
          >
            <img src={SimpleThumbnail} alt="SimpleThumbnail" className="w-16" />
            <div className="logoText">
              <span>{APP_NAME}</span>
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
