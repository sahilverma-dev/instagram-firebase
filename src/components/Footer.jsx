import React from "react";

const Footer = () => {
  const date = new Date();
  return (
    <footer className="text-center p-3 font-thin max-w-4xl md:text-sm text-xs mx-auto text-gray-700 w-full">
      <div className="px-3">
        <div className="w-full ">
          <div className="flex items-center flex-wrap justify-between w-full mb-3">
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://about.facebook.com/meta"
              >
                <div className="">Meta</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                href="https://about.instagram.com/"
                target="_blank"
              >
                <div className="">About</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://about.instagram.com/blog/"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <div className="">Blog</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/about/jobs/"
              >
                <div className="">Jobs</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://help.instagram.com/"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <div className="">Help</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://developers.facebook.com/docs/instagram"
              >
                <div className="">API</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/legal/privacy/"
              >
                <div className="">Privacy</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/legal/terms/"
              >
                <div className="">Terms</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/directory/profiles/"
              >
                <div className="">Top Accounts</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/directory/hashtags/"
              >
                <div className="">Hashtags</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/explore/locations/"
              >
                <div className="">Locations</div>
              </a>
            </div>
            <div className="">
              <a
                rel="nofollow"
                target="_blank"
                href="https://www.instagram.com/web/lite/"
              >
                <div className="">Instagram Lite</div>
              </a>
            </div>
          </div>
        </div>
        <div className="text-sm">
          <div className="">
            <div className="">
              <span className="font-semibold">&copy; {date.getFullYear()}</span>{" "}
              Instagram Firebase by{" "}
              <a
                href="https://www.instagram.com/sahilverma.dev/"
                target={"_blank"}
                rel="nofollow noopener noreferrer"
                className="font-semibold"
              >
                Sahil Verma
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
