import { PdfUploadForm } from "@/components/pdf-upload/PdfUploadForm";

export default function RusheeManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Rushee Management
          </h1>
          <p className="text-muted-foreground">
            Manage rushee applications and create new records from PDF uploads.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Upload PDF Application
            </h2>
            <PdfUploadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
