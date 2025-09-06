import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface Link {
  title: string;
  url: string;
  description?: string;
}

interface ImportantLinksProps {
  links?: Link[];
}

const defaultLinks: Link[] = [
  {
    title: "Applications Google Drive",
    url: "https://drive.google.com/drive/folders/1z3-3vcCsK6vam79t_H-Jg-gXH0Qs56hm?usp=sharing",
    description: "Google Drive folder for applications",
  },
  {
    title: "Interview Guide",
    url: "https://docs.google.com/document/d/1WM6zHiWsh6CHsum2-zZ3J10rdAQun5IVH_orOOesFa8/edit?usp=sharing",
    description: "F25 Rush Interview Guide",
  },
  {
    title: "Bid Night Slide Template",
    url: "https://docs.google.com/presentation/d/1EaPdDQVXzzEkvwG4qmurKYQPTGEE47U3876gbi6ov5k/edit?usp=sharing",
    description: "Google Slides template for Bid Night",
  },
];

export default function ImportantLinks({
  links = defaultLinks,
}: ImportantLinksProps) {
  return (
    <div className="h-[50vh]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <CardTitle>Important Links</CardTitle>
          <CardDescription>Quick access to essential resources</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {links.map((link, index) => (
              <LinkCard key={index} link={link} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LinkCard({ link }: { link: Link }) {
  const isExternal =
    link.url.startsWith("http") || link.url.startsWith("mailto:");

  return (
    <div className="bg-muted/30 hover:bg-muted/50 transition-colors rounded-md p-2">
      <a
        href={link.url}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate">{link.title}</h3>
            {link.description && (
              <p className="text-xs text-muted-foreground truncate">
                {link.description}
              </p>
            )}
          </div>
          {isExternal && (
            <ExternalLink className="h-3 w-3 text-muted-foreground ml-2 flex-shrink-0" />
          )}
        </div>
      </a>
    </div>
  );
}
