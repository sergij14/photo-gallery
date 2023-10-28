"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { getBase64 } from "@/utils/imgUtils";
import { Button } from "@/components/ui/button";

export default function CreateAlbum() {
  const [albumName, setAlbumName] = useState("Album Name");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);
  const { toast } = useToast();

  const onFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      const files = Array.from(ev.target.files);
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const resetForm = () => {
    setImgSrcs([]);
    setImageFiles([]);
  };

  const createAlbum = async () => {
    return axios
      .post("/api/albums", {
        data: imgSrcs,
        name: albumName,
      })
      .then(() => {
        toast({
          title: "The album was created.",
        });
        resetForm();
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Couldn't create the album.",
        });
      });
  };

  useEffect(() => {
    getBase64(imageFiles)
      .then((data) => setImgSrcs(data))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        })
      );
  }, [imageFiles]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="max-w-[400px]">
          <Label htmlFor="album-name">Album Name</Label>
          <Input
            value={albumName}
            type="text"
            id="album-name"
            onChange={(ev) => setAlbumName(ev.target.value)}
          />
        </div>
        <div className="max-w-[400px]">
          <Label htmlFor="images">Image Files</Label>
          <Input
            accept=".jpg, .png, .svg"
            id="images"
            type="file"
            multiple
            onChange={onFileUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 my-6">
        {imgSrcs.map((base64, idx) => (
          <img
            className="rounded-md object-cover h-[333px]"
            src={base64}
            key={idx}
          />
        ))}
      </div>

      {imgSrcs.length > 0 && (
        <div className="my-6">
          <Button onClick={createAlbum}>Create Album</Button>
        </div>
      )}
    </div>
  );
}
