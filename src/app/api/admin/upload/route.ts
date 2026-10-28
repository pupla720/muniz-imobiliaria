import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "node:crypto";

const ALLOWED_CATEGORIES = ["corretores", "depoimentos", "imoveis"] as const;
type Category = (typeof ALLOWED_CATEGORIES)[number];

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const category = formData.get("category");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  if (typeof category !== "string" || !ALLOWED_CATEGORIES.includes(category as Category)) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Formato não suportado. Envie JPG, PNG ou WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Arquivo maior que 5MB." }, { status: 400 });
  }

  const filename = `${category}/${crypto.randomUUID()}.${extension}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Erro no upload para Vercel Blob:", error);
    return NextResponse.json(
      { error: "Falha ao enviar arquivo. Verifique se o BLOB_READ_WRITE_TOKEN está configurado." },
      { status: 500 },
    );
  }
}