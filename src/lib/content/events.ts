export type OIAC_EventSchedule = {
  date: string;
  time: string;
};

export type OIAC_Event = {
  id: string;
  title: string;
  description: {
    html: string;
    markdown: string;
  };
  schedules: Array<OIAC_EventSchedule>;
  month: Array<number>;
  day: number;
};

export async function getEventsForMonths(months: Array<number>): Promise<OIAC_Event[]> {
  // Since we don't have events in the collection yet, return empty array
  // This maintains compatibility with existing code
  // TODO: Add events collection schema when events are added
  return [];
}
