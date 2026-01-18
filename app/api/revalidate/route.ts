import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const { path, paths, tag, tags } = await request.json();

    if (path) {
      revalidatePath(path);
      logger.info(`Revalidated path: ${path}`);
    }

    if (paths && Array.isArray(paths)) {
      paths.forEach((p) => {
        revalidatePath(p);
        logger.info(`Revalidated path: ${p}`);
      });
    }

    if (tag) {
      revalidateTag(tag, "default");
      logger.info(`Revalidated tag: ${tag}`);
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach((t) => {
        revalidateTag(t, "default");
        logger.info(`Revalidated tag: ${t}`);
      });
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
