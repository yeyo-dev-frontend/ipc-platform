import { useCallback, useMemo, useState } from "react"
import { motion as Motion } from "motion/react"
import { staggerContainer } from "@/components/animations/animation"
import { Title } from "@/components/atoms/titles"
import { Paragraph } from "@/components/atoms/paragraph"
import { Button } from "@/components/atoms/button"
import { ScrollReveal } from "@/components/layouts/scrollReveal"
import { GalleryLightbox } from "@/components/molecules/shared/galleryLightBox"
import { countCells, SHOWCASE_MOSAIC } from "../../../../utils/galeryMosaicLayout"
import { infrastructureCategories, infrastructureSpaces } from "@/data/studentLife/infraestructure"
import { GalleryMosaic } from "../shared/galeryMosaic"

function InfrastructureGallery() {
  // Solo lo más importante: tantas fotos como celdas tiene el layout (7)
  const spaces = useMemo(
    () => infrastructureSpaces.slice(0, countCells(SHOWCASE_MOSAIC)),
    []
  )
  const [openIndex, setOpenIndex] = useState(null)
  const close = useCallback(() => setOpenIndex(null), [])

  return (
    <section aria-label="Nuestra infraestructura" className="bg-white">
      <div className="mx-auto w-[92%] md:w-[90%] max-w-6xl pt-6 sm:pt-10 md:pt-14 pb-16 sm:pb-20 md:pb-24">
        {/* Encabezado */}
        <Motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">

          <Title
            text="ESPACIOS PENSADOS PARA TU ROFMACIÓN"
            level="h2" 
            weight="bold" 
            className="font-hani"/>
            

          <Motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-4"
          >
            <Paragraph
              size="small"
              text="Contamos con espacios destinados al desarrollo de las actividades académicas y a la experiencia diaria de nuestros estudiantes."
              variant="secondary"
              className="font-poppins"
            />
            <Paragraph
              size="small"
              text="Conoce algunos de nuestros ambientes."
              variant="secondary"
              className="font-poppins"
            />
          </Motion.div>
        </Motion.div>

        {/* Mosaico */}
        <div className="mt-10 md:mt-14">
          <GalleryMosaic
            items={spaces}
            layout={SHOWCASE_MOSAIC}
            onOpen={setOpenIndex}
          />
        </div>

        {/* Categorías */}
        <ScrollReveal y={20} className="mt-8 sm:mt-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-euro text-xs uppercase tracking-[0.2em] text-blue-deep/70 sm:text-sm">
            {infrastructureCategories.map((category, i) => (
              <li key={category} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-orange">
                    ·
                  </span>
                )}
                {category}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* Botón */}
        <ScrollReveal y={20} delay={0.1} className="mt-8 flex justify-center">
          <Button variant="danger" onClick={() => setOpenIndex(0)}>
            Ver nuestra infraestructura
          </Button>
        </ScrollReveal>
      </div>

      {openIndex !== null && (
        <GalleryLightbox
          key={openIndex}
          items={spaces}
          startIndex={openIndex}
          onClose={close}
          label="Galería de infraestructura"
        />
      )}
    </section>
  )
}

export { InfrastructureGallery }