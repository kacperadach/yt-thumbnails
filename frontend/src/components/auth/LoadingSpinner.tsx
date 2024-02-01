import { Spinner } from "react-bootstrap";
import SimpleThumbnail from "../../logo.webp";
import { Box, Flex } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { typeString } from "../../lib/utils";
import { APP_NAME } from "../../lib/constants";

export default function LoadingSpinner() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    typeString(APP_NAME, 1000, setTitle);
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      className="my-8"
      style={{ height: "100vh" }}
    >
      <Box>
        <Flex align="center" justify="center" className="my-16">
          <Spinner style={{ width: "3rem", height: "3rem" }} size="sm" />
        </Flex>
        <Flex align="center" justify="center">
          <img src={SimpleThumbnail} alt="SimpleThumbnail" className="w-16 " />
          <div className="logoText">{title}</div>
        </Flex>
      </Box>
    </Flex>
  );
}
