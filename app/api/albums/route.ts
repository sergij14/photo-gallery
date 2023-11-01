import { mongoDBService } from "@/utils/mongoDBService";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { images, name, userID } = await req.json();

  try {
    const mongoDbClient = await mongoDBService.connect();

    const res = await mongoDbClient.insertDocument("albums", {
      images,
      name,
      userID,
    });
    return new Response(JSON.stringify(res), { status: 201 });
  } catch (error) {
    return new Response("Failed to create an album", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    const albumID = searchParams.get("albumID");
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 4;
    let query = {};

    if (userID) {
      query = { userID };
    }

    if (albumID) {
      query = { _id: new ObjectId(albumID) };
    }

    const skip = (+page - 1) * +limit;

    const mongoDbClient = await mongoDBService.connect();

    const res =
      (await mongoDbClient.findDocuments("albums", query, skip, +limit)) || [];
    const totalDocs = (await mongoDbClient.countDocuments("albums")) || 0;

    const numOfPages = Math.ceil(totalDocs / 4);

    return new Response(JSON.stringify({ albums: res, numOfPages }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to get albums", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const albumID = searchParams.get("albumID");

    const mongoDbClient = await mongoDBService.connect();

    const res = await mongoDbClient.deleteDocument("albums", {
      _id: new ObjectId(albumID!),
    });
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response("Failed to get albums", { status: 500 });
  }
}
