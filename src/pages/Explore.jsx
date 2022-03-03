import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import Header from "../components/Header";
import ProfilePostCard from "../components/ProfilePostCard";
import { AiOutlineSearch as SearchIcon } from "react-icons/ai";
import Loading from "../components/Loading";

const Explore = () => {
  const [posts, setposts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getDocs(collection(firestore, "posts"));
      const posts = res?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //   console.log(posts);
      setposts(posts);
      setLoading(false);
    };
    getData();
  }, []);
  return (
    <div>
      <Header />
      <div className="lg:max-w-4xl mt-14 lg:mx-auto mb-8">
        <div className="block sm:hidden p-2">
          <div className="p-2 items-center w-full border-[1px] rounded">
            <form action="">
              <div className="flex gap-2 text-xs text-gray-600">
                <SearchIcon size={15} />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent h-full outline-none"
                />
              </div>
            </form>
          </div>
        </div>
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <Loading />
          </div>
        )}

        {posts?.length === 0 && !loading && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">No posts yet</div>
          </div>
        )}
        <motion.div
          layout
          className="grid grid-cols-3 md:gap-8 gap-0.5 md:p-2 p-0.5"
        >
          {posts.map((post, index) => (
            <ProfilePostCard
              key={post?.id}
              //   span={(index + 1) % 2 === 0 && (index + 1) % 3 !== 0}
              span={[2, 10, 20, 28, 38].includes(index + 1)}
              post={post}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;
