import { useState } from "react";
import HomeSidebar from "./HomeSiderbar";
import Library from "./Library";
import Templates from "./Templates";
import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<"templates" | "library">(
    "templates"
  );

  return (
    <Container fluid>
      <Row>
        <Col md={1}>
          <HomeSidebar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </Col>
        <Col md={11}>
          {selectedTab === "templates" && <Templates />}
          {selectedTab === "library" && <Library />}
        </Col>
      </Row>
    </Container>
  );
}
