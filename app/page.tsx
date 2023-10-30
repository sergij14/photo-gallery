"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="h-full">
      <div className="relative">
        <div className="flex flex-col sm:text-left sm:flex-row gap-2 items-center absolute z-50 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push("/create-album")}
          >
            <PlusIcon className="w-4 h-4" />
            Create Album
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push("/albums")}
          >
            <ImageIcon className="w-4 h-4" />
            Browse Albums
          </Button>
        </div>
        <img className="opacity-25" src="./background.jpg" alt="" />
      </div>
    </main>
  );
}
