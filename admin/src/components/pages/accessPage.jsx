import { Image } from "@ipc/image";
import campus from "@ipc/campus";
import { Brand } from "../molecules/brand";
import { AccessForm } from "../organisms/accessForm";

export function AccessPage({ step, onChange }) {
  return (
    <main className="access">
      <section className="cover">
        <Image src={campus} alt="" className="campus" loading="eager" />
        <div className="cover-content">
          <Brand />
          <div>
            <div className="accent"></div>
            <h1>
              Panel <br />
              administrativo
            </h1>
            <p>Instituto Privado Celendín</p>
          </div>
          <span className="location">Celendín, Cajamarca</span>
        </div>
      </section>
      <section className="access-side">
        <AccessForm step={step} onChange={onChange} />
      </section>
    </main>
  );
}
