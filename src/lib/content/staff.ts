import { getStaffFromDB, getStaffByType } from '../db';

export interface Staff {
  id: string;
  name: string;
  title?: string | null;
  displayOrder?: number | null;
  profilePicture?: {
    url: string;
  } | null;
  staffType: {
    name: string;
  };
  description?: {
    html: string;
  } | null;
}

export async function getStaffMembers(staffType?: string): Promise<Staff[]> {
  const records = staffType ? await getStaffByType(staffType) : await getStaffFromDB();

  return records.map(record => ({
    id: record.id,
    name: record.name,
    title: record.title || null,
    displayOrder: record.displayOrder || null,
    profilePicture: record.profilePictureUrl ? { url: record.profilePictureUrl } : null,
    staffType: {
      name: record.staffType,
    },
    description: record.description ? { html: record.description } : null,
  }));
}
