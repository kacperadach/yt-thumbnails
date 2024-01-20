import { useEffect, useState } from "react";
import { AlertMessage, alerts } from "../../lib/signals";
import { BsX } from "react-icons/bs";
import { Flex, Text } from "@radix-ui/themes";

interface AlertProps {
  alert: AlertMessage;
}

export default function Alert(props: AlertProps) {
  const { alert } = props;

  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsDismissed(true);
      setTimeout(() => {
        alerts.value = alerts.value.map((a) => {
          if (a.id !== alert.id) {
            return a;
          }
          return {
            ...a,
            dismissed: true,
          };
        });
      }, 500);
    }, 5000);
  }, []);

  if (alert.dismissed || Date.now() - alert.createdAt > 5500) {
    return null;
  }

  return (
    <Flex
      align="center"
      justify="center"
      className={`rounded border ${
        alert.type === "error" ? "bg-red-200" : "bg-green-200"
      } p-4 my-1 ${isDismissed ? "animate-fadeOut" : "animate-fadeIn"}`}
      style={{ width: "fit-content" }}
    >
      <div>
        <Text size="6" weight="medium">
          {alert.message}
        </Text>
      </div>
      <div
        className="cursor-pointer h-full"
        onClick={() => {
          setIsDismissed(true);
          setTimeout(() => {
            alerts.value = alerts.value.map((a) => {
              if (a.id !== alert.id) {
                return a;
              }
              return {
                ...a,
                dismissed: true,
              };
            });
          }, 500);
        }}
      >
        <BsX size="1.5rem" />
      </div>
    </Flex>
  );
}
