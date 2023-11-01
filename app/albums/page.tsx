"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Cross1Icon,
  DotsHorizontalIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Album {
  images: string[];
  name: string;
  _id: string;
}

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [totalPages, setTotalPages] = useState<number>();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const [loadingDelete, setLoadingDelete] = useState<boolean>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = +(searchParams.get("page") || 1);

  const userID = session?.user.userID;

  const getAlbums = async () => {
    setLoading(true);
    return axios
      .get(`/api/albums?userID=${userID}&page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        setAlbums(data.albums);
        setTotalPages(data.numOfPages);
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

  const navigateToPage = (idx: number) => {
    setAlbums([]);
    router.push(`/albums?page=${idx + 1}`);
  };

  useEffect(() => {
    if (userID) {
      getAlbums();
    }
  }, [userID, page]);

  return (
    <div className="flex flex-col gap-4">
      {loading && <Loader />}
      {(albums || []).map(({ name, images, _id }) => {
        const isMoreThan3 = images.length > 3;
        const imagesFiltered = isMoreThan3 ? images.slice(0, 3) : images;

        return (
          <div key={_id} className="border-b border-gray-100">
            <div className=" flex mb-4 justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold">
                  <Link href={`albums/${_id}`}>{name}</Link>
                </h3>
                <h3 className="text-sm italic text-gray-600">#: {_id}</h3>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="flex items-center gap-2"
                  >
                    {loadingDelete ? (
                      <ReloadIcon className="w-3 h-3 animate-spin" />
                    ) : (
                      <Cross1Icon className="w-3 h-3" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the album from database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAlbum(_id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="album-container pb-4">
              {imagesFiltered.map((base64, idx) => (
                <AlertDialog key={idx}>
                  <AlertDialogTrigger>
                    <img className="album-item" src={base64} key={idx} />
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
              {isMoreThan3 && (
                <Skeleton
                  onClick={() => router.push(`albums/${_id}`)}
                  className="album-item flex flex-col gap-4 items-center justify-center cursor-pointer"
                >
                  <DotsHorizontalIcon />
                  <Button>All Images</Button>
                </Skeleton>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-center gap-3 m-4">
        {totalPages &&
          totalPages > 0 &&
          Array(totalPages)
            .fill("")
            .map((_, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => navigateToPage(idx)}
                disabled={idx + 1 === page}
              >
                {idx + 1}
              </Button>
            ))}
      </div>
    </div>
  );
}
