import Link from "next/link";
import type { SiteContent } from "@/lib/store";
import Reveal from "@/components/Reveal";
import styles from "@/components/Hero.module.css";

type VideoEmbed = { kind: "iframe" | "video"; src: string };

function getVideoEmbed(url: string): VideoEmbed | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  if (youtubeMatch) {
    return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  return { kind: "video", src: trimmed };
}

const BADGES = [
  { icon: "🧩", label: "Tool & App", className: styles.badgeTopRight },
  { icon: "💬", label: "Chatbot & Prompt", className: styles.badgeRight },
  { icon: "📦", label: "Sản phẩm số", className: styles.badgeBottomLeft },
  { icon: "✨", label: "Prompt tham khảo", className: styles.badgeBottomRight },
];

export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const embed = getVideoEmbed(hero.videoUrl ?? "");

  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        <Reveal className={styles.videoCol}>
          <div className={styles.videoFrame}>
            {embed ? (
              embed.kind === "iframe" ? (
                <iframe
                  src={embed.src}
                  title="Video giới thiệu AI System Creator"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={embed.src} controls playsInline />
              )
            ) : (
              <div className={styles.videoPlaceholder}>
                <span className={styles.playButton} aria-hidden>
                  <span className={styles.playIcon} />
                </span>
              </div>
            )}
          </div>

          {BADGES.map((badge) => (
            <div key={badge.label} className={`${styles.badge} ${badge.className}`}>
              <span className={styles.badgeIcon} aria-hidden>
                {badge.icon}
              </span>
              <span className={styles.badgeLabel}>{badge.label}</span>
            </div>
          ))}
        </Reveal>

        <div className={styles.content}>
          <Reveal>
            <span className={styles.eyebrow}>{hero.eyebrow}</span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className={styles.title}>
              {hero.headline}
              <span className={styles.titleHighlight}>{hero.headlineHighlight}</span>
              {hero.headlineEnd}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className={styles.subtitle}>{hero.description}</p>
          </Reveal>

          <Reveal delay={200}>
            <div className={styles.ctaRow}>
              <Link href="#products" className={styles.ctaPrimary}>
                {hero.primaryCta}
                <span aria-hidden>→</span>
              </Link>
              <Link href="#features" className={styles.ctaSecondary}>
                {hero.secondaryCta}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
