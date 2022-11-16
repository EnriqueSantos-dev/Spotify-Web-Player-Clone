import React from "react";
import clsx from "clsx";
import { HeartIcon } from "@heroicons/react/24/outline";
import useSpotifyAxios from "../hooks/useSpotifyAxios";

interface Props {
  trackIds: string[];
}

const LikeButton: React.FC<Props> = ({ trackIds }) => {
  const axiosApi = useSpotifyAxios();
  const [isLiked, setLiked] = React.useState(false);

  async function handleToggleLike() {
    try {
      if (!isLiked) {
        const res = await axiosApi.put("/me/tracks", null, {
          params: { ids: trackIds.join(",") },
        });
        if (res.status === 200) {
          setLiked(true);
        }
      } else {
        const res = await axiosApi.delete("/me/tracks", {
          params: { ids: trackIds.join(",") },
        });

        if (res.status === 200) {
          setLiked(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button className="hidden md:inline ml-3" onClick={handleToggleLike}>
      <HeartIcon
        className={clsx("h-5 w-5 transition-colors stroke-2 ", {
          "stroke-[#b3b3b3]": !isLiked,
          "stroke-transparent": isLiked,
        })}
        fill={isLiked ? "green" : "transparent"}
      />
    </button>
  );
};

export default LikeButton;
