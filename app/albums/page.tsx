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

  const userID = session?.user.userID;

  useEffect(() => {
    if (userID) {
      setLoading(true);
      axios
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
    }
  }, [userID]);

  return (
    <div className="flex flex-col gap-4">
      {loading && <Loader />}
      {(albums || []).map(({ name, data, _id }) => (
        <div key={_id} className="border-b border-gray-100">
          <h3 className="text-2xl mb-2">Album: {name}</h3>
          <h3 className="text-lg mb-2">Album ID: {_id}</h3>
          <h5 className="text-base mb-2">Images:</h5>
          <div className="grid grid-cols-3 gap-4 pb-4">
            {data.map((base64, idx) => (
              <AlertDialog>
                <AlertDialogTrigger>
                  <img
                    className="rounded-md object-cover h-[333px]"
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
