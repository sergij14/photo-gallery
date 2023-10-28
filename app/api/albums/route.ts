import { mongoDBService } from "@/utils/mongoDBService";

export async function POST(req: Request) {
  const { data, name } = await req.json();

  try {
    const mongoDbClient = await mongoDBService.connect();
    const album = await mongoDbClient.insertDocument("albums", { data, name });
    return new Response(JSON.stringify(album), { status: 201 });
  } catch (error) {
    return new Response("Failed to create an album", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const mongoDbClient = await mongoDBService.connect();

    const albums = await mongoDbClient.findDocuments("albums");
    return new Response(JSON.stringify(albums), { status: 200 });
  } catch (error) {
    return new Response("Failed to get albums", { status: 500 });
  }
}
