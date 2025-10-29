<template>
  <q-page class="landing-page" padding>
    <!-- HERO -->
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <div class="hero-text">
          <q-badge color="black" text-color="white" class="q-mb-md" rounded>
            Distribuidora Oficial — Galaxia Glamour Lashes
          </q-badge>

          <h1 id="hero-title" class="hero-title">
            Insumos profesionales para
            <span class="accent">pestañas pelo a pelo</span>
          </h1>

          <p class="hero-subtitle">
            Somos <strong>distribuidora oficial</strong> de
            <strong>Galaxia Glamour Lashes</strong> en Colombia. Abastecemos
            estudios y lashistas con productos probados, soporte técnico y
            entregas rápidas.
          </p>

          <ul class="hero-bullets" aria-label="Principales ventajas">
            <li>
              <q-icon name="bi-patch-check-fill" size="20px" class="q-mr-sm" />
              Stock constante y controlado
            </li>
            <li>
              <q-icon name="bi-truck" size="20px" class="q-mr-sm" />
              Envíos a todo Colombia
            </li>
            <li>
              <q-icon name="bi-headset" size="20px" class="q-mr-sm" />
              Asesoría técnica para principiantes y avanzadas
            </li>
          </ul>

          <div class="cta-buttons">
            <q-btn
              size="lg"
              rounded
              unelevated
              color="black"
              text-color="white"
              label="Ver catálogo"
              aria-label="Ver catálogo Galaxia Glamour"
              @click="$router.push('/catalogo')"
              class="cta-primary"
            />
            <q-btn
              size="lg"
              rounded
              outline
              color="black"
              label="Conocer más"
              aria-label="Ir a características"
              @click="scrollToFeatures"
              class="cta-secondary q-ml-md"
            />
            <q-btn
              size="lg"
              rounded
              flat
              color="black"
              icon="bi-whatsapp"
              label="Asesoría por WhatsApp"
              aria-label="Abrir WhatsApp para asesoría"
              :href="whatsHref"
              target="_blank"
              rel="noopener"
              class="cta-whatsapp q-ml-md"
            />
          </div>
        </div>

        <div class="hero-image">
          <img
            src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_ee8vtoee8vtoee8v.png?updatedAt=1761697218447"
            alt="Galaxia Glamour Lashes — Insumos profesionales para extensiones de pestañas"
            class="main-hero-img"
            width="620"
            height="520"
            loading="eager"
            fetchpriority="high"
            style="
              max-width: 100%;
              height: auto;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            "
          />
        </div>
      </div>
    </section>

    <!-- PRODUCT LINES / FEATURES -->
    <section
      class="features-section"
      ref="featuresSection"
      aria-labelledby="features-title"
    >
      <div class="section-header">
        <h2 id="features-title" class="section-title">
          Líneas de producto y técnicas
        </h2>
        <p class="section-subtitle">
          Insumos integrales para técnicas desde <strong>clásica</strong> hasta
          <strong>volumen con fibra tecnológica</strong>.
        </p>
      </div>

      <div class="features-grid">
        <article class="feature-card" aria-labelledby="ft1">
          <div class="feature-image">
            <img
              src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_99zwvf99zwvf99zw.png?updatedAt=1761695731771"
              alt="Pestañas clásicas Galaxia Glamour"
              width="900"
              height="560"
              loading="lazy"
              style="
                width: 100%;
                height: auto;
                border-radius: 12px;
                display: block;
              "
            />
          </div>
          <div class="feature-content">
            <h3 id="ft1" class="feature-title">
              Pestañas para Técnica Clásica
            </h3>
            <p class="feature-description">
              Tiras de fibra PBT de alta pureza, grosor estable (p. ej.
              0.10–0.15), curvaturas C/D y longitudes 7–14&nbsp;mm. Corte cónico
              para mejor adhesión, banda flexible y acabado negro intenso.
            </p>
            <div class="feature-chips">
              <q-chip outline icon="bi-scissors">Corte cónico</q-chip>
              <q-chip outline icon="bi-circle-half">Negro profundo</q-chip>
              <q-chip outline icon="bi-bezier">Curvas C/D</q-chip>
            </div>
          </div>
        </article>

        <article class="feature-card" aria-labelledby="ft2">
          <div class="feature-image">
            <img
              src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_f2uprrf2uprrf2up.png?updatedAt=1761695663100"
              alt="Volumen con fibra tecnológica, YY y 4Dw"
              width="900"
              height="560"
              loading="lazy"
              style="
                width: 100%;
                height: auto;
                border-radius: 12px;
                display: block;
              "
            />
          </div>
          <div class="feature-content">
            <h3 id="ft2" class="feature-title">
              Volumen &amp; Fibra Tecnológica
            </h3>
            <p class="feature-description">
              Opciones 2D–6D, <strong>YY</strong>, <strong>4Dw</strong> y
              <strong>Comic/Spikes</strong> para estilos texturizados y wispy.
              Elasticidad controlada para abanicos estables y retención
              superior.
            </p>
            <div class="feature-chips">
              <q-chip outline icon="bi-stars">2D–6D</q-chip>
              <q-chip outline icon="bi-sun">YY / 4Dw</q-chip>
              <q-chip outline icon="bi-lightning-charge">Spikes / Wispy</q-chip>
            </div>
          </div>
        </article>

        <article class="feature-card" aria-labelledby="ft3">
          <div class="feature-image">
            <img
              src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_f9c0cyf9c0cyf9c0.png?updatedAt=1761696969777"
              alt="Adhesivos, primer, bonder, removedor, parches de hidrogel"
              width="900"
              height="560"
              loading="lazy"
              style="
                width: 100%;
                height: auto;
                border-radius: 12px;
                display: block;
              "
            />
          </div>
          <div class="feature-content">
            <h3 id="ft3" class="feature-title">Adhesivos &amp; Preparación</h3>
            <p class="feature-description">
              Adhesivos de secado rápido (0.5–1s) para rangos de humedad
              controlados, <strong>primer</strong> y
              <strong>bonder</strong> para sellado, removedor en gel, microbrush
              y <strong>parches de hidrogel</strong> de uso profesional.
            </p>
            <div class="feature-chips">
              <q-chip outline icon="bi-droplet">Humedad 40–70%</q-chip>
              <q-chip outline icon="bi-stopwatch">Secado 0.5–1s</q-chip>
              <q-chip outline icon="bi-shield-check"
                >Retención optimizada</q-chip
              >
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- TRUST / SELLING POINTS -->
    <section class="trust-section" aria-labelledby="trust-title">
      <div class="trust-inner">
        <h2 id="trust-title" class="section-title">
          ¿Por qué comprar con nosotras?
        </h2>
        <div class="trust-grid">
          <div class="trust-item">
            <q-icon name="bi-box-seam" size="28px" />
            <div>
              <h4>Distribuidora oficial</h4>
              <p>
                Garantía de autenticidad y lotes recientes de Galaxia Glamour
                Lashes.
              </p>
            </div>
          </div>
          <div class="trust-item">
            <q-icon name="bi-award" size="28px" />
            <div>
              <h4>Calidad auditada</h4>
              <p>
                Pruebas internas de curvatura, grosor y retención antes de cada
                reposición.
              </p>
            </div>
          </div>
          <div class="trust-item">
            <q-icon name="bi-truck" size="28px" />
            <div>
              <h4>Logística ágil</h4>
              <p>Despachos el mismo día hábil y cobertura nacional.</p>
            </div>
          </div>
          <div class="trust-item">
            <q-icon name="bi-credit-card" size="28px" />
            <div>
              <h4>Pagos flexibles</h4>
              <p>
                PSE, transferencias y contraentrega en ciudades seleccionadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section" aria-labelledby="cta-title">
      <div class="cta-content">
        <h2 id="cta-title" class="cta-title">
          Potencia tu estudio con insumos confiables
        </h2>
        <p class="cta-description">
          Miles de servicios se realizan cada mes con Galaxia Glamour Lashes.
          Pide tu reposición hoy y mantén la consistencia en tus sets.
        </p>
        <div class="cta-buttons cta-center">
          <q-btn
            size="xl"
            rounded
            unelevated
            color="black"
            text-color="white"
            label="Explorar productos"
            @click="$router.push('/catalogo')"
            class="cta-button"
          />
          <q-btn
            size="xl"
            rounded
            outline
            color="black"
            icon="bi-whatsapp"
            label="Hablar ahora"
            :href="whatsHref"
            target="_blank"
            rel="noopener"
            class="q-ml-md"
          />
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section" aria-labelledby="faq-title">
      <h2 id="faq-title" class="section-title">Preguntas frecuentes</h2>
      <q-list bordered class="faq-list">
        <q-expansion-item
          label="¿Trabajan con principiantes y avanzadas?"
          icon="bi-question-circle"
        >
          <div class="faq-a">
            Sí. Recomendamos combos de inicio para clásica y te guiamos al pasar
            a volumen/YY/4Dw.
          </div>
        </q-expansion-item>
        <q-expansion-item
          label="¿Qué adhesivo me conviene según mi humedad?"
          icon="bi-droplet"
        >
          <div class="faq-a">
            Sugerimos rangos 40–70%. Si tu set-up es más húmedo/ seco, ajustamos
            viscosidad y tiempos de secado.
          </div>
        </q-expansion-item>
        <q-expansion-item
          label="¿Hacen envíos a toda Colombia?"
          icon="bi-truck"
        >
          <div class="faq-a">
            Sí, con transportadoras aliadas. Cortes diarios; te compartimos guía
            y seguimiento.
          </div>
        </q-expansion-item>
      </q-list>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";

