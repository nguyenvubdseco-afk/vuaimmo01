import { heroStats } from "@/data/content";
import type { SiteContent } from "@/lib/store";
import Reveal from "@/components/Reveal";
import styles from "@/components/Hero.module.css";

const LEFT_LINES = Array.from({ length: 12 }, (_, i) => i);
const RIGHT_LINES = Array.from({ length: 12 }, (_, i) => i);
const TOP_LINES = Array.from({ length: 8 }, (_, i) => i);

const TICKER_ITEMS = [
  "Tool & App",
  "Chatbot & Prompt",
  "Sản phẩm số",
  "Prompt tham khảo",
  "Tự động hoá AI",
];

export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className={styles.hero}>
      <div className={styles.linesLeft} aria-hidden>
        {LEFT_LINES.map((i) => {
          const width = 60 + i * 10;
          return (
            <div
              key={i}
              className={`${styles.line} ${styles.lineLeft}`}
              style={{
                width,
                height: 420,
                left: -(width - 48),
                top: "50%",
                transform: "translateY(-50%)",
                animationDelay: `${i * 0.25}s`,
              }}
            />
          );
        })}
      </div>

      <div className={styles.linesRight} aria-hidden>
        {RIGHT_LINES.map((i) => {
          const width = 60 + i * 10;
          return (
            <div
              key={i}
              className={`${styles.line} ${styles.lineRight}`}
              style={{
                width,
                height: 420,
                right: -(width - 48),
                top: "50%",
                transform: "translateY(-50%)",
                animationDelay: `${i * 0.25}s`,
              }}
            />
          );
        })}
      </div>

      <div className={styles.linesTop} aria-hidden>
        {TOP_LINES.map((i) => {
          const height = 40 + i * 8;
          return (
            <div
              key={i}
              className={`${styles.line} ${styles.lineTop}`}
              style={{
                height,
                width: 340,
                top: -(height - 32),
                left: "50%",
                transform: "translateX(-50%)",
                animationDelay: `${i * 0.25}s`,
              }}
            />
          );
        })}
      </div>

      <div className={styles.content}>
        <Reveal>
          <span className={styles.eyebrow}>{hero.eyebrow}</span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className={styles.title}>
            {hero.headline}
            <span className={styles.titleHighlight}>{hero.headlineHighlight}</span>
            {hero.headlineEnd}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className={styles.subtitle}>{hero.description}</p>
        </Reveal>

        <Reveal delay={260}>
          <div className={styles.tickerWrap}>
            <div className={styles.tickerTrack}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className={styles.tickerItem}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className={styles.ctaRow}>
            <a href="#products" className={styles.ctaPrimary}>
              {hero.primaryCta}
            </a>
            <a href="#features" className={styles.ctaBook}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon.png" alt="" className={styles.ctaBookAvatar} />
              <span className={styles.ctaBookText}>
                <span className={styles.ctaBookMain}>{hero.secondaryCta}</span>
                <span className={styles.ctaBookSub}>
                  <span className={styles.ctaBookDot} aria-hidden />
                  Miễn phí, không ràng buộc
                </span>
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <dl className={styles.statsRow}>
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className={styles.bottomFade} aria-hidden />
    </section>
  );
}
