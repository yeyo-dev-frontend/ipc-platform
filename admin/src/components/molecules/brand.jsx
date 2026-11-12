import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";

export function Brand() {
  return (
    <div className="flex items-center gap-3.5">
      <Title
        as="strong"
        variant="primary"
        text="IPC"
        className="text-[44px] leading-none"
      />
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
