import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTimeUTC, formatDateForDisplay } from "@/utils/helpers";

interface Interview {
  id: string;
  rusheeId: string;
  interviewDateId: string;
  startTime: Date;
  endTime: Date;
  interviewer1Id: string;
  interviewer2Id: string;
  createdAt: Date;
  updatedAt: Date;
  rushee: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    major: string | null;
  } | null;
  interviewer1: {
    id: string;
    name: string;
    email: string;
  } | null;
  interviewer2: {
    id: string;
    name: string;
    email: string;
  } | null;
  interviewDate: {
    id: string;
    date: Date;
  } | null;
}

interface InterviewsProps {
  interviews: Interview[];
}

export default function Interviews({ interviews }: InterviewsProps) {
  return (
    <div className="h-[50vh]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <CardTitle>My Interviews</CardTitle>
          <CardDescription>Your scheduled interviews</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {interviews.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              You have no scheduled interviews
            </div>
          ) : (
            <div className="space-y-2">
              {interviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  const {
    rushee,
    interviewer1,
    interviewer2,
    startTime,
    endTime,
    interviewDate,
  } = interview;

  // Determine the partner (the other interviewer)
  const partner =
    interviewer1 && interviewer2
      ? interviewer1.id !== interview.interviewer1Id
        ? interviewer1
        : interviewer2
      : interviewer1 || interviewer2;

  return (
    <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
      <CardContent className="p-2">
        <div className="space-y-1">
          {/* Date and Time */}
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">
              {interviewDate
                ? formatDateForDisplay(interviewDate.date)
                : "No date"}
            </CardTitle>
            <CardDescription className="text-xs">
              {formatTimeUTC(startTime)} - {formatTimeUTC(endTime)}
            </CardDescription>
          </div>

          {/* Interviewee */}
          <div className="text-xs">
            <span className="font-medium text-muted-foreground">
              Interviewee:{" "}
            </span>
            <span className="font-medium">{rushee?.name || "Unknown"}</span>
            {rushee?.major && (
              <span className="text-muted-foreground ml-1">
                ({rushee.major})
              </span>
            )}
          </div>

          {/* Interview Partner */}
          {partner && (
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">
                Partner:{" "}
              </span>
              <span className="font-medium">{partner.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
