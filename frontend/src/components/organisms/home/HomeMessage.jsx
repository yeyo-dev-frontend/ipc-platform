import { ContactForm } from "../../molecules/shared/contactForm";
import { motion as Motion } from "motion/react";
import { fadeUp } from "../../animations/animation";

function HomeMessage() {
  return (
    <Motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative mx-auto my-10 w-[96%] bg-blue-deep p-4 py-6 md:my-20 md:w-[90%] md:max-w-7xl"
    >
      <ContactForm layout="home" showSteps />
    </Motion.section>
  );
}

export { HomeMessage };
