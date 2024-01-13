import { Flex, Text } from "@radix-ui/themes";

interface SubscriptionFeatureProps {
  value: number | "Unlimited";
  isMonthly: boolean;
  label: string;
}

export default function SubscriptionFeature(props: SubscriptionFeatureProps) {
  const { value, isMonthly, label } = props;

  return (
    <Flex justify="center" align="center" my="2">
      <Text
        size="4"
        weight="bold"
        className={`${value === "Unlimited" && "logoText"}`}
        mx="2"
      >
        {value}
      </Text>
      <Text>{label}</Text>
      {value !== "Unlimited" && isMonthly && (
        <Text weight="light" size="2" mx="1">
          /mo
        </Text>
      )}
    </Flex>
  );
}
