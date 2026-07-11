import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PromptLibrary from "@/components/PromptLibrary";
import { promptLibraryIntro } from "@/data/prompts";
import { getPrompts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Prompt tham khảo — AI System Creator",
  description: promptLibraryIntro.description,
};

export default async function PromptLibraryPage() {
  const prompts = await getPrompts();

  return (
    <>
      <PageHero
        eyebrow={promptLibraryIntro.eyebrow}
        title={promptLibraryIntro.title}
        description={promptLibraryIntro.description}
      />
      <PromptLibrary prompts={prompts} />
    </>
  );
}
