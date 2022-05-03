import React, { useContext, useEffect, useRef, useState } from "react";

// framer motin
import { motion } from "framer-motion";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useParams } from "react-router-dom";

// firebase
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore, storage } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";

// components
import ProfilePostCard from "../components/ProfilePostCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

// icons
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { MdAddAPhoto as EditProfileIcon } from "react-icons/md";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import NotFound from "../components/NotFound";
import Loading from "../components/Loading";

const Profile = () => {
  const params = useParams();
  const { username } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postIds, setPostIds] = useState([]);
  const { user } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const profilePic = useRef();
  const [noUser, setNoUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const userQuery = query(
        collection(firestore, "user"),
        where("username", "==", username)
      );
      onSnapshot(userQuery, (users) => {
        // console.log(users);
        if (!users.empty) {
          setPostIds(users?.docs[0]?.data()?.posts);
          setProfileUser({ id: users.docs[0].id, ...users?.docs[0]?.data() });
          setIsLoading(false);
          setNoUser(false);
          // console.log(noUser);
        }
        if (users.empty) {
          setProfileUser(null);
          // console.log(noUser);
          // console.log({ id: users.docs[0].id, ...users?.docs[0]?.data() });
          setIsLoading(false);
          setNoUser(true);
        }
      });
    };
    getData();
  }, [username]);

  useEffect(() => {
    const readIds = async (ids) => {
      const reads = ids.map((id) => getDoc(doc(firestore, "posts", `${id}`)));
      const result = await Promise.all(reads);
      return result?.map((doc) => ({ id: doc?.id, ...doc.data() }));
    };
    if (postIds?.length > 0) {
      const getData = async () => {
        try {
          const response = await readIds(postIds);
          if (response) {
            setPosts(response);
            // console.log(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, [postIds]);

  const followProfile = async () => {
    console.log("follow", profileUser);
    if (!user) navigate("/login");
    if (user) {
      setDoc(
        doc(firestore, `user/${user?.uid}`),
        {
          following: arrayUnion(profileUser?.id),
        },
        { merge: true }
      );
      setDoc(
        doc(firestore, `user/${profileUser?.id}`),
        {
          followedBy: arrayUnion(user?.uid),
        },
        { merge: true }
      );
    }
  };

  const unFollowProfile = async () => {
    console.log("follow", profileUser);
    if (!user) navigate("/login");
    if (user) {
      setDoc(
        doc(firestore, `user/${user?.uid}`),
        {
          following: arrayRemove(profileUser?.id),
        },
        { merge: true }
      );
      setDoc(
        doc(firestore, `user/${profileUser?.id}`),
        {
          followedBy: arrayRemove(user?.uid),
        },
        { merge: true }
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="mt-16 min-h-screen">
        {profileUser && (
          <main className="bg-gray-100 bg-opacity-25">
            <div className="lg:max-w-5xl lg:mx-auto mb-8">
              <header className="flex flex-wrap items-center p-4 md:py-8">
                <div className="md:w-3/12 md:ml-16">
                  {/* profile image */}
                  <div className="relative group w-20 h-20 md:w-40 md:h-40 object-cover overflow-hidden rounded-full">
                    {profileUser?.id === user?.uid && (
                      <div className="absolute cursor-pointer opacity-0 group-hover:opacity-100 duration-75 transition-all top-0 left-0 h-full w-full bg-black/70 flex items-center justify-center text-2xl md:text-4xl text-white aspect-square">
                        <EditProfileIcon
                          htmlFor="profile-image"
                          onClick={() => profilePic.current.click()}
                        />
                        <input
                          type="file"
                          name="profile-image"
                          className="hidden h-full w-full"
                          id="profile-image"
                          ref={profilePic}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            const storageRef = ref(
                              storage,
                              `users/${user?.uid}/profilePic.png`
                            );

                            const uploadTask = uploadBytesResumable(
                              storageRef,
                              file
                            );
                            uploadTask.on(
                              "state_changed",
                              (snap) => {
                                console.log(snap);
                              },
                              (err) => console.log(err),
                              () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(
                                  async (downloadURL) => {
                                    console.log(
                                      "File available at",
                                      downloadURL
                                    );
                                    setDoc(
                                      doc(firestore, `user/${user?.uid}`),
                                      {
                                        photoURL: downloadURL,
                                      },
                                      { merge: true }
                                    );
                                  }
                                );
                              }
                            );
                          }}
                        />
                      </div>
                    )}
                    <LazyLoadImage
                      className="rounded-full h-full w-full border-2 border-pink-600 md:p-1 p-0.5"
                      src={
                        profileUser?.photoURL ||
                        "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
                      }
                      alt={profileUser?.fullName}
                    />
                  </div>
                </div>
                {/* profile meta */}
                <div className="w-8/12 md:w-7/12 ml-4">
                  <div className="md:flex md:flex-wrap md:items-center mb-4">
                    <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                      {profileUser?.username}
                    </h2>
                    {/* badge */}
                    {profileUser?.isVerified && (
                      <span
                        className="inline-flex cursor-pointer text-blue-500 text-2xl mr-2"
                        title="A Verified User"
                      >
                        <VerifiedIcon />
                      </span>
                    )}
                    {/* follow button */}
                    {user?.uid !== profileUser?.id && (
                      <button
                        className={`${
                          profileUser?.followedBy?.includes(user?.uid)
                            ? "bg-gray-400"
                            : "bg-blue-500"
                        } px-4 py-1 
                  text-white font-semibold text-sm rounded block text-center 
                  sm:inline-block`}
                        onClick={
                          profileUser?.followedBy?.includes(user?.uid)
                            ? unFollowProfile
                            : followProfile
                        }
                      >
                        {profileUser?.followedBy?.includes(user?.uid)
                          ? "Followed"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                  {/* post, following, followers list for medium screens */}
                  <ul className="hidden md:flex space-x-8 mb-4">
                    <li>
                      <span className="font-semibold">
                        {profileUser?.posts?.length || 0}{" "}
                      </span>
                      posts
                    </li>
                    <li>
                      <span className="font-semibold">
                        {profileUser?.followedBy?.length || 0}{" "}
                      </span>
                      followers
                    </li>
                    <li>
                      <span className="font-semibold">
                        {profileUser?.following?.length || 0}{" "}
                      </span>
                      following
                    </li>
                  </ul>
                  {/* user meta form medium screens */}
                  <div className="hidden md:block">
                    <h1 className="font-semibold">{profileUser?.fullName}</h1>
                    <p className="font-normal text-sm text-gray-600">
                      {profileUser?.categoryName}
                    </p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `${profileUser?.biography
                          ?.replace("\n", "<br/>")
                          .replace("!\n", "<br/>")}`,
                      }}
                    ></p>
                    {profileUser?.link && (
                      <a
                        href={`https://${profileUser?.link}`}
                        target="_blank"
                        without
                        rel="noreferrer"
                        className="font-semibold text-blue-800"
                      >
                        {profileUser?.link}
                      </a>
                    )}
                  </div>
                </div>
                {/* user meta form small screens */}
                <div className="md:hidden text-sm my-2">
                  <h1 className="font-semibold">{profileUser?.fullName}</h1>
                  <span>{profileUser?.categoryName}</span>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: `${profileUser?.biography
                        ?.replace("\n", "<br/>")
                        ?.replace("!\n", "<br/>")}`,
                    }}
                  ></p>
                </div>
              </header>
              {/* posts */}
              <div className="px-px md:px-3">
                {/* user following for mobile only */}
                <ul
                  className="flex md:hidden justify-around space-x-8 border-t 
                text-center p-2 text-gray-600 leading-snug text-sm"
                >
                  <li>
                    <span className="font-semibold text-gray-800 block">
                      {profileUser?.posts?.length || 0}{" "}
                    </span>
                    posts
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800 block">
                      {profileUser?.followedBy?.length || 0}{" "}
                    </span>
                    followers
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800 block">
                      {profileUser?.following?.length || 0}{" "}
                    </span>
                    following
                  </li>
                </ul>
                {/* flexbox grid */}
                {posts?.length === 0 && (
                  <div className="flex items-center justify-center h-screen">
                    <div className="text-center">No posts yet</div>
                  </div>
                )}
                <motion.div
                  layout
                  className="grid grid-cols-3 md:gap-8 gap-1 md:p-2 p-1"
                >
                  {posts?.reverse().map((post, index) => (
                    <ProfilePostCard key={index} post={post} />
                  ))}
                </motion.div>
              </div>
            </div>
          </main>
        )}
        {isLoading && (
          <>
            <Loading />
          </>
        )}
        {noUser && (
          <div className="py-56 w-full flex items-center justify-center p-3">
            <NotFound />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
