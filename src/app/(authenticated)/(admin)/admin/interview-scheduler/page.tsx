import { getInterviewSchedulerData } from "./actions";
import InterviewScheduler from "@/components/interview-scheduler/InterviewScheduler";

export default async function InterviewSchedulerPage() {
  const data = await getInterviewSchedulerData();

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Interview Scheduler
          </h1>
          <p className="text-muted-foreground">
            Schedule interviews by selecting available time slots and assigning
            interviewers.
          </p>
        </div>

        <InterviewScheduler
          interviewDates={data.interviewDates}
          rushees={data.rushees}
          rusheeAvailabilities={data.rusheeAvailabilities}
          userAvailabilities={data.userAvailabilities}
          interviewAssignments={data.interviewAssignments}
        />
      </div>
    </div>
  );
}
