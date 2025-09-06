"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InterviewAssignmentExtended } from "@/lib/types";

interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: InterviewAssignmentExtended;
}

export default function EmailDialog({
  isOpen,
  onClose,
  assignment,
}: EmailDialogProps) {
  const [activeTab, setActiveTab] = useState("rushee");

  // Generate rushee email template
  const generateRusheeEmail = () => {
    if (!assignment.rushee) return "";

    // Convert UTC time to local time for display (same as TimeSlotCell)
    const startTime = assignment.startTime;
    const year = startTime.getUTCFullYear();
    const month = startTime.getUTCMonth();
    const day = startTime.getUTCDate();
    const hour = startTime.getUTCHours();
    const minute = startTime.getUTCMinutes();
    const localDate = new Date(year, month, day, hour, minute);

    const interviewDate = format(localDate, "EEEE, MMMM do, yyyy");
    const interviewTime = format(localDate, "h:mm a") + " PT";

    return `Hello ${assignment.rushee.name},

Thank you for applying to our business professional organization, Alpha Kappa Psi. 

In order to be considered for our Pledging Program, you will need to participate in a mandatory interview (~35 Minutes) for the next phase of the application process. You are confirmed to conduct the following interview—information listed below:

Date: ${interviewDate}
Time: ${interviewTime}
Location: Dr. Martin Luther King Jr. Library | 8th Floor
Attire: Business Casual

Instructions:
Bring your Student ID
Arrive ~5 minutes before your scheduled interview to be directed to the interview room
Reply to this email confirming your attendance to the interview

If you will be late or if you can no longer make it to your interview, please contact me immediately at (408) 768-5543 or at rush@sjsuakpsi.com.

Best,`;
  };

  // Generate brothers email template
  const generateBrothersEmail = () => {
    if (
      !assignment.rushee ||
      !assignment.interviewer1 ||
      !assignment.interviewer2
    )
      return "";

    // Convert UTC time to local time for display (same as TimeSlotCell)
    const startTime = assignment.startTime;
    const year = startTime.getUTCFullYear();
    const month = startTime.getUTCMonth();
    const day = startTime.getUTCDate();
    const hour = startTime.getUTCHours();
    const minute = startTime.getUTCMinutes();
    const localDate = new Date(year, month, day, hour, minute);

    const interviewDate = format(localDate, "EEEE, MMMM do, yyyy");
    const interviewTime = format(localDate, "h:mm a") + " PT";

    return `Hello Brothers,

You are confirmed to interview the following Rushee: 

Name: ${assignment.rushee.name}

Date: ${interviewDate}

Time: ${interviewTime}

Location: MLK Jr. Library Room #804

Here you will find the Google Drive folder containing the Rushees application, resume, bid night slide, interview guide, and potential cover letter.

I have provided you with a link to the Interview Guide and Bid Night Slide Template:

Interview Guide

Bid Night Slide Template

Please create a single copy of each document and place it into the Rushee's application folder.

Mandatory Instructions:

Must be in Pro Wear WITH your pin

Bring Student ID and computer for taking notes and referencing the Rushee's application documents

Arrive ~10 Minutes early to be directed to the correct room. Failure to show up at the required time will result in the loss of a credit.

Avoid interaction with Rushees prior to the interview for professionalism.

KEEP THE INTERVIEW AROUND 30 MINS and MAX 40 MINS

Bounce off your partner with the order of asking questions

Once your interview has concluded, report back to me.

If you have a back-to-back interview, please stay in the same room or move to your designated room.

If you have another interview later, feel free to stay around Dr. Martin Luther King Jr. Library or leave and come back ~10 minutes early

You will be sharing the same Interview Guide with your partner. Please do not influence one another's thought processes and add freely to the Interview Guide with the Rushee's answers.

Complete your Alpha Pi Bid Night slide(s) by Tuesday, February 18 @ 11:59 PM

Link to Rushee Rush Event Attendance Spreadsheet.

If you have any questions or concerns, contact me immediately at (408) 768-5543.

Have fun interviewing!

Kind regards,`;
  };

  // Get email addresses for easy copying
  const getRusheeEmail = () => {
    return assignment.rushee?.email || "";
  };

  const getBrothersEmails = () => {
    const emails = [];
    if (assignment.interviewer1?.email)
      emails.push(assignment.interviewer1.email);
    if (assignment.interviewer2?.email)
      emails.push(assignment.interviewer2.email);
    return emails.join(", ");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyEmailAddresses = (emails: string) => {
    navigator.clipboard.writeText(emails);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Email Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email addresses section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-sm mb-2">Rushee Email:</h4>
              <div className="flex items-center gap-2">
                <Textarea
                  value={getRusheeEmail()}
                  readOnly
                  className="text-sm h-8 resize-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyEmailAddresses(getRusheeEmail())}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Brothers Emails:</h4>
              <div className="flex items-center gap-2">
                <Textarea
                  value={getBrothersEmails()}
                  readOnly
                  className="text-sm h-8 resize-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyEmailAddresses(getBrothersEmails())}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Email templates */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rushee">Rushee Email</TabsTrigger>
              <TabsTrigger value="brothers">Brothers Email</TabsTrigger>
            </TabsList>

            <TabsContent value="rushee" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Email for Rushee</h3>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generateRusheeEmail())}
                >
                  Copy Email
                </Button>
              </div>
              <Textarea
                value={generateRusheeEmail()}
                readOnly
                className="min-h-[400px] resize-none font-mono text-sm"
              />
            </TabsContent>

            <TabsContent value="brothers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Email for Brothers</h3>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generateBrothersEmail())}
                >
                  Copy Email
                </Button>
              </div>
              <Textarea
                value={generateBrothersEmail()}
                readOnly
                className="min-h-[400px] resize-none font-mono text-sm"
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
