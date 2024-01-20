import { useState } from "react";
import HomeSidebar from "./HomeSiderbar";
import Library from "./Library";
import Templates from "./Templates";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Navbar from "../layout/Navbar";
import { editingThumbnailId, homeLoading, thumbnails } from "../../lib/signals";
import { Flex } from "@radix-ui/themes";
import { Thumbnail } from "../../lib/types";
import { createThumbnail } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import SubscriptionDialog from "../subscription/SubscriptionDialog";

export default function Home() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<"templates" | "library">(
    "templates"
  );

  const onTemplateSelect = async (template: Thumbnail, templateId?: string) => {
    homeLoading.value = true;
    const response = await createThumbnail(template, templateId);
    if (response.success) {
      const newThumbnail = response.data as Thumbnail;
      thumbnails.value = [...thumbnails.value, newThumbnail];
      editingThumbnailId.value = newThumbnail.id;
      navigate(`/edit/${newThumbnail.id}`);
    }
    homeLoading.value = false;
  };

  return (
    <Container fluid className="flex-1">
      <Row className="h-full">
        <Col md={1} style={{ minWidth: "12rem" }}>
          <HomeSidebar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            onTemplateSelect={onTemplateSelect}
          />
        </Col>
        <Col className="relative flex-1">
          {homeLoading.value && (
            <Flex
              align="center"
              justify="center"
              className="absolute w-full h-full bg-white opacity-50 z-10"
            >
              <Flex align="center" justify="center" className="w-full h-full">
                <Spinner
                  style={{
                    width: "5rem",
                    height: "5rem",
                    borderWidth: "0.5rem",
                  }}
                />
              </Flex>
            </Flex>
          )}
          {selectedTab === "templates" && (
            <Templates onTemplateSelect={onTemplateSelect} />
          )}
          {selectedTab === "library" && <Library />}
        </Col>
      </Row>
    </Container>
  );
}
