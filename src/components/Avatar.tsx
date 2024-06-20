import React, { useEffect, useState } from "react";
import { IPlayer } from "../types";
import { getPlayerAvatar } from "../utils";
import profileImg from "../assets/profile-user-icon.jpg";
interface AvatarProps {
  player: IPlayer;
}

const Avatar: React.FC<AvatarProps> = ({ player }) => {
  const [hasError, setHasError] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const handleError = () => {
    setHasError(true);
  };

  useEffect(() => {
    const fetchImageURL = async () => {
      try {
        const urls = await getPlayerAvatar(player);
        setImageURL(urls.strCutout);
      } catch (error) {
        console.error("Failed to fetch player avatar:", error);
        // setImageURL("/profile-user-icon.jpg");
        setHasError(true);
      }
    };

    fetchImageURL();
  }, [player]);

  if (hasError) {
    return <img src={profileImg} />;
  }

  return (
    <img
      src={hasError || !imageURL ? "/profile-user-icon.jpg" : imageURL}
      alt="Avatar Profile Image"
      onError={handleError}
    />
  );
};

export default Avatar;
