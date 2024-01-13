import { useState } from "react";
import { useSpring, useTransition, animated } from "@react-spring/web";
import {
  Button,
  Flex,
  Text,
  TextField,
  Dialog,
  IconButton,
} from "@radix-ui/themes";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { PREMIUM_TIER, PRO_TIER, STARTER_TIER } from "../../lib/subscriptions";
import Subscription from "./Subscription";

interface SubscriptionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SubscriptionDialog(props: SubscriptionDialogProps) {
  const { open, setOpen } = props;

  return (
    <Dialog.Root open={open}>
      <Dialog.Content style={{ maxWidth: "fit-content" }}>
        <Flex justify="end">
          <IconButton onClick={() => setOpen(!open)} variant="ghost" size="4">
            <AiOutlineCloseCircle style={{ width: "2rem", height: "2rem" }} />
          </IconButton>
        </Flex>

        <Flex>
          <Subscription tier={STARTER_TIER} />
          <Subscription tier={PRO_TIER} recommended={true} />
          <Subscription tier={PREMIUM_TIER} />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
