import { alerts } from "../../lib/signals";
import Alert from "./Alert";
import { Flex } from "@radix-ui/themes";

export default function AlertBanner() {
  return (
    <Flex
      className="absolute"
      style={{
        width: "fit-content",
        top: "5%",
        zIndex: 100,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      justify="center"
      align="center"
      direction="column"
    >
      {alerts.value.map((alert) => {
        return <Alert key={alert.id} alert={alert} />;
      })}
    </Flex>
  );
}
