// DynamicImage.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// Import images directly
import signupImage from "@/assets/signup/signup-image.jpg";
import signupImage1 from "@/assets/signup/signup-image1.jpg";
import signupImage2 from "@/assets/signup/signup-image2.jpg";
import signupImage3 from "@/assets/signup/signup-image3.jpg";


// Place the imported images into an array
const images = [signupImage, signupImage1, signupImage2, signupImage3];

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
