import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";
import { twMerge } from "tailwind-merge";

function PriceSummaryCard({
  title,
  items,
  footer,
  currency = "S/",
  className = "",
}) {
  return (
    <div
      className={twMerge(
        "price-summary-note relative font-hani drop-shadow-lg",
        className,
      )}
    >
      <div className="price-summary-note__paper relative bg-blue-dark py-6 pr-7 pl-11 sm:py-7 sm:pr-12 sm:pl-16">
        <span
          aria-hidden="true"
          className="price-summary-note__fold pointer-events-none absolute right-0 top-0"
        />
        <div className="grid gap-5">
          <Title
            level="h2"
            size="compact"
            variant="primary"
            weight="bold"
            align="left"
            className="pr-6 leading-snug"
          >
            {title}
          </Title>
          <dl className="grid min-w-0 divide-y divide-neutral-white/20 sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0">
            {items.map(({ text, value }) => (
              <div
                key={text}
                className="flex min-w-0 items-center justify-between gap-3 py-3 sm:flex-col sm:items-start sm:gap-2 sm:px-7 sm:py-0 sm:first:pl-0 sm:last:pr-0"
              >
                <dt className="font-poppins text-sm text-neutral-white sm:text-base">
                  {text.trim()}
                </dt>
                <dd className="whitespace-nowrap text-3xl font-bold leading-none text-orange sm:text-4xl lg:text-5xl">
                  <span className="text-[0.6em]">{currency}</span> {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {footer && (
          <Paragraph
            size="comfortable"
            variant="inherit"
            weight="bold"
            align="center"
            className="mt-5 border-t border-neutral-white/20 pt-4 leading-snug text-neutral-white"
          >
            {footer}
          </Paragraph>
        )}
      </div>
    </div>
  );
}

export { PriceSummaryCard };
