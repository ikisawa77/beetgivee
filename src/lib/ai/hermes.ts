import { z } from "zod";

const aiPickSchema = z.object({
  league: z.string().min(1),
  country: z.string().min(1),
  kickoffAt: z.string().datetime(),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  selection: z.string().min(1),
  odds: z.number().positive(),
  confidence: z.number().int().min(0).max(100),
  analysis: z.string().min(1),
});

const aiResponseSchema = z.object({ picks: z.array(aiPickSchema).min(1) });

export type AiPick = z.infer<typeof aiPickSchema>;
export type AiDraft = AiPick & { status: "DRAFT" };

export function toPublishableDraft(input: Pick<AiPick, "homeTeam" | "awayTeam" | "confidence"> & Partial<AiPick>): AiDraft {
  return {
    league: input.league ?? "ไม่ระบุลีก",
    country: input.country ?? "ไม่ระบุประเทศ",
    kickoffAt: input.kickoffAt ?? new Date(0).toISOString(),
    homeTeam: input.homeTeam,
    awayTeam: input.awayTeam,
    selection: input.selection ?? input.homeTeam,
    odds: input.odds ?? 1,
    confidence: input.confidence,
    analysis: input.analysis ?? "รอตรวจสอบโดยผู้ดูแล",
    status: "DRAFT",
  };
}

export async function analyzeOddsImage(input: {
  imageUrl: string;
  apiKey?: string;
  apiBaseUrl?: string;
  fetcher?: typeof fetch;
}): Promise<AiDraft[]> {
  const apiKey = input.apiKey ?? process.env.HERMES_API_KEY;
  const apiBaseUrl = input.apiBaseUrl ?? process.env.HERMES_API_BASE_URL;
  if (!apiKey || !apiBaseUrl) throw new Error("HERMES_NOT_CONFIGURED");

  const response = await (input.fetcher ?? fetch)(`${apiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "hermes",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "อ่านข้อความและตัวเลขจากภาพฟุตบอล ส่ง JSON เท่านั้นในรูปแบบ {picks:[{league,country,kickoffAt,homeTeam,awayTeam,selection,odds,confidence,analysis}]}. ใช้เวลา ISO 8601, odds เป็นเลข, confidence 0-100, analysis ภาษาไทย." },
        { role: "user", content: [{ type: "text", text: "วิเคราะห์ภาพอัตราต่อรองนี้เป็นร่างสำหรับบรรณาธิการ" }, { type: "image_url", image_url: { url: input.imageUrl } }] },
      ],
    }),
  });
  if (!response.ok) throw new Error("HERMES_UNAVAILABLE");
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("HERMES_INVALID_RESPONSE");
  const parsed = aiResponseSchema.parse(JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")));
  return parsed.picks.map(toPublishableDraft);
}
