import { getEvents, getAvailability, getInterviewDates } from "./actions";
import Events from "@/components/dashboard/Events";
import AvailabilityComponent from "@/components/dashboard/Availability";

export default async function Dashboard() {
  const events = await getEvents();
  const availabilities = await getAvailability();
  const interviewDates = await getInterviewDates();

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <Events events={events} />
      </div>
      <div className="w-1/2">
        <AvailabilityComponent
          availabilities={availabilities}
          interviewDates={interviewDates}
        />
      </div>
    </div>
  );
}
