import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getPayloadConfig } from "@/lib/env";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const collection = searchParams.get("collection");
  const locale = searchParams.get("locale") || "uk";

  if (secret !== getPayloadConfig().secret) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!slug || !collection) {
    return new Response("Missing required params", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  // Construct the redirect URL
  // Assuming standard structure: /[locale]/[collection]/[slug]
  // But for 'pages' collection it might be /[locale]/[slug]
  // We'll stick to the collection structure for now as per the prompt context

  let redirectUrl = `/${locale}/${collection}/${slug}`;

  // Handle specific collection routing if needed
  if (collection === "pages") {
    redirectUrl = `/${locale}/${slug}`;
  }

  redirect(redirectUrl);
}
