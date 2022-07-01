import Header from "../components/Header";
import ReelsVideoCard from "../components/ReelsPlayerCard";
import { reelsData } from "../constants/reelsData";
import { motion } from "framer-motion";
const Reels = () => {
  return (
    <motion.div>
      <Header />
      <div className="lg:max-w-4xl min-h-screen mt-14 md:p-3 lg:mx-auto mb-8">
        <div className="h-full w-full bg-transparent flex items-center justify-center">
          <div className="max-w-[400px] h-full md:h-auto w-full overflow-y-scroll snap-y aspect-[9/16] shadow-lg md:rounded">
            {reelsData?.map((video) => (
              <ReelsVideoCard key={video?.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reels;
