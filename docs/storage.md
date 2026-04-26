# Convex File Storage and Attachments

Zermind uses Convex file storage for chat attachments. Supabase Storage is no longer used.

## Current flow

Attachments are uploaded through Convex generated upload URLs:

```txt
client
  → api.files.generateUploadUrl
  → POST file bytes to Convex upload URL
  → api.files.saveUploadedFile
  → api.agentActions.send with attachment storage IDs
  → zermindAgent.streamText with AI SDK file/image parts
```

This gives Zermind durable file storage while keeping the AI conversation source of truth in Convex Agent.

## Backend files

```txt
convex/files.ts
convex/schema.ts
convex/agentActions.ts
```

`convex/files.ts` exposes:

```txt
api.files.generateUploadUrl
api.files.saveUploadedFile
api.files.getUrl
api.files.remove
```

## Schema

Stored file references live in the `fileAttachments` table:

```ts
fileAttachments: {
  userId: string;
  chatId?: Id<"chats">;
  storageId: Id<"_storage">;
  name: string;
  mimeType: string;
  size: number;
  type: "image" | "document";
  createdAt: number;
}
```

Message/node content is still modeled as:

```txt
Convex Agent messages = AI conversation content
zermindNodes = mind-map metadata
fileAttachments = Convex storage references for uploaded files
```

## Client integration

The attachment UI uses:

```txt
src/hooks/use-file-attachments.ts
src/components/chat-conversation.tsx
src/components/message-attachment.tsx
```

`useFileAttachments` validates files based on selected model capabilities, then uploads each file using a generated Convex upload URL.

The hook returns attachments shaped like:

```ts
{
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  storageId: string;
  type: "image" | "document";
}
```

## AI message integration

Uploaded files are passed to:

```txt
api.agentActions.send
```

`convex/agentActions.ts` converts attachments into AI SDK v6 message parts:

```txt
image attachments → { type: "image", image: signedUrl, mediaType }
document attachments → { type: "file", data: signedUrl, mediaType, filename }
```

Then it calls:

```ts
zermindAgent.streamText(..., { saveStreamDeltas: true })
```

## Serving files

Convex signed file URLs are generated with:

```ts
ctx.storage.getUrl(storageId);
```

The app generates URLs when files are saved and when files need to be read from storage. If a file is deleted or unavailable, `getUrl` returns `null`.

## Deleting files

Files are deleted in three places:

```txt
api.files.remove                 deletes an individual uploaded file
api.chats.remove                 deletes files attached to the deleted chat
api.account.deleteMyData         deletes all user file attachments
```

Deletion removes both:

```txt
Convex storage object
fileAttachments table row
```

## Limits

Convex generated upload URLs support large file uploads, but the upload POST request has a 2 minute timeout. Upload URLs expire after 1 hour and should be generated shortly before upload.

## Removed legacy setup

These are no longer used:

```txt
Supabase Storage buckets
Supabase Storage RLS policies
chat-attachments Supabase bucket
public/signed Supabase object URLs
data-URL-only attachment flow
```
