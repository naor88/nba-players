class ImageCache {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  public async loadImage(url: string): Promise<string> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as string;
    }

    const response = await fetch(url);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    this.cache.set(url, objectURL);
    return objectURL;
  }

  public getImage(url: string): string | undefined {
    return this.cache.get(url);
  }
}

export const imageCache = new ImageCache();
