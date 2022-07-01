import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

// uuid
import { v4 as uuid } from "uuid";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// icons
import { MdHomeFilled as HomeIcon } from "react-icons/md";
import { RiMessengerLine as ChatIcon } from "react-icons/ri";
import { CgAddR as AddPostIcon } from "react-icons/cg";
import { ImCompass2 as ExploreIcon } from "react-icons/im";
import { FiHeart as HeartIcon } from "react-icons/fi";
import { AiOutlineSearch as SearchIcon } from "react-icons/ai";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { VscClose as CloseIcon } from "react-icons/vsc";
import { ImSpinner3 as SpinnerIcon } from "react-icons/im";
import { BsBookmark as SavedIcon } from "react-icons/bs";
import { FiSettings as SettingIcon } from "react-icons/fi";
import { RiExchangeFundsLine as SwitchIcon } from "react-icons/ri";

// firebase
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../context/AuthContext";
import { auth, firestore, storage } from "../firebase/config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import Swiper, { Pagination } from "swiper";
import { SwiperSlide } from "swiper/react";
import { ReelFillIcon, ReelIcon } from "../constants/icons";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [modelOpen, setModelOpen] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [caption, setCaption] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [images, setImages] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const uploadImage = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `users/${user?.uid}/posts/${uuid()}`);
    const uploadSingleImage = uploadBytesResumable(storageRef, images[0]);
    uploadSingleImage.on(
      "state_changed",
      (snap) => {
        setUploading(true);
        setPercentage((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadSingleImage.snapshot.ref).then(
          async (downloadURL) => {
            console.log("File available at", downloadURL);
            const postDoc = await addDoc(collection(firestore, "posts"), {
              caption,
              createdAt: serverTimestamp(),
              singleMedia: { src: downloadURL },
              user: {
                fullname: user?.displayName,
                username: user?.username,
                photoURL: user?.photoURL,
                uid: user?.uid,
              },
            });
            console.log(postDoc?.id);
            setDoc(
              doc(firestore, `user/${user?.uid}`),
              {
                posts: arrayUnion(postDoc.id),
              },
              {
                merge: true,
              }
            ).then(() => {
              setModelOpen(false);
              setUploading(false);
              setUploadComplete(true);
              setCaption("");
              setImages(null);
              setUploadComplete(false);
              setPercentage(0);
            });
          }
        );
      }
    );
  };
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b-[1px] z-50">
        <div className="p-2 max-w-4xl mx-auto  flex items-center justify-between ">
          <div>
            <Link to="/">
              <img
                src="/images/logo-full.png"
                className="h-10 w-auto object-cover"
                alt=""
              />
            </Link>
          </div>
          <div>
            <div className="hidden sm:block p-2 rounded-lg bg-gray-200 items-center">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex gap-2 text-gray-600">
                  <SearchIcon size={20} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent h-full outline-none"
                  />
                </div>
              </form>
            </div>
          </div>
          {user ? (
            <>
              <div className="flex items-center text-slate-800 text-2xl gap-3">
                <NavLink to="/">
                  <HomeIcon />
                </NavLink>
                <div>
                  <ChatIcon />
                </div>
                <button onClick={() => setModelOpen(true)}>
                  <AddPostIcon />
                </button>
                <NavLink to="/explore">
                  <ExploreIcon size={20} />
                </NavLink>
                <NavLink to="/reels">
                  <ReelFillIcon size={22} />
                </NavLink>
                {user ? (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <img
                      className="h-6 md:border-[1px] border-slate-900 rounded-full aspect-square"
                      // src={
                      //   "https://lh3.googleusercontent.com/a-/AOh14Gh94MS2OYdnk63M-e_5MLwokYLufFvBMzlHp93wtg=s96-c"
                      // }
                      src={user?.photoURL}
                      alt={user?.name}
                    />
                    {menuOpen && (
                      <div className="absolute z-30 -bottom-5 w-[200px] right-0 translate-y-full bg-white shadow rounded text-xs">
                        <ul className="flex flex-col p-3 justify-center gap-2">
                          <li onClick={() => setMenuOpen(!menuOpen)}>
                            <Link
                              to={`/${user?.username}`}
                              className="flex items-center gap-1"
                            >
                              <div>
                                <ProfileIcon />
                              </div>
                              <div>Profile</div>
                            </Link>
                          </li>
                          <li onClick={() => setMenuOpen(!menuOpen)}>
                            <div className="flex items-center gap-1">
                              <div>
                                <SavedIcon />
                              </div>
                              <div>Saved</div>
                            </div>
                          </li>
                          <li onClick={() => setMenuOpen(!menuOpen)}>
                            <div className="flex items-center gap-1">
                              <div>
                                <SettingIcon />
                              </div>
                              <div>Setting</div>
                            </div>
                          </li>
                          <li onClick={() => setMenuOpen(!menuOpen)}>
                            <div className="flex items-center gap-1">
                              <div>
                                <SwitchIcon />
                              </div>
                              <div>Switch</div>
                            </div>
                          </li>
                        </ul>
                        <button
                          onClick={() => {
                            signOut(auth);
                          }}
                          type="button"
                          className="border-t-2 p-2 text-left w-full"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink to="/login">
                    <ProfileIcon />
                  </NavLink>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-3 items-center">
              <Link
                to="/login"
                className="bg-blue-500 text-white font-semibold text-sm py-1 px-3 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-500 font-semibold text-sm rounded"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
      {modelOpen && (
        <div className="fixed top-0 flex items-center justify-center left-0 w-screen h-screen z-50">
          <div
            onClick={() => setModelOpen(false)}
            className="absolute h-full w-full bg-black/80 backdrop-blur -z-10 "
          ></div>
          <button
            onClick={() => setModelOpen(false)}
            className="absolute md:top-7 md:right-10 top-5 right-3 text-white md:text-5xl text-3xl"
          >
            <CloseIcon color="#fff" />
          </button>
          <div className="p-3 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg">
              <div className="border-b-2 py-2 text-center">Create Post</div>
              <div className="max-w-[422px] w-full h-full aspect-square flex items-center justify-center">
                <div className="flex flex-col w-full overflow-hidden items-center justify-between gap-4">
                  {images ? (
                    <>
                      {images.length === 1 ? (
                        <img
                          src={URL.createObjectURL(images[0])}
                          className="max-h-[300px] w-auto object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="relative">
                          <div className="flex gap-3 overflow-x-scroll snap-x ">
                            {Array.from(images)?.map((media, index) => (
                              <div
                                key={index}
                                className="flex-shrink-0 h-full w-full snap-center"
                              >
                                <img
                                  src={URL.createObjectURL(media)}
                                  className="border"
                                  alt=""
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <svg
                      aria-label="Icon to represent media such as images or videos"
                      className="_8-yf5 "
                      color="#262626"
                      fill="#262626"
                      htmlFor="formFile"
                      height={77}
                      role="img"
                      viewBox="0 0 97.6 77.3"
                      width={96}
                    >
                      <path
                        d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                        fill="currentColor"
                      />
                      <path
                        d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                        fill="currentColor"
                      />
                      <path
                        d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <div className="flex justify-center w-full">
                    <div className="mb-3 w-full px-2">
                      {!images && (
                        <label
                          htmlFor="formFile"
                          className="text-2xl text-center block w-full mb-2 text-gray-700"
                        >
                          Drag photos and videos here
                        </label>
                      )}
                      <form onSubmit={uploadImage}>
                        {uploading ? (
                          <div className="rounded my-3 overflow-hidden w-full bg-gray-200">
                            <div
                              className="h-1 bg-blue-500 rounded transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        ) : (
                          <input
                            className="block w-full px-3 mb-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            type="file"
                            accept="image/*"
                            id="formFile"
                            // multiple
                            onChange={(e) => {
                              setImages(e.target.files);
                            }}
                          />
                        )}
                        {images && (
                          <>
                            <input
                              type="text"
                              onChange={(e) => setCaption(e.target.value)}
                              className="p-2 border-2 mb-3 outline-none w-full"
                              placeholder="Add a caption"
                              value={caption}
                            />
                            <div
                              className="w-full flex justify-center"
                              type="submit"
                            >
                              <button
                                className="bg-blue-500 px-4 py-1 
                        text-white font-semibold text-sm rounded block text-center 
                        sm:inline-block mx-auto"
                                disabled={caption.length <= 0}
                              >
                                {uploading ? (
                                  <div className="flex gap-2 items-center">
                                    <div>Uploading</div>
                                    <SpinnerIcon className="w-3 h-3 animate-spin my-1 mx-auto" />
                                  </div>
                                ) : (
                                  <>{uploadComplete ? "Complete" : "Upload"}</>
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
