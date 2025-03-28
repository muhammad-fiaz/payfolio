import React from "react";
import Image from "next/image";
import Background from "@/assets/background.png";

const BackgroundImage: React.FC = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full -z-10">
            <Image
                src={Background}
                alt="Background"
                priority={true}
                className="bg-cover bg-center w-full h-full object-cover"
                loading="eager"
            />
        </div>
    );
};

export default BackgroundImage;
