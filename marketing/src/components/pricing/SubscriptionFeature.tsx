interface SubscriptionFeatureProps {
  value: number | "Unlimited";
  isMonthly: boolean;
  label: string;
}

export default function SubscriptionFeature(props: SubscriptionFeatureProps) {
  const { value, isMonthly, label } = props;

  return (
    <div className="my-2 justify-center items-center">
      <span
        className={`font-bold text-2xl mx-2 ${
          value === "Unlimited" && "text-gradient"
        }`}
      >
        {value}
      </span>
      <span>{label}</span>
      {value !== "Unlimited" && isMonthly && (
        <span className="mx-1 font-light text-sm">/mo</span>
      )}
    </div>
  );
}
