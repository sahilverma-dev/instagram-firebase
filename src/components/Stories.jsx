import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FakeUsers } from "../constants/fakeData";

const StoriyCard = ({ image, username }) => {
  return (
    <div>
      <LazyLoadImage
        className="h-14 w-14 rounded-full p-[1.5px] aspect-square border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out"
        src={image}
        alt={username}
      />
      <p className="text-xs w-14 truncate text-center">
        {username?.length > 10 ? `${username.slice(0, 10)}..` : username}
      </p>
    </div>
  );
};

const Stories = () => {
  return (
    <main className=" md:mb-7 max-w-4xl mx-auto">
      <div className="flex space-x-2 p-6 w-full bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
        {FakeUsers.map((item, index) => (
          <StoriyCard
            key={index}
            username={item?.username}
            image={item?.photoURL}
          />
        ))}
      </div>
    </main>
  );
};

export default Stories;
