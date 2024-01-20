import * as Accordion from "@radix-ui/react-accordion";
import { Flex } from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface AccordionItemProps {
  value: string;
  label: string;
  body: React.ReactNode;
}

export default function AccordionItem(props: AccordionItemProps) {
  const { value, label, body } = props;

  return (
    <Accordion.Item value={value}>
      <Accordion.Trigger className="w-full flex flex-1 items-center justify-start font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
        <label className="font-bold mr-2 whitespace-nowrap cursor-pointer">
          {label}
        </label>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </Accordion.Trigger>
      <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        {body}
      </Accordion.Content>
    </Accordion.Item>
  );
}
