import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { userSession } from "../../lib/signals";
import {
  Avatar,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import { supabase } from "../../lib/supabase";

export default function ProfileHeader() {
  if (!userSession.value) {
    return null;
  }

  const { user } = userSession.value;

  return (
    <Flex gap="2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            variant="ghost"
            radius="full"
            className="border-0 active:border-0 focus-visible:border-0 focus-visible:outline-0"
          >
            <Avatar
              fallback={user.email ? user.email.substring(0, 1) : "A"}
              variant="solid"
              radius="full"
              className="cursor-pointer"
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {/* <Card style={{ maxWidth: "15rem" }}> */}
          <Flex gap="3" align="center">
            <Avatar
              fallback={user.email ? user.email.substring(0, 1) : "A"}
              variant="solid"
              radius="full"
            />
            <Box>
              <Text as="div" size="2" weight="bold">
                {user.email || ""}
              </Text>
            </Box>
          </Flex>
          <Flex gap="3" align="center" my={"2"}>
            <Button
              variant="classic"
              size={"2"}
              className="w-50"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
              }}
            >
              Log Out
            </Button>
          </Flex>
          {/* </Card> */}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}