const featuresSection = ref(null);
const phone = "+573184345284";
const whatsMsg = encodeURIComponent(
  "Hola, vengo desde la web. Quiero asesoría de productos Galaxia Glamour Lashes."
);
const whatsHref = computed(
  () => `https://wa.me/${phone.replace(/\D/g, "")}?text=${whatsMsg}`
);

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<style scoped>
/* Base */
.landing-page {
  --accent: #1a73e8; /* azul profesional */
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
}

.accent {
  color: var(--accent);
}

/* HERO */
.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 16px;
}
.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 56px;
  align-items: center;
}
.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #111;
  line-height: 1.2;
  margin: 0 0 12px;
}
.hero-subtitle {
  font-size: 1.125rem;
  color: #444;
  margin: 0 0 20px;
}
.hero-bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  color: #333;
}
.hero-bullets li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cta-primary {
  transition: transform 0.25s, box-shadow 0.25s;
}
.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.cta-secondary {
  transition: transform 0.2s;
}
.cta-secondary:hover {
  transform: translateY(-1px);
}

.hero-image {
  text-align: center;
}
.main-hero-img {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

/* FEATURES */
.features-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px;
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 10px;
}
.section-subtitle {
  color: #555;
  font-size: 1.05rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.feature-card {
  background: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  padding: 18px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}
.feature-image {
  margin-bottom: 12px;
}
.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 6px 0 8px;
}
.feature-description {
  color: #444;
  line-height: 1.6;
}
.feature-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

/* TRUST */
.trust-section {
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  padding: 72px 16px;
}
.trust-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 18px;
}
.trust-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  padding: 16px;
}
.trust-item h4 {
  margin: 0 0 4px;
  font-weight: 700;
}
.trust-item p {
  margin: 0;
  color: #555;
}

/* CTA */
.cta-section {
  padding: 88px 16px;
  text-align: center;
  background: linear-gradient(135deg, #f8f8f8 0%, #eaeaea 100%);
}
.cta-content {
  max-width: 720px;
  margin: 0 auto;
}
.cta-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 10px;
}
.cta-description {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 28px;
}
.cta-center {
  justify-content: center;
}

/* FAQ */
.faq-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 16px;
}
.faq-list {
  border-radius: 12px;
}
.faq-a {
  padding: 12px 16px;
  color: #444;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .trust-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 520px) {
  .trust-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 2.25rem;
  }
}
</style>
