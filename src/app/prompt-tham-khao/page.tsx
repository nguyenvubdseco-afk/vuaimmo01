import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PromptLibrary from "@/components/PromptLibrary";
import { promptLibraryIntro } from "@/data/prompts";

export const metadata: Metadata = {
  title: "Prompt tham khảo — AI System Creator",
  description: promptLibraryIntro.description,
};

export default function PromptLibraryPage() {
  return (
    <>
      <PageHero
        eyebrow={promptLibraryIntro.eyebrow}
        title={promptLibraryIntro.title}
        description={promptLibraryIntro.description}
      />
      <PromptLibrary />
    </>
  );
}
