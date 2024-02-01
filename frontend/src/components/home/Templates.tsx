import { Container, Col, Row } from "react-bootstrap";
import { Thumbnail } from "../../lib/types";
import { TEMPLATES } from "../../lib/templates/templates";
import Option from "./Option";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { homeLoading, templates } from "../../lib/signals";
import { fetchTemplates } from "../../lib/api";
import { PiMaskSadLight } from "react-icons/pi";

interface TemplatesProps {
  onTemplateSelect: (template: Thumbnail, templateId?: string) => void;
}

export default function Templates(props: TemplatesProps) {
  const { onTemplateSelect } = props;

  const [templateType, setTemplateType] = useState<"default" | "custom">(
    "default"
  );
  const [fetchedTemplates, setFetchedTemplates] = useState(false);

  useEffect(() => {
    if (templateType !== "custom") {
      return;
    }

    if (templates.value.length > 0) {
      return;
    }

    const getTemplates = async () => {
      homeLoading.value = true;
      const response = await fetchTemplates();
      if (response.success) {
        templates.value = [...response.data, ...templates.value];
      }
      homeLoading.value = false;
      setFetchedTemplates(true);
    };

    getTemplates();
  }, [templateType]);

  return (
    <Container fluid>
      <div>
        <Row className="my-2">
          <Flex>
            <Button
              mx="2"
              variant={templateType === "default" ? "solid" : "outline"}
              onClick={() => setTemplateType("default")}
            >
              Default
            </Button>
            <Button
              mx="2"
              variant={templateType === "custom" ? "solid" : "outline"}
              onClick={() => setTemplateType("custom")}
            >
              Custom
            </Button>
          </Flex>
        </Row>
        <Row className="flex">
          {templates.value.length === 0 &&
            fetchedTemplates &&
            templateType === "custom" && (
              <Col>
                <div className="flex flex-column justify-center items-center">
                  <PiMaskSadLight size="5rem" className="text-brand-green" />
                  <h1 className="text-2xl font-bold text-center">
                    No custom templates found
                  </h1>
                  <Text>
                    To create a custom template, first create a Thumbnail and
                    then save it as a template.
                  </Text>
                </div>
              </Col>
            )}

          {templateType === "custom" &&
            templates.value.map((template, index) => {
              return (
                <Option
                  key={index}
                  thumbnailOption={template.template}
                  onSelect={() =>
                    onTemplateSelect(template.template, template.id)
                  }
                />
              );
            })}

          {templateType === "default" &&
            TEMPLATES.map((template, index) => {
              return (
                <Option
                  key={index}
                  thumbnailOption={template}
                  onSelect={onTemplateSelect}
                />
              );
            })}
        </Row>
      </div>
    </Container>
  );
}
