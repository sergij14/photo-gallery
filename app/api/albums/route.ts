import { mongoDBService } from "@/utils/mongoDBService";

export async function POST(req: Request) {
  const { data, name } = await req.json();

  try {
    const album = await mongoDBService.insertDocument("albums", { data, name });
    return new Response(JSON.stringify(album), { status: 201 });
  } catch (error) {
    return new Response("Failed to create an album", { status: 500 });
  }
}
