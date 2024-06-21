import React, { useEffect, useState } from "react";
import { IPlayer } from "../types";
import { getPlayerAvatar } from "../utils";
import profileImg from "../assets/profile-user-icon.jpg";
interface AvatarProps {
  className?: string;
  player: IPlayer;
  cutoutImg?: boolean;
  renderImg?: boolean;
  thumbImg?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  className,
  player,
  cutoutImg,
  renderImg,
  thumbImg,
}) => {
  const [hasError, setHasError] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const handleError = () => {
    setHasError(true);
  };
  const fetchImageURL = async () => {
    try {
      const urls = await getPlayerAvatar(player);
      if (cutoutImg && urls?.strCutout) setImageURL(urls.strCutout);
      else if (renderImg && urls?.strRender) setImageURL(urls?.strRender);
      else if (thumbImg && urls?.strThumb) setImageURL(urls?.strThumb);
      else setHasError(true);
    } catch (error) {
      console.error("Failed to fetch player avatar:", error);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchImageURL();
  }, []);

  useEffect(() => {
    fetchImageURL();
  }, [player]);

  return (
    <img
      className={className}
      src={hasError || !imageURL ? profileImg : imageURL}
      alt="Avatar Profile Image"
      onError={handleError}
    />
  );
};

export default Avatar;
