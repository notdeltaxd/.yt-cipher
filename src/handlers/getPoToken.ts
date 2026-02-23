import { potManager } from "../pot.ts";
import type { RequestContext, PoTokenRequest, PoTokenResponse } from "../types.ts";

export async function handleGetPoToken(ctx: RequestContext): Promise<Response> {
    const { content_binding } = ctx.body as PoTokenRequest;

    try {
        const potData = await potManager.generatePoToken(content_binding);

        const response: PoTokenResponse = {
            poToken: potData.poToken,
            visitorData: potData.contentBinding,
            expiresAt: potData.expiresAt.toISOString(),
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Error generating PoToken:", e);
        return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
