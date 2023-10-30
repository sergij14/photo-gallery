"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Loader } from "@/components/ui/loader";
import { useParams } from "next/navigation";

interface Album {
  images: string[];
  name: string;
  _id: string;
}

export default function AlbumPage() {
  const [album, setAlbum] = useState<Album[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>();

  const { albumID } = useParams();

  const userID = session?.user.userID;

  const getAlbums = async () => {
    setLoading(true);
    return axios
      .get(`/api/albums?albumID=${albumID}`)
      .then(({ data }) => {
        setLoading(false);
        setAlbum(data);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Couldn't get album",
        });
      });
  };

  useEffect(() => {
    if (userID) {
      getAlbums();
    }
  }, [userID]);

  return (
    <div className="flex flex-col gap-4">
      {loading && <Loader />}
      {(album || {}).map(({ name, images, _id }) => (
        <div key={_id} className="border-b border-gray-100">
          <div className=" flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
            <div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <h3 className="text-sm italic text-gray-600">#: {_id}</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {images.map((base64, idx) => (
              <AlertDialog key={idx}>
                <AlertDialogTrigger>
                  <img
                    className="rounded-md object-cover h-[270px] md:h-[350px] lg:h-[250px] w-full"
                    src={base64}
                    key={idx}
                  />
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
          </div>
        </div>
      ))}
    </div>
  );
}
