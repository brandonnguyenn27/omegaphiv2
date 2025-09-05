# PDF Parsing Server Action Integration

This document describes the Next.js server action that integrates with a Python PDF parsing service to create rushee records in the database.

## Overview

The server action `parsePdfApplication` accepts PDF file uploads, sends them to a Python FastAPI service for parsing, and creates rushee and availability records in the database.

## Server Action

**Function**: `parsePdfApplication(prevState, formData)`

### Parameters

- **prevState**: Previous state (can be null for initial call)
- **formData**: FormData object containing a `file` field with a PDF file
- **File Requirements**:
  - Must be a PDF file (`application/pdf`)
  - Maximum size: 10MB

### Response

#### Success Response

```json
{
  "success": true,
  "message": "Rushee and availabilities created successfully",
  "data": {
    "rushee": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "123-456-7890",
      "major": "Computer Science",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "availabilities": [
      {
        "id": "uuid",
        "rusheeId": "uuid",
        "date": "2024-10-15T00:00:00.000Z",
        "startTime": "2024-10-15T09:00:00.000Z",
        "endTime": "2024-10-15T12:00:00.000Z",
        "interviewDateId": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Error Responses

**Validation Error**

```json
{
  "success": false,
  "message": "File validation failed",
  "error": "Only PDF files are allowed"
}
```

**Duplicate Email Error**

```json
{
  "success": false,
  "message": "Rushee with this email already exists",
  "error": "Duplicate email"
}
```

**Server Error**

```json
{
  "success": false,
  "message": "Failed to parse PDF",
  "error": "Python service error: 500 - Internal server error"
}
```

## Python Service Integration

### Expected Python Service

The API expects a Python FastAPI service running on `http://localhost:8000` with the following endpoint:

**POST** `/parse-application/`

#### Request

- **Content-Type**: `multipart/form-data`
- **Body**: Form data with a `file` field containing a PDF file

#### Response

```json
{
  "rushee": {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "123-456-7890",
    "major": "Computer Science"
  },
  "availabilities": [
    {
      "date": "2024-10-15",
      "startTime": "2024-10-15T09:00:00.000000Z",
      "endTime": "2024-10-15T12:00:00.000000Z"
    }
  ]
}
```

### Environment Variables

Set the following environment variable in your `.env` file:

```env
PYTHON_API_URL=http://localhost:8000
```

## Database Schema

The API creates records in the following tables:

### `rushee` table

- `id`: Primary key (UUID)
- `name`: Rushee's full name
- `email`: Email address (unique)
- `phoneNumber`: Phone number (optional)
- `major`: Academic major (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### `rusheeAvailabilities` table

- `id`: Primary key (UUID)
- `rusheeId`: Foreign key to rushee table
- `date`: Availability date
- `startTime`: Start time of availability
- `endTime`: End time of availability
- `interviewDateId`: Foreign key to interview dates (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Error Handling

The API includes comprehensive error handling for:

1. **File Validation**: PDF type and size validation
2. **Python Service Errors**: Network timeouts, service errors, invalid responses
3. **Database Errors**: Duplicate emails, constraint violations
4. **Data Validation**: Zod schema validation for all data
5. **Network Timeouts**: 30-second timeout for Python service calls

## Usage Examples

### Frontend Integration (React)

```typescript
import { parsePdfApplication } from "@/app/(authenticated)/(user)/dashboard/actions";
import { useTransition } from "react";

function PdfUploadComponent() {
  const [isPending, startTransition] = useTransition();

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await parsePdfApplication(null, formData);

      if (result.success) {
        console.log("Created rushee:", result.data.rushee);
        console.log("Created availabilities:", result.data.availabilities);
      } else {
        console.error("Error:", result.message);
      }
    });
  };

  return (
    // Your form component here
  );
}
```

### Direct Server Action Call

```typescript
import { parsePdfApplication } from "@/app/(authenticated)/(user)/dashboard/actions";

// In a server component or API route
const formData = new FormData();
formData.append("file", pdfFile);

const result = await parsePdfApplication(null, formData);
```

## Security Considerations

1. **File Validation**: Only PDF files are accepted
2. **File Size Limits**: Maximum 10MB file size
3. **Input Validation**: All data is validated using Zod schemas
4. **SQL Injection Protection**: Using Drizzle ORM with parameterized queries
5. **Duplicate Prevention**: Email uniqueness constraint prevents duplicates

## Performance Considerations

1. **Timeout Handling**: 30-second timeout for Python service calls
2. **Database Transactions**: Atomic operations for data consistency
3. **Error Recovery**: Graceful error handling with detailed error messages
4. **Memory Management**: Proper cleanup of file uploads

## Testing

1. Ensure your Python service is running on `http://localhost:8000`
2. Create a test PDF file with application data
3. Use the provided `PdfUploadForm` component or call the server action directly
4. Verify the data is correctly created in the database

## Troubleshooting

### Common Issues

1. **Python Service Not Running**: Ensure the Python service is running on the correct port
2. **File Upload Errors**: Check file type and size requirements
3. **Database Connection**: Verify database connection and schema
4. **Environment Variables**: Ensure `PYTHON_API_URL` is set correctly
5. **Authentication**: Ensure user is authenticated when calling the server action

### Debug Mode

Enable debug logging by checking the console output for detailed error messages and validation results.
