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
import { Cross1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

interface Album {
  data: string[];
  name: string;
  _id: string;
}

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const [loadingDelete, setLoadingDelete] = useState<boolean>();

  const userID = session?.user.userID;

  const getAlbums = async () => {
    setLoading(true);
    return axios
      .get(`/api/albums?userID=${userID}`)
      .then(({ data }) => {
        setLoading(false);
        setAlbums(data);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Couldn't get albums",
        });
      });
  };

  const deleteAlbum = async (_id: string) => {
    setLoadingDelete(true);
    return axios
      .delete(`/api/albums?albumID=${_id}`)
      .then(({ data }) => {
        setLoadingDelete(false);
        getAlbums();
      })
      .catch((err) => {
        setLoadingDelete(false);
        toast({
          variant: "destructive",
          title: "Couldn't delete album",
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
      {(albums || []).map(({ name, data, _id }) => (
        <div key={_id} className="border-b border-gray-100">
          <div className=" flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
            <div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <h3 className="text-sm italic text-gray-600">#: {_id}</h3>
            </div>
            <Button
              onClick={() => deleteAlbum(_id)}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {loadingDelete ? (
                <ReloadIcon className="w-4 h-4 animate-spin" />
              ) : (
                <Cross1Icon className="w-4 h-4" />
              )}
              Delete Album
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {data.map((base64, idx) => (
              <AlertDialog>
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
      {albums.length === 0 && <p>No albums...</p>}
    </div>
  );
}
