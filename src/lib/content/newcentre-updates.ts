import { getNewCentreUpdates as getNewCentreUpdatesFromDb } from '../db';

export type OIAC_NewCentreUpdateImage = {
  url: string;
};

export type OIAC_NewCentreUpdate = {
  id: string;
  title: string;
  description?: string;
  date: string;
  mediaType: 'images' | 'video';
  images?: Array<OIAC_NewCentreUpdateImage>;
  videoUrl?: string;
  displayOrder?: number;
};

export async function getNewCentreUpdates(): Promise<OIAC_NewCentreUpdate[]> {
  try {
    const updates = await getNewCentreUpdatesFromDb();

    return updates.map(update => ({
      id: update.id,
      title: update.title,
      description: update.description,
      date: update.date,
      mediaType: update.mediaType,
      images: update.images,
      videoUrl: update.videoUrl,
      displayOrder: update.displayOrder,
    }));
  } catch (error) {
    console.error('Error fetching new centre updates:', error);
    return [];
  }
}
