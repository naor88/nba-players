import React, { useEffect, useState } from "react";
import profileImg from "../assets/profile-user-icon.jpg";
import { IPlayer } from "../types";
import usePlayerImages from "../hooks/usePlayerImages";

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

  useEffect(() => {
    usePlayerImages([player]).then((playerImages) => {
      const playerImage =
        playerImages && playerImages.length ? playerImages[0] : undefined;
      if (playerImage && !playerImage.loading && !playerImage.error) {
        const urls = playerImage.url;
        if (urls) {
          if (cutoutImg && urls.strCutout) {
            setImageURL(urls.strCutout);
          } else if (renderImg && urls.strRender) {
            setImageURL(urls.strRender);
          } else if (thumbImg && urls.strThumb) {
            setImageURL(urls.strThumb);
          } else {
            setHasError(true);
          }
        } else {
          setHasError(true);
        }
      } else {
        setHasError(true);
      }
    });
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
