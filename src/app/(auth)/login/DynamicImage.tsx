// DynamicImage.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// Import images directly

import loginImage from "@/assets/login/login-image.jpg";
import loginImage1 from "@/assets/login/login-image1.jpg";
import loginImage2 from "@/assets/login/login-image2.jpg";
import loginImage3 from "@/assets/login/login-image3.jpg";



// Place the imported images into an array
const images = [loginImage, loginImage1, loginImage2, loginImage3];

const DynamicImage = () => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % images.length; // Loop back to the start
      setCurrentImage(images[index]);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
      <Image
        src={currentImage}
        alt="Dynamic Image"
        className="hidden w-1/2 object-fill md:block"
      />
  );
};

export default DynamicImage;
