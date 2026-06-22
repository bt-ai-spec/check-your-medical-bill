import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";

const searchSchema = z.object({
  type: z.enum(["hospital", "independent"]).optional(),
  hospital: z.string().optional(),
  customName: z.string().optional(),
  customCutoffs: z.string().optional(),
});

type LetterSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/letter")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Get your letter — Fair Bill" },
      {
        name: "description",
        content: "Generate a ready-to-send letter for your medical bill.",
      },
    ],
  }),
  component: LetterPage,
});

function LetterPage() {
  const search = Route.useSearch();
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={3} />
        <div className="pt-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Step 04 · Get your letter
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Get your letter
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            Letter generation is coming soon. You will be able to generate a
            ready-to-send itemized-bill request or dispute letter here.
          </p>
        </div>
        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            to="/check"
            search={passthroughSearch(search)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            Back
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function passthroughSearch(s: LetterSearch): LetterSearch {
  const out: LetterSearch = {};
  if (s.type) out.type = s.type;
  if (s.hospital) out.hospital = s.hospital;
  if (s.customName) out.customName = s.customName;
  if (s.customCutoffs) out.customCutoffs = s.customCutoffs;
  return out;
}
