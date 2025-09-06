import {
  getEvents,
  getAvailability,
  getInterviewDates,
  getUserInterviews,
} from "./actions";
import Events from "@/components/dashboard/Events";
import AvailabilityComponent from "@/components/dashboard/Availability";
import Interviews from "@/components/dashboard/Interviews";
import ImportantLinks from "@/components/dashboard/ImportantLinks";

export default async function Dashboard() {
  const events = await getEvents();
  const availabilities = await getAvailability();
  const interviewDates = await getInterviewDates();
  const interviews = await getUserInterviews();

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/2">
          <Interviews interviews={interviews} />
        </div>
        <div className="w-1/2">
          <AvailabilityComponent
            availabilities={availabilities}
            interviewDates={interviewDates}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Events events={events} />
        </div>
        <div className="w-1/2">
          <ImportantLinks />
        </div>
      </div>
    </div>
  );
}
