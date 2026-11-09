import { Paragraph } from "../atoms/paragraph";

export function Brand() {
  return (
    <div className="flex items-center gap-3.5">
      <strong className="font-hani text-[44px] leading-none font-bold">
        IPC
      </strong>
      <Paragraph
        as="span"
        className="border-l border-current pl-3.5 text-[13px] leading-[1.35]"
      >
        Instituto Privado
        <br />
        Celendín
      </Paragraph>
    </div>
  );
}
