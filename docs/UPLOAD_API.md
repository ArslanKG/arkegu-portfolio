# Image Upload API Documentation

## Overview
The Image Upload API provides secure file upload functionality for blog post images using Vercel Blob storage. This endpoint is restricted to authenticated admin users only.

## Endpoint

### POST `/api/upload`

Uploads image files to Vercel Blob storage.

#### Authentication
- **Required**: Admin authentication via NextAuth session
- **Status Code**: `401 Unauthorized` if not authenticated

#### Request
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with a `file` field containing the image

#### File Validation
- **Allowed MIME Types**: 
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
  - `image/gif`
  - `image/webp`
- **Maximum File Size**: 5MB (5,242,880 bytes)
- **Filename**: Automatically sanitized and made unique

#### Response

**Success (200):**
```json
{
  "url": "https://blob-store-url/timestamp-random-filename.ext"
}
```

**Error Responses:**
```json
// 401 - Not authenticated
{
  "error": "Unauthorized",
  "message": "Authentication required"
}

// 400 - No file provided
{
  "error": "Bad Request",
  "message": "No file provided"
}

// 400 - Invalid file type
{
  "error": "Bad Request",
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
}

// 413 - File too large
{
  "error": "Request Entity Too Large",
  "message": "File size exceeds 5MB limit"
}

// 500 - Upload failed
{
  "error": "Internal Server Error",
  "message": "File upload failed"
}
```

### GET `/api/upload`

Returns information about the upload endpoint.

#### Response
```json
{
  "message": "Image upload endpoint",
  "allowedTypes": ["image/jpeg", "image/png", "image/gif", "image/webp"],
  "maxSize": "5MB"
}
```

## Setup

### Environment Variables
Add the following to your `.env` file:

```env
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
```

**Getting a Vercel Blob Token:**
1. Visit [Vercel Dashboard - Stores](https://vercel.com/dashboard/stores)
2. Create or select a Blob store
3. Copy the read-write token

### Dependencies
The following packages are required (already included in package.json):
- `@vercel/blob` - Vercel Blob storage client
- `next-auth` - Authentication

## Usage Examples

### JavaScript/Fetch API
```javascript
// Assume you have a file input element
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);

try {
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // Note: Don't set Content-Type header, let browser set it for FormData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = await response.json();
  console.log('Upload successful:', result.url);
  
} catch (error) {
  console.error('Upload error:', error);
}
```

### React Hook Example
```tsx
import { useState } from 'react';

function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      setImageUrl(result.url);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

## Security Features

1. **Authentication Required**: Only authenticated admin users can upload files
2. **File Type Validation**: Only image files are allowed
3. **File Size Limits**: Maximum 5MB per file
4. **Filename Sanitization**: Special characters are removed/replaced
5. **Unique Filenames**: Prevents conflicts and overwrites
6. **MIME Type Validation**: Validates both file extension and MIME type
7. **Environment Protection**: Blob token is server-side only

## Testing

Run the test suite:
```bash
npm run upload:test
```

The test script validates:
- Endpoint accessibility
- Authentication enforcement
- File type validation logic
- File size validation logic

## File Naming Convention

Uploaded files follow this naming pattern:
```
{timestamp}-{random-6-chars}-{sanitized-original-name}.{ext}
```

Example: `1699123456789-a1b2c3-my-image-file.jpg`

This ensures:
- Chronological ordering
- Uniqueness
- Original name preservation (sanitized)
- Conflict prevention

## Error Handling

The API provides detailed error messages for debugging:
- File validation errors include specific requirements
- Authentication errors are clearly identified
- Server errors are logged for monitoring
- HTTP status codes follow REST conventions

## Integration with Blog Posts

The returned URL from this API can be used directly in blog post `coverImage` fields or within markdown content for inline images.

```json
// Blog post creation example
{
  "title": "My Blog Post",
  "content": "![Image description](https://blob-url-from-upload-api)",
  "coverImage": "https://blob-url-from-upload-api"
}