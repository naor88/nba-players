class ImageCache {
  private cache: Map<string, string>;
  private size: number;

  constructor() {
    this.cache = new Map();
    this.size = 0;
  }

  public async loadImage(url: string): Promise<string | null> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as string;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load image from ${url}`);
      }
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      this.cache.set(url, objectURL);
      this.size += blob.size; // Add the size of the new image
      return objectURL;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public getImage(url: string): string | undefined {
    return this.cache.get(url);
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public getCacheSizeInBytes(): number {
    return this.size;
  }
}

export const imageCache = new ImageCache();
