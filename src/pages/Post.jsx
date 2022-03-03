import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import HomePostCard from "../components/HomePostCard";
import { firestore } from "../firebase/config";

const Post = () => {
  const params = useParams();
  const [post, setPost] = useState(null);

  const postId = params.id;
  useEffect(() => {
    const getPost = async () => {
      const res = await getDoc(doc(firestore, `posts/${postId}`));
      // console.log();
      if (res.data()) setPost({ id: res.id, ...res.data() });
      else setPost(null);
    };
    getPost();
  }, []);
  return (
    <div>
      <Header />
      <div className="mt-14 mx-auto max-w-4xl">
        {post && <HomePostCard post={post} />}
      </div>
    </div>
  );
};

export default Post;
