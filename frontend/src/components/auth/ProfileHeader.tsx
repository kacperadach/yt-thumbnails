import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { FaRegListAlt, FaUser } from "react-icons/fa";
import { showSubscriptionDialog, userSession } from "../../lib/signals";
import {
  Avatar,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { supabase } from "../../lib/supabase";
import { MdLogout } from "react-icons/md";

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
          <Flex gap="3" align="center" className="border-b-2 pb-2">
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
          <Flex align="center" justify="center" py={"2"}>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                showSubscriptionDialog.value = true;
              }}
            >
              <Flex align="center" justify="center" className="w-25">
                <IconButton variant="surface" radius="full">
                  <FaRegListAlt />
                </IconButton>
              </Flex>
              <Flex align="center" justify="start" className="w-75">
                <Text weight="medium" className="text-black">
                  Manage Subscription
                </Text>
              </Flex>
            </Button>
          </Flex>
          <Flex align="center" justify="center" py={"2"}>
            <Button
              variant="ghost"
              className="w-full"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
              }}
            >
              <Flex align="center" justify="center" className="w-25">
                <IconButton variant="surface" radius="full">
                  <MdLogout />
                </IconButton>
              </Flex>
              <Flex align="center" justify="start" className="w-75">
                <Text weight="medium" className="text-black">
                  Log Out
                </Text>
              </Flex>
            </Button>
          </Flex>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}
