import { NextResponse } from "next/server";
import { getPhotos } from "@/lib/getPhotos";

export async function GET() {
  const photos = getPhotos();
  return NextResponse.json(photos);
}
