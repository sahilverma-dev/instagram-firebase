import { useContext, useEffect, useRef, useState } from "react";

// icons
import { IoIosAdd as AddIcon } from "react-icons/io";
import {
  FaPlay as PlayIcon,
  FaPause as PauseIcon,
  FaHeart as LikedIcon,
  FaRegHeart as LikeIcon,
  FaShare as ShareIcon,
  FaCommentDots as CommentIcon,
} from "react-icons/fa";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { IoClose as CloseIcon } from "react-icons/io5";
import { ImMusic as SongIcon } from "react-icons/im";

import { AuthContext } from "../context/AuthContext";
import { nFormatter } from "../utility";
import { RWebShare } from "react-web-share";

const ReelsVideoCard = ({ video }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const videoRef = useRef();

  const callBack = (entries) => {
    const [entry] = entries;
    setIsPlaying(entry.isIntersecting);
    entry.isIntersecting ? videoRef.current.play() : videoRef.current.pause();
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const showButton = () => {
    setButtonOpacity(0.5);
    setInterval(() => {
      setButtonOpacity(0);
    }, 3000);
  };

  const ToggleLike = () => {
    setLiked(!liked);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callBack, options);
    if (videoRef.current) observer.observe(videoRef?.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div
      className="relative h-full snap-start rounded overflow-hidden"
      id={video?.id}
    >
      <video
        ref={videoRef}
        className="h-full w-full cursor-pointer object-cover"
        src={video?.src}
        preload="none"
        playsInline
        muted={false}
        loading="lazy"
        // onDoubleClick={ToggleLike}
        onClick={() => {
          showButton();
          setIsPlaying(!isPlaying);
          isPlaying ? videoRef.current.pause() : videoRef.current.play();
        }}
        onTimeUpdate={() =>
          setTimelineWidth(
            (videoRef.current?.currentTime / videoRef.current?.duration) * 100
          )
        }
        loop
      ></video>
      <div
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white text-8xl outline-none z-10"
        style={{
          opacity: isPlaying ? buttonOpacity : 0.5,
          pointerEvents: "none",
        }}
      >
        <button className="outline-none" title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="absolute flex flex-col items-center gap-7 bottom-36 right-2">
        <div className="relative">
          <img
            src={video?.user?.avatar}
            alt={video?.user?.username}
            loading="lazy"
            className="h-14 aspect-square rounded-full border-2 border-white"
          />
          <button className="absolute -bottom-2 text-white aspect-square rounded-full left-1/2 -translate-x-1/2 bg-pink-500">
            <AddIcon />
          </button>
        </div>
        <div
          className={`${
            liked ? "text-red-500" : "text-white"
          } text-center text-3xl`}
        >
          <button onClick={ToggleLike}>
            {liked ? <LikedIcon className="text-red-500" /> : <LikeIcon />}
            <p className="text-xs mt-2">{nFormatter(video?.data?.likes)}</p>
          </button>
        </div>
        <div className="text-white text-center text-3xl">
          <button onClick={() => setCommentsOpen(true)}>
            <CommentIcon />
            <p className="text-xs mt-2">
              {nFormatter(video?.data?.comments?.length)}
            </p>
          </button>
        </div>
        <div className="text-white text-center text-3xl">
          <RWebShare
            data={{
              text: `${video?.user?.username} shared a video`,
              url: `${window.location.origin}/reels#${video?.id}`,
              title: `${video?.title}`,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <button>
              <ShareIcon />
              <p className="text-xs mt-2">{nFormatter(video?.data?.shares)}</p>
            </button>
          </RWebShare>
        </div>
      </div>
      <div className="absolute bottom-0 p-4 bg-gradient-to-b from-transparent via-black/50 to-black text-white w-full flex items-center justify-between left-0">
        <div>
          @{video?.user?.username}
          {video?.user?.verified && (
            <VerifiedIcon className="text-blue-500 inline-flex" />
          )}
          {
            <p className="text-xs mt-2">
              {video?.caption} <b>#{video?.tags[0]}</b>
            </p>
          }
          <div className="flex items-center gap-3 my-2">
            <div>
              <SongIcon size={13} />
            </div>
            <marquee className="text-xs block h-full w-full min-w-[150px]">
              {video?.song?.name} by {video?.song?.artists}
            </marquee>
          </div>
        </div>
        <div className="shrink-0">
          <img
            src={video?.song?.cover}
            alt={video?.song?.name}
            loading="lazy"
            className="h-12 w-12 rounded-full shrink-0 !object-cover animate-spin-slow duration-300 aspect-square"
          />
        </div>
      </div>
      <div
        className="absolute bg-white bottom-0 left-0 h-1 rounded transition-all"
        style={{
          width: `${timelineWidth}%`,
        }}
      ></div>
      {commentsOpen && (
        <div className="absolute bottom-0 left-0 w-full h-auto p-4 bg-gray-200 z-30 rounded-lg rounded-l-lg">
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg">Comments</div>
            <button
              className="text-2xl aspect-square"
              onClick={() => setCommentsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="h-[400px] text-black z-50 flex flex-col gap-4 shadow-xl p-3 rounded-xl my-2 overflow-scroll">
            {video?.data?.comments?.map((comment) => {
              return (
                <div
                  key={comment?.id}
                  className="flex items-center bg-white rounded-xl gap-2 w-full justify-between p-2"
                >
                  <div className="relative aspect-square">
                    <img
                      src={comment?.user?.avatar}
                      alt={comment?.user?.username}
                      className="block h-12 aspect-square rounded-full"
                    />
                    {comment?.user?.verified && (
                      <VerifiedIcon className="absolute right-0 bg-white rounded-full bottom-0 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <a href="#" className="font-bold text-lg">
                      {comment?.user?.username}
                    </a>
                    <p className="text-sm">{comment?.comment}</p>
                  </div>
                  <div>
                    <button>
                      <LikedIcon />
                      <p>{comment?.likedBy?.length || 0}</p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex gap-2 items-center">
                <img
                  src={
                    "https://avatars.githubusercontent.com/u/83828231?s=40&v=4"
                  }
                  loading="lazy"
                  alt={user?.displayName}
                  className="h-8 aspect-square object-cover rounded-full"
                />
                <input
                  type="text"
                  className="w-full border-2 border-gray-300 rounded-lg text-sm p-2"
                  placeholder="Comment something good..."
                />
                <button className="rounded-lg bg-blue-500 font-bold text-white px-3 py-2 text-sm">
                  Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsVideoCard;
