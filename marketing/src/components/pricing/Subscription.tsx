import SubscriptionFeature from "./SubscriptionFeature";
import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import "./styles.css";

interface SubscriptionProps {
  tier: Tier;
  recommended?: boolean;
  appUrl: string;
}

export default function Subscription(props: SubscriptionProps) {
  const { tier, recommended, appUrl } = props;

  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <div
      className="relative w-1/3 m-8 hover:scale-110 transition duration-300 ease-in-out overflow-visible border-gray border-2 rounded-lg"
      style={{ maxWidth: "30rem" }}
    >
      {recommended && (
        <div
          className="absolute w-auto bg-brand text-white top-0 -left-5 p-1 rounded-md z-20"
          style={{ transform: "rotate(-20deg)" }}
        >
          <div weight="medium">Recommended</div>
        </div>
      )}
      <div style={{ minWidth: "25rem" }}>
        <div className="flex flex-col justify-center items-start px-4">
          <div className="flex justify-center items-center w-full">
            <div className="text-4xl my-4 text-gradient">{tier.name}</div>
          </div>

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

          <div className="flex justify-center items-center w-full my-5">
            <div className="font-bold text-6xl mx-1">
              ${period === "monthly" ? tier.price.monthly : tier.price.yearly}
            </div>
            <div className="font-regular">
              {period === "monthly" ? "/mo" : "/yr"}
            </div>
          </div>

          <div className="flex justify-center items-center w-full">
            <div
              className={`mx-2 font-medium ${
                period === "yearly" && "text-white"
              }`}
            >
              Monthly
            </div>
            <form>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Switch.Root
                  className="SwitchRoot"
                  checked={period === "yearly"}
                  onCheckedChange={() => {
                    console.log("changed");
                    if (period === "monthly") {
                      setPeriod("yearly");
                    } else {
                      setPeriod("monthly");
                    }
                  }}
                >
                  <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
              </div>
            </form>

            <div
              className={`mx-2 font-medium ${
                period === "monthly" && "text-white"
              }`}
            >
              Yearly
            </div>
          </div>

          <div className="flex justify-center items-center w-full px-10 my-8">
            <div
              size="4"
              style={{ minWidth: "12rem" }}
              className="bg-brand text-white text-center p-2 rounded-lg text-2xl cursor-pointer"
            >
              <a href={appUrl}>Sign Up Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
