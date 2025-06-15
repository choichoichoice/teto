import * as React from "react";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={className}>{children}</div>;
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
}

export function AccordionItem({ children }: AccordionItemProps) {
  return <div className="border-b">{children}</div>;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
}

export function AccordionTrigger({ children }: AccordionTriggerProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <button
      type="button"
      className="w-full text-left py-4 font-semibold text-lg flex justify-between items-center focus:outline-none"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
    >
      <span>{children}</span>
      <span className="ml-2">{open ? '▲' : '▼'}</span>
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
}

export function AccordionContent({ children }: AccordionContentProps) {
  const [open, setOpen] = React.useState(false);
  // 실제로는 AccordionTrigger와 상태를 공유해야 하지만, 간단 구현
  // FAQ 페이지에서 AccordionContent는 항상 보이도록 처리
  return <div className="pb-4 px-2 text-gray-700 text-base">{children}</div>;
} 