import React, { useEffect, useState } from "react";
import { imageCache } from "../services/ImageCache";

interface AvatarProps {
  className?: string;
  imageUrl: {
    strCutout: string | null;
    strRender: string | null;
    strThumb: string | null;
  };
  alt: string;
  preferredImageType?: 'cutout' | 'render' | 'thumb';
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  alt,
  className,
  preferredImageType = 'cutout',
}) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const urls = [
        preferredImageType === 'cutout' && imageUrl.strCutout,
        preferredImageType === 'render' && imageUrl.strRender,
        preferredImageType === 'thumb' && imageUrl.strThumb,
        imageUrl.strCutout,
        imageUrl.strRender,
        imageUrl.strThumb,
      ].filter(Boolean);

      for (const url of urls) {
        const imgSrc = await imageCache.loadImage(url as string).catch(() => null);
        if (imgSrc) {
          setSrc(imgSrc);
          break;
        }
      }
    };

    loadImage().catch((err) => console.error("Error loading image:", err));
  }, [imageUrl, preferredImageType]);

  if (!src) {
    return <p>No image available</p>;
  }

  return <img className={className} src={src} alt={alt} />;
};
