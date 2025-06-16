import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { type Attachment } from "@/lib/schemas/chat";
import { nanoid } from "nanoid";
import {
  getAllowedMimeTypes,
  getMaxFileSize,
  getModelCapabilities,
  modelSupportsAttachments,
} from "@/lib/utils/model-utils";

const supabase = createClient();

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface UseFileAttachmentsOptions {
  model: string;
}

export function useFileAttachments({ model }: UseFileAttachmentsOptions) {
  const [pendingFiles, setPendingFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars

  const allowedMimeTypes = getAllowedMimeTypes(model);
  const modelCapabilities = getModelCapabilities(model);
  const supportsAttachments = modelSupportsAttachments(model);

  // Upload mutation using React Query
  const uploadMutation = useMutation({
    mutationFn: async (files: FileWithPreview[]): Promise<Attachment[]> => {
      if (!files.length) return [];

      const uploadPromises = files.map(async (file) => {
        const fileName = `${nanoid()}-${file.name}`;
        const filePath = `uploads/${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${fileName}`;

        // Upload to private bucket
        const { error } = await supabase.storage
          .from("chat-attachments")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        // Generate signed URL for private access
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("chat-attachments")
            .createSignedUrl(filePath, 3600); // 1 hour expiry

        if (signedUrlError) {
          // Rollback: Delete the uploaded file to prevent orphaned files
          await supabase.storage.from("chat-attachments").remove([filePath]);

          throw new Error(
            `Failed to generate signed URL for ${file.name}: ${signedUrlError.message}`
          );
        }

        return {
          id: file.id,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          url: signedUrlData.signedUrl,
          filePath: filePath, // Store path for future signed URL generation
          type: file.type.startsWith("image/") ? "image" : "document",
        } as Attachment;
      });

      return Promise.all(uploadPromises);
    },
  });

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!supportsAttachments) {
        return "This model does not support file attachments";
      }

      if (!allowedMimeTypes.includes(file.type)) {
        return `File type ${file.type} is not supported`;
      }

      const maxSize = getMaxFileSize(model, file.type);
      if (file.size > maxSize) {
        return `File is too large. Maximum size is ${Math.round(
          maxSize / (1024 * 1024)
        )}MB`;
      }

      return null;
    },
    [supportsAttachments, allowedMimeTypes, model]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const validFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          const fileWithPreview: FileWithPreview = Object.assign(file, {
            preview: URL.createObjectURL(file),
            id: nanoid(),
          });
          validFiles.push(fileWithPreview);
        }
      });

      if (validFiles.length > 0) {
        setPendingFiles((prev) => [...prev, ...validFiles]);
      }

      if (errors.length > 0) {
        // You might want to handle errors differently, maybe through a toast
        console.error("File validation errors:", errors);
        alert(errors.join("\n"));
      }
    },
    [validateFile]
  );

  const removeFile = useCallback((fileId: string) => {
    setPendingFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  const clearFiles = useCallback(() => {
    pendingFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setPendingFiles([]);
  }, [pendingFiles]);

  // Upload files and return attachments
  const uploadFiles = useCallback(async (): Promise<Attachment[]> => {
    if (pendingFiles.length === 0) return [];

    try {
      const attachments = await uploadMutation.mutateAsync(pendingFiles);
      clearFiles(); // Clear pending files after successful upload
      return attachments;
    } catch (error) {
      console.error("Failed to upload files:", error);
      throw error;
    }
  }, [pendingFiles, uploadMutation, clearFiles]);

  // Helper function to compress images
  const compressImage = useCallback(
    async (dataUrl: string, maxSizeKB: number = 200): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          // Calculate new dimensions to reduce file size
          let { width, height } = img;
          const aspectRatio = width / height;

          // Reduce dimensions if image is very large
          const maxDimension = 800; // Smaller max dimension to reduce tokens
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              width = maxDimension;
              height = width / aspectRatio;
            } else {
              height = maxDimension;
              width = height * aspectRatio;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Try different quality levels to stay under size limit
          let quality = 0.7; // Start with lower quality
          let compressedData = canvas.toDataURL("image/jpeg", quality);

          // Reduce quality until under size limit
          while (
            compressedData.length > maxSizeKB * 1024 * 1.37 &&
            quality > 0.1
          ) {
            // 1.37 factor for base64 overhead
            quality -= 0.1;
            compressedData = canvas.toDataURL("image/jpeg", quality);
          }

          console.log(
            `Image compressed: ${dataUrl.length} -> ${compressedData.length} bytes (quality: ${quality})`
          );
          resolve(compressedData);
        };
        img.src = dataUrl;
      });
    },
    []
  );

  // Process files directly without uploading to storage (for privacy)
  const processFilesDirectly = useCallback(async (): Promise<Attachment[]> => {
    if (pendingFiles.length === 0) return [];

    try {
      const processedAttachments: Attachment[] = [];

      for (const file of pendingFiles) {
        // Convert file to base64 for direct processing
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix to get just the base64 data
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Create attachment object with base64 data URL
        let dataUrl = `data:${file.type};base64,${base64Data}`;

        // Compress images to avoid token limits
        if (file.type.startsWith("image/")) {
          dataUrl = await compressImage(dataUrl, 200); // 200KB limit
        }

        processedAttachments.push({
          id: file.id,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          url: dataUrl, // Use data URL instead of storage URL
          type: file.type.startsWith("image/") ? "image" : "document",
        });
      }

      clearFiles(); // Clear pending files after processing
      return processedAttachments;
    } catch (error) {
      console.error("Failed to process files:", error);
      throw error;
    }
  }, [pendingFiles, clearFiles, compressImage]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsDragOver(false);
        return 0;
      }
      return newCount;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        addFiles(files);
      }
    },
    [addFiles]
  );

  return {
    pendingFiles,
    isDragOver,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    processFilesDirectly,
    supportsAttachments,
    modelCapabilities,
    allowedMimeTypes,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
