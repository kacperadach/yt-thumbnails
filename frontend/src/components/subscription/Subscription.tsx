import { Button, Card, Flex, Switch, Text } from "@radix-ui/themes";
import { Tier } from "../../lib/subscriptions";
import SubscriptionFeature from "./SubscriptionFeature";
import { useState } from "react";
import { createCheckoutSession } from "../../lib/api";
import { Spinner } from "react-bootstrap";

interface SubscriptionProps {
  tier: Tier;
  recommended?: boolean;
}

export default function Subscription(props: SubscriptionProps) {
  const { tier, recommended } = props;

  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [creatingCheckoutSession, setCreatingCheckoutSession] = useState(false);

  return (
    <div className="relative w-1/3 m-8 hover:scale-110 transition duration-300 ease-in-out overflow-visible">
      {recommended && (
        <div
          className="absolute w-auto bg-brand-green text-white top-0 -left-5 p-1 rounded-md z-20"
          style={{ transform: "rotate(-20deg)" }}
        >
          <Text weight="medium">Recommended</Text>
        </div>
      )}
      <Card style={{ minWidth: "25rem" }}>
        <Flex justify="center" align="start" direction="column" px="4">
          <Flex justify="center" align="center" className="w-full">
            <Text size="8" className="logoText my-4">
              {tier.name}
            </Text>
          </Flex>

          <SubscriptionFeature
            value={tier.renders}
            isMonthly={true}
            label="Thumbnail Renders"
          />

          <SubscriptionFeature
            value={tier.images}
            isMonthly={true}
            label="Uploaded Images"
          />

          <SubscriptionFeature
            value={tier.videos}
            isMonthly={true}
            label="Youtube and Twitch Videos"
          />

          <SubscriptionFeature
            value={tier.customTemplates}
            isMonthly={false}
            label="Custom Templates"
          />

          <SubscriptionFeature
            value={tier.aiImages}
            isMonthly={true}
            label="AI Generated Images"
          />

          <Flex justify="center" align="center" className="w-full" my="5">
            <Text weight="bold" size="9" mx="1">
              ${period === "monthly" ? tier.price.monthly : tier.price.yearly}
            </Text>
            <Text weight="regular" size="3">
              {period === "monthly" ? "/mo" : "/yr"}
            </Text>
          </Flex>

          <Flex justify="center" align="center" className="w-full">
            <Text
              mx="2"
              weight="medium"
              className={`${period === "yearly" && "text-white"}`}
            >
              Monthly
            </Text>
            <Switch
              onCheckedChange={() => {
                if (period === "monthly") {
                  setPeriod("yearly");
                } else {
                  setPeriod("monthly");
                }
              }}
            />
            <Text
              mx="2"
              weight="medium"
              className={`${period === "monthly" && "text-white"}`}
            >
              Yearly
            </Text>
          </Flex>

          <Flex justify="center" align="center" className="w-full px-10 my-4">
            <Button
              size="4"
              style={{ minWidth: "12rem" }}
              onClick={async () => {
                // const priceId =
                //   period === "monthly"
                //     ? tier.priceId.monthly
                //     : tier.priceId.yearly;
                setCreatingCheckoutSession(true);
                const response = await createCheckoutSession(
                  tier.name.toLowerCase() + "_" + period
                );
                if (response.success) {
                  window.location.href = response.data.url;
                }
                setCreatingCheckoutSession(false);
              }}
            >
              {creatingCheckoutSession ? (
                <Spinner />
              ) : (
                <Text size="6">Sign Up Now</Text>
              )}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}
