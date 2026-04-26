# Supabase Storage Setup for Zermind Chat Attachments

## Overview

Zermind uses private Supabase storage buckets for secure chat attachment handling. This ensures user privacy and proper access control for uploaded files.

## Bucket Configuration

### 1. Create the Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** → **Buckets**
2. Click **New Bucket**
3. Set the following configuration:

```
Bucket Name: chat-attachments
Public: false (IMPORTANT - must be private)
File size limit: 50MB
Allowed MIME types:
  - image/jpeg
  - image/png
  - image/gif
  - image/webp
  - application/pdf
```

### 2. Set Up Row Level Security (RLS) Policies

Navigate to **Storage** → **Policies** and create these policies for the `chat-attachments` bucket:

#### Policy 1: Upload Policy

```sql
-- Users can upload files to the uploads folder structure
CREATE POLICY "Allow authenticated uploads to chat-attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[1] = 'uploads'
);
```

#### Policy 2: Select Policy

```sql
-- Users can view files they uploaded
CREATE POLICY "Allow users to view their own chat attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (SELECT auth.uid()) = owner_id::uuid
);
```

#### Policy 3: Update Policy

```sql
-- Users can update their own files (for upsert functionality)
CREATE POLICY "Allow users to update their own chat attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (SELECT auth.uid()) = owner_id::uuid
)
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND (SELECT auth.uid()) = owner_id::uuid
);
```

#### Policy 4: Delete Policy

```sql
-- Users can delete their own uploaded files
CREATE POLICY "Allow users to delete their own chat attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (SELECT auth.uid()) = owner_id::uuid
);
```

### 3. Advanced Policies (Optional - for shared conversations)

If you want to implement shared conversations where multiple users can access the same attachments, you can replace the basic SELECT policy with this enhanced version:

```sql
-- Enhanced select policy for shared conversations
DROP POLICY IF EXISTS "Allow users to view their own chat attachments" ON storage.objects;

CREATE POLICY "Allow users to view shared chat attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (
    -- User uploaded the file
    (SELECT auth.uid()) = owner_id::uuid
    OR
    -- User has access to the chat containing this attachment
    EXISTS (
      SELECT 1 FROM chats c
      JOIN messages m ON c.id = m.chat_id
      JOIN jsonb_array_elements(m.attachments) AS att ON true
      WHERE att->>'filePath' = name
      AND (
        c.user_id = auth.uid()
        OR c.is_collaborative = true
      )
    )
  )
);
```

### 4. User-Specific Folder Policy (Alternative)

If you prefer to organize files by user ID folders, you can use this alternative upload policy:

```sql
-- Alternative: Users upload to their own user ID folder
CREATE POLICY "Allow authenticated uploads to user folders"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[1] = 'uploads'
  AND (storage.foldername(name))[2] = (SELECT auth.uid()::text)
);
```

This would create a folder structure like:

```
chat-attachments/
├── uploads/
│   ├── user-uuid-1/
│   │   ├── file1.jpg
│   │   └── file2.pdf
│   ├── user-uuid-2/
│   │   └── file3.png
```

## File Structure

The application organizes files in the following structure:

```
chat-attachments/
├── uploads/
│   ├── 2024/
│   │   ├── 1/          # January
│   │   ├── 2/          # February
│   │   └── ...
│   ├── 2025/
│   │   └── ...
```

**Note**: If you choose the user-specific folder approach, the structure would be:

```
chat-attachments/
├── uploads/
│   ├── user-uuid-1/
│   ├── user-uuid-2/
│   └── ...
```

## Security Benefits

### ✅ Private Storage

- Files are not accessible via direct URLs
- All access requires authentication
- Signed URLs provide temporary, secure access

### ✅ Access Control

- Row Level Security policies enforce permissions based on file ownership
- Users can only access files they uploaded (unless shared)
- Prevents unauthorized file access

### ✅ URL Expiration

- Signed URLs expire after 1 hour
- Reduces risk of URL sharing abuse
- URLs are automatically refreshed when needed

## Migration from Public Bucket

If you're migrating from a public bucket:

1. **Update bucket to private** in Supabase dashboard
2. **Apply RLS policies** as shown above
3. **Update existing attachment URLs** to use signed URLs:

