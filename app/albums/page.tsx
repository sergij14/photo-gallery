"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Album {
  data: string[];
  name: string;
  _id: string;
}

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get("/api/albums")
      .then(({ data }) => {
        setAlbums(data);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Couldn't create the album.",
        });
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {(albums || []).map(({ name, data, _id }) => (
        <div key={_id} className="border-b border-gray-100">
          <h3 className="text-2xl mb-2">Album: {name}</h3>
          <h3 className="text-lg mb-2">Album ID: {_id}</h3>
          <h5 className="text-base mb-2">Images:</h5>
          <div className="grid grid-cols-3 gap-4 pb-4">
            {data.map((base64, idx) => (
              <img
                className="rounded-md object-cover h-[333px]"
                src={base64}
                key={idx}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
