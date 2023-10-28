"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { getBase64 } from "@/utils/imgUtils";

export default function ImageUpload() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);
  const { toast } = useToast();

  const onFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      setImageFiles(Array.from(ev.target.files));
    }
  };

  useEffect(() => {
    getBase64(imageFiles)
      .then((data) => setImgSrcs(data))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request:",
        })
      );
  }, [imageFiles]);

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="images">Picture</Label>
        <Input
          accept=".jpg, .png, .svg"
          id="images"
          type="file"
          multiple
          onChange={onFileUpload}
        />
      </div>

      {imgSrcs.map((base64, idx) => (
        <img src={base64} key={idx} />
      ))}
    </div>
  );
}
