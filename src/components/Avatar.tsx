import React from "react";
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
  const playerImage = usePlayerImages(player);

  let finalUrl = profileImg;
  if (playerImage && !playerImage.error && playerImage.url) {
    if (cutoutImg && playerImage.url.strCutout) {
      finalUrl = playerImage.url.strCutout;
    } else if (renderImg && playerImage.url.strRender) {
      finalUrl = playerImage.url.strRender;
    } else if (thumbImg && playerImage.url.strThumb) {
      finalUrl = playerImage.url.strThumb;
    }
  }

  console.log("user image: " + playerImage.url?.strCutout);

  return (
    <img className={className} src={finalUrl} alt="Avatar Profile Image" />
  );
};

export default Avatar;
