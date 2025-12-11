import { getCollection } from 'astro:content';

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
  let staff = await getCollection('staff');

  // Filter by staff type if specified
  if (staffType) {
    staff = staff.filter(member => member.data.staffType === staffType);
  }

  // Sort by displayOrder, then by name
  const sortedStaff = staff.sort((a, b) => {
    const orderA = a.data.displayOrder ?? 999;
    const orderB = b.data.displayOrder ?? 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.data.name.localeCompare(b.data.name);
  });

  return sortedStaff.map(member => ({
    id: member.id,
    name: member.data.name,
    title: member.data.title,
    displayOrder: member.data.displayOrder,
    profilePicture: member.data.profilePicture,
    staffType: {
      name: member.data.staffType,
    },
    description: member.data.description ? { html: member.data.description } : null,
  }));
}