```typescript
// Robust migration script with batch processing and error handling
const migrateAttachments = async () => {
  const BATCH_SIZE = 100; // Process messages in batches
  const UPDATE_BATCH_SIZE = 50; // Update messages in smaller batches

  // Regex pattern to extract file path from various URL formats
  const URL_PATTERNS = [
    /\/public\/chat-attachments\/(.+)$/, // Standard public URL
    /\/storage\/v1\/object\/public\/chat-attachments\/(.+)$/, // Full storage URL
    /\/chat-attachments\/(.+)$/, // Simple bucket path
  ];

  let totalProcessed = 0;
  let totalErrors = 0;
  let offset = 0;

  console.log("🚀 Starting attachment migration...");

  try {
    while (true) {
      // Fetch messages in batches
      const { data: messages, error: fetchError } = await supabase
        .from("messages")
        .select("id, attachments")
        .not("attachments", "is", null)
        .range(offset, offset + BATCH_SIZE - 1)
        .order("created_at", { ascending: true });

      if (fetchError) {
        console.error("❌ Error fetching messages:", fetchError);
        throw fetchError;
      }

      if (!messages || messages.length === 0) {
        console.log("✅ No more messages to process");
        break;
      }

      console.log(`📦 Processing batch: ${offset + 1}-${offset + messages.length}`);

      const processedMessages: Array<{ id: string; attachments: any[] }> = [];

      // Process each message with error handling
      for (const message of messages) {
        try {
          const updatedAttachments = message.attachments.map((attachment: any) => {
            if (!attachment.filePath && attachment.url) {
              const filePath = extractFilePathFromUrl(attachment.url);
              if (filePath) {
                return { ...attachment, filePath };
              } else {
                console.warn(`⚠️  Failed to extract file path from URL: ${attachment.url}`);
                return attachment; // Keep original if extraction fails
              }
            }
            return attachment;
          });

          // Only include messages that had successful updates
          if (JSON.stringify(updatedAttachments) !== JSON.stringify(message.attachments)) {
            processedMessages.push({
              id: message.id,
              attachments: updatedAttachments,
            });
          }
        } catch (error) {
          console.error(`❌ Error processing message ${message.id}:`, error);
          totalErrors++;
          continue; // Skip this message and continue with others
        }
      }

      // Update messages in smaller batches to avoid timeouts
      if (processedMessages.length > 0) {
        await updateMessagesInBatches(processedMessages, UPDATE_BATCH_SIZE);
      }

      totalProcessed += messages.length;
      offset += BATCH_SIZE;

      // Progress update
      console.log(`📊 Progress: ${totalProcessed} messages processed, ${totalErrors} errors`);

      // Small delay to avoid overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`🎉 Migration completed! Processed: ${totalProcessed}, Errors: ${totalErrors}`);
  } catch (error) {
    console.error("💥 Migration failed:", error);
    throw error;
  }
};

/**
 * Extract file path from URL using multiple regex patterns
 */
const extractFilePathFromUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    // Try each pattern until one matches
    for (const pattern of URL_PATTERNS) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return decodeURIComponent(match[1]); // Decode URL-encoded characters
      }
    }

    // Fallback: try to parse as URL and extract pathname
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/chat-attachments/");
      if (pathParts.length > 1 && pathParts[1]) {
        return decodeURIComponent(pathParts[1]);
      }
    } catch {
      // URL parsing failed, continue to return null
    }

    return null;
  } catch (error) {
    console.error(`Error extracting file path from URL ${url}:`, error);
    return null;
  }
};

/**
 * Update messages in batches with error handling
 */
const updateMessagesInBatches = async (
  messages: Array<{ id: string; attachments: any[] }>,
  batchSize: number,
) => {
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);

    try {
      // Process batch updates in parallel but with individual error handling
      const updatePromises = batch.map(async (message) => {
        try {
          const { error } = await supabase
            .from("messages")
            .update({ attachments: message.attachments })
            .eq("id", message.id);

          if (error) {
            console.error(`❌ Error updating message ${message.id}:`, error);
            return { success: false, id: message.id, error };
          }

          return { success: true, id: message.id };
        } catch (err) {
          console.error(`❌ Exception updating message ${message.id}:`, err);
          return { success: false, id: message.id, error: err };
        }
      });

      const results = await Promise.allSettled(updatePromises);
      const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
      const failed = results.length - successful;

      if (failed > 0) {
        console.warn(`⚠️  Batch update completed with ${failed} failures out of ${results.length}`);
      }
    } catch (error) {
      console.error(`❌ Batch update failed for batch starting at index ${i}:`, error);
      // Continue with next batch instead of failing completely
    }
  }
};
```

## Environment Variables

Ensure your `.env` includes:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Common Issues

1. **"Access Denied" errors**
   - Verify RLS policies are correctly set up
   - Check that bucket is marked as private
   - Ensure user is authenticated
   - Verify `owner_id` is set correctly on uploaded files

2. **Signed URL generation fails**
   - Verify file path format matches bucket structure
   - Check bucket permissions in Supabase dashboard
   - Ensure adequate Supabase plan limits

3. **Files not uploading**
   - Check file size limits
   - Verify MIME type restrictions
   - Review bucket policies for INSERT permissions
   - Ensure folder structure matches policy expectations

### Testing Your Policies

You can test your policies by trying to:

1. **Upload a file** (should work for authenticated users)
2. **View your own file** (should work)
3. **View another user's file** (should fail unless shared)
4. **Delete your own file** (should work)
5. **Delete another user's file** (should fail)

### Support Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
