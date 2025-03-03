import axios from "axios";
import { PixabayImage } from "../types";

const API_KEY = "49152543-998e6051303f1810663ff8b83";
const API_URL = "https://pixabay.com/api/";

export const searchImages = async (query: string): Promise<PixabayImage[]> => {
  try {
    console.log('Searching for images with query:', query);
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        per_page: 20,
        safesearch: true,
      },
    });
    
    console.log('Pixabay API response:', response.data);
    
    if (!response.data.hits || !Array.isArray(response.data.hits)) {
      console.error('Invalid response format from Pixabay API');
      return [];
    }

    const images = response.data.hits.map((hit: any) => ({
      id: hit.id,
      webformatURL: hit.webformatURL,
      previewURL: hit.previewURL,
      tags: hit.tags,
      user: hit.user,
      pageURL: hit.pageURL,
    }));

    const selectedImages = [];
    const usedIndices = new Set<number>();
    
    while (selectedImages.length < 3) {
      const randomIndex = Math.floor(Math.random() * images.length);
      if (!usedIndices.has(randomIndex)) {
        selectedImages.push(images[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    console.log('Selected random images:', selectedImages);
    return selectedImages;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};
