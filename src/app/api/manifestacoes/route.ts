import { NextRequest, NextResponse } from "next/server";
import { toCGUPayload } from "@/src/lib/cgu/utils";
import { postManifestacao } from "@/src/lib/cgu/client";
import type { ManifestacaoRequestDTO } from "@/src/lib/cgu/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const dto = (await req.json()) as ManifestacaoRequestDTO;

    // Token opcional via env ou header de forward
    const token = process.env.CGU_API_TOKEN || req.headers.get("x-cgu-token") || undefined;
    const payload = toCGUPayload(dto);
    const data = await postManifestacao(payload, { token });
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    const status = /combina[cç][aã]o.*inv[aá]lida/i.test(msg) || /30MB|anexos|manifestante|texto/i.test(msg) ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
