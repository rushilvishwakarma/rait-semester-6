import { Banner } from 'fumadocs-ui/components/banner';

export function AnnouncementBanner() {
  return (
    <Banner
      variant="rainbow"
      rainbowColors={[
        '#ec8e8e6e',
        '#ff4f6f33',
        '#7d112e3f',
        '#2b00147f',
      ]}
    >
      End Semester Exams begin 27 April 2026. <a href="/docs/core/academic-calendars/ese-timetable" className="underline font-semibold ml-1">View Timetable</a>
    </Banner>
  );
}
