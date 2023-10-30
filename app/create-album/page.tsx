"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { getBase64 } from "@/utils/imgUtils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cross1Icon, ReloadIcon, UploadIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateAlbum() {
  const [albumName, setAlbumName] = useState("album_name");
  const [loading, setLoading] = useState<boolean>();
  const [loadingUpload, setLoadingUpload] = useState<number>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();

  const router = useRouter();
  const userID = session?.user.userID;

  const onFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingUpload(ev.target.files?.length);
    if (ev.target.files) {
      const files = Array.from(ev.target.files);
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const createAlbum = async () => {
    setLoading(true);
    return axios
      .post("/api/albums", {
        images: imgSrcs,
        name: albumName,
        userID,
      })
      .then(() => {
        setLoading(false);
        toast({
          title: "The album was created.",
        });
        router.push("/albums");
      })
      .catch((err) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Couldn't create the album",
        });
      });
  };

  useEffect(() => {
    getBase64(imageFiles)
      .then((data) => {
        setImgSrcs(data);
        setLoadingUpload(undefined);
      })
      .catch(() => {
        setLoadingUpload(undefined);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
        });
      });
  }, [imageFiles]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full: sm:w-1/2">
          <Label htmlFor="album-name">Album Name</Label>
          <Input
            value={albumName}
            type="text"
            id="album-name"
            onChange={(ev) => setAlbumName(ev.target.value)}
          />
        </div>
        <div className="w-full: sm:w-1/2">
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

      <div className="album-container my-6">
        {imgSrcs.map((base64, idx) => (
          <AlertDialog key={idx}>
            <AlertDialogTrigger>
              <img className="album-item" src={base64} key={idx} alt="" />
            </AlertDialogTrigger>
            <AlertDialogContent className="p-0 overflow-hidden">
              <AlertDialogHeader className="h-full">
                <img className="object-cover" src={base64} key={idx} />{" "}
              </AlertDialogHeader>
              <AlertDialogAction className="rounded-none rounded-bl-md absolute top-0 right-0">
                <Cross1Icon className="w-4 h-4" />
              </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        ))}
        {loadingUpload &&
          Array(loadingUpload)
            .fill("")
            .map((_, idx) => <Skeleton key={idx} className="album-item" />)}
      </div>

      {imgSrcs.length > 0 && (
        <div className="my-6">
          <Button onClick={createAlbum} className="flex items-center gap-2">
            {loading ? (
              <ReloadIcon className="w-4 h-4 animate-spin" />
            ) : (
              <UploadIcon className="w-4 h-4" />
            )}
            Create Album
          </Button>
        </div>
      )}
    </div>
  );
}
