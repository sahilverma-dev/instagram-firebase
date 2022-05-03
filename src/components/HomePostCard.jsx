import React, { useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";

// import { motion } from "framer-motion";

// icons
import { CgHeart as HeartIcon } from "react-icons/cg";
import { FaHeart as HeartFillIcon } from "react-icons/fa";
import { RiChat3Line as CommentIcon } from "react-icons/ri";
import { FiSend as SendIcon } from "react-icons/fi";
import { BsBookmark as TagIcon } from "react-icons/bs";
import { BsBookmarkFill as TagFillIcon } from "react-icons/bs";
import { IoEllipsisHorizontalSharp as PostMenuIcon } from "react-icons/io5";
import { AiOutlineSmile as SmileIcon } from "react-icons/ai";
import { GoChevronRight as NextIcon } from "react-icons/go";
import { MdVerified as VerifiedIcon } from "react-icons/md";

import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";

const HomePostCard = ({ post }) => {
  const [commentInput, setCommentInput] = useState("");
  const [commentsArr, setCommentsArr] = useState([]);
  const [limitNum, setLimitNum] = useState(2);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useContext(AuthContext);
  const swiper = useSwiper();

  const likePost = async () => {
    const postRef = doc(firestore, `posts/${post?.id}`);
    updateDoc(
      postRef,
      {
        likedBy: arrayUnion(user?.uid),
      },
      { merge: true }
    );
    setLiked(true);
  };

  const unlikePost = async () => {
    const postRef = doc(firestore, `posts/${post?.id}`);
    updateDoc(
      postRef,
      {
        likedBy: arrayRemove(user?.uid),
      },
      {
        merge: true,
      }
    );
    setLiked(false);
  };

  const savePost = async () => {
    console.log(user.uid, post.id);
    const userRef = doc(firestore, `user/${user.uid}`);
    const postRef = doc(firestore, `posts/${post.id}`);
    updateDoc(
      postRef,
      {
        savedBy: arrayUnion(user.uid),
      },
      { merge: true }
    );
    updateDoc(
      userRef,
      {
        savedPost: arrayUnion(post?.id),
      },
      { merge: true }
    );
    setSaved(true);
  };

  const unsavePost = async () => {
    const userRef = doc(firestore, `user/${user.uid}`);
    const postRef = doc(firestore, `posts/${post.id}`);
    updateDoc(
      postRef,
      {
        savedBy: arrayRemove(user.uid),
      },
      { merge: true }
    );
    updateDoc(
      userRef,
      {
        savedPost: arrayRemove(post?.id),
      },
      { merge: true }
    );
    setSaved(false);
  };

  const commentSubmit = (e) => {
    e.preventDefault();
    // console.log(post?.id, post);
    const commentsCollectionRef = collection(
      firestore,
      `posts/${post?.id}/commentsCollection`
    );
    const commentData = {
      userId: user?.uid,
      comment: commentInput.trim(),
      commentedAt: serverTimestamp(),
      username: user?.username,
      isVerified: user?.isVerified,
      fullName: user?.displayName,
      photoURL: user?.photoURL,
      likes: 0,
    };
    addDoc(commentsCollectionRef, commentData);
    setCommentInput("");
  };

  useEffect(() => {
    // console.log(user);
    const getComments = async () => {
      const q = query(
        collection(firestore, `posts/${post?.id}/commentsCollection`),
        limit(limitNum)
      );

      onSnapshot(
        q,
        (docs) => {
          const comments = docs.docs.map((doc) => ({
            ...doc.data(),
            id: doc?.id,
          }));
          // console.log(comments);
          setLiked(post?.likedBy?.includes(user?.uid));
          setSaved(post?.savedBy?.includes(user?.uid));
          setCommentsArr(comments);
        },
        (err) => {
          console.log(err);
        }
      );
    };
    getComments();
  }, [limitNum]);

  return (
    <div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="sm:mb-6 bg-white sm:border-[1px] rounded"
    >
      <div className="flex gap-3 items-center p-2 justify-between">
        <Link to={`/${post?.user?.username}`}>
          <img
            src={
              post?.user?.photoURL ||
              "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
            }
            className="rounded-full h-8 w-8 object-cover"
            alt={post?.user?.fullName}
          />
        </Link>
        <div className="flex-grow">
          <Link to={`/${post?.user?.username}`} className="font-semibold">
            {post?.user?.username}
          </Link>
        </div>
        <button>
          <PostMenuIcon />
        </button>
      </div>
      <Link to={`/p/${post?.id}`}>
        {!post?.carouselMedia && (
          <div className="relative aspect-square">
            <LazyLoadImage
              // effect="blur"
              src={post?.singleMedia?.src || post?.carouselMedia[0]?.src}
              placeholderSrc="https://cutewallpaper.org/24/image-placeholder-png/index-of-img.png"
              alt={post?.id}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {post?.carouselMedia && (
          <div className="relative">
            <Swiper
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={(e) => console.log(e)}
              modules={[Pagination]}
            >
              {post?.carouselMedia.map((media, index) => (
                <SwiperSlide key={index}>
                  <LazyLoadImage
                    src={media?.src}
                    placeholderSrc="https://cutewallpaper.org/24/image-placeholder-png/index-of-img.png"
                    alt={post?.id}
                    className="h-full w-full object-cover"
                  />
                </SwiperSlide>
              ))}
              <button
                onClick={() => swiper.slidePrev()}
                className="absolute top-[50%] translate-y-[-50%] right-3 p-1 aspect-square rounded-full bg-gray-200 text-slate-800 backdrop-opacity-50 z-50"
              >
                <NextIcon />
              </button>
              <button
                onClick={() => swiper.slideNext()}
                className="absolute top-[50%] translate-y-[-50%] rotate-180 left-3 p-1 aspect-square rounded-full bg-gray-200 text-slate-800 backdrop-opacity-40 z-50"
              >
                <NextIcon />
              </button>
            </Swiper>
          </div>
        )}
      </Link>
      <div className="p-3">
        <div className="flex text-2xl md:py-3 w-full">
          <div className="flex w-full text-slate-900 gap-2">
            {liked ? (
              <button onClick={unlikePost}>
                <HeartFillIcon color="#ff2828" />
              </button>
            ) : (
              <button onClick={likePost}>
                <HeartIcon size={25} />
              </button>
            )}
            <button>
              <CommentIcon />
            </button>
            <button>
              <SendIcon />
            </button>
          </div>
          <button onClick={saved ? unsavePost : savePost}>
            {saved ? <TagFillIcon /> : <TagIcon />}
          </button>
        </div>
        <div className="text-sm font-semibold">
          {post?.likedBy?.length > 0 && (
            <>{post?.likedBy?.length?.toLocaleString()} likes</>
          )}
          <div className="my-2">
            {post?.caption && (
              <div className="text-sm text-gray-700">
                <Link to={`/${post.user.username}`} className="font-bold">
                  {post?.user?.username}
                </Link>{" "}
                {post?.caption}
              </div>
            )}
          </div>
          {commentsArr?.length > 0 && (
            <div
              onClick={() => setLimitNum(limitNum + 5)}
              className="block text-xs my-3 text-slate-600 cursor-pointer"
            >
              View more comments
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3" id="#comments">
          {commentsArr?.map((comment) => (
            // console.log(comment),
            <div key={comment?.id} className="flex justify-between gap-2">
              <div>
                <Link to={`/${comment?.username}`}>
                  <img
                    src={
                      comment?.photoURL ||
                      "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
                    }
                    className="h-8 w-8 rounded-full aspect-square object-fill"
                    alt={comment?.fullName}
                  />
                </Link>
              </div>
              <div className="flex flex-grow gap-1">
                <b className="inline-flex">
                  <Link to={`/${comment?.username}`}>{comment?.username}</Link>
                  {comment?.isVerified && (
                    <span className="aspect-square rounded-full text-blue-500">
                      <VerifiedIcon />
                    </span>
                  )}
                </b>
                <span className="font-normal">
                  {comment?.comment?.length > 20
                    ? `${comment?.comment?.slice(0, 20)}...`
                    : comment?.comment}
                </span>
              </div>
              {/* <div>{comment?.commentedAt?.toDate().toLocaleTimeString()}</div> */}
            </div>
          ))}
        </div>
      </div>
      <div className=" sm:block sm:border-t-[1px] text-slate-900 p-3 border-slate-500/30">
        <form onSubmit={commentSubmit}>
          <div className="flex items-center gap-3">
            <SmileIcon size={24} />
            <input
              type="text"
              className="w-full text-sm outline-none font-light"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={commentInput.length <= 0}
              className="text-blue-500 font-semibold text-sm"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePostCard;
