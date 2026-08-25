import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { type Attachment } from "@/lib/schemas/chat";
import { getFriendlyErrorMessage } from "@/lib/rate-limit-error";
import { nanoid } from "nanoid";
import {
  getAllowedMimeTypes,
  getMaxFileSize,
  getModelCapabilities,
  modelSupportsAttachments,
} from "@/lib/utils/model-utils";
import * as m from "@/paraglide/messages.js";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface UseFileAttachmentsOptions {
  model: string;
  chatId?: string;
}

export function useFileAttachments({ model, chatId }: UseFileAttachmentsOptions) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveUploadedFile = useMutation(api.files.saveUploadedFile);
  const [pendingFiles, setPendingFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [dragCounter, setDragCounter] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars

  const allowedMimeTypes = getAllowedMimeTypes(model);
  const modelCapabilities = getModelCapabilities(model);
  const supportsAttachments = modelSupportsAttachments(model);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!supportsAttachments) {
        return m.copy_this_model_does_not_support_file_attachments();
      }

      if (!allowedMimeTypes.includes(file.type)) {
        return m.copy_file_type_is_not_supported({ type: file.type });
      }

      const maxSize = getMaxFileSize(model, file.type);
      if (file.size > maxSize) {
        return m.copy_file_is_too_large_maximum_size({
          size: `${Math.round(maxSize / (1024 * 1024))} MB`,
        });
      }

      return null;
    },
    [supportsAttachments, allowedMimeTypes, model],
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
    [validateFile],
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

  const uploadFilesToStorage = useCallback(async (): Promise<Attachment[]> => {
    if (pendingFiles.length === 0) return [];

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedAttachments: Attachment[] = [];

      for (const file of pendingFiles) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(m.copy_failed_to_upload_file({ name: file.name }));
        }

        const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
        const attachment = await saveUploadedFile({
          storageId,
          chatId: chatId ? (chatId as Id<"chats">) : undefined,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          type: file.type.startsWith("image/") ? "image" : "document",
        });

        uploadedAttachments.push(attachment);
      }

      clearFiles();
      return uploadedAttachments;
    } catch (error) {
      const nextError = new Error(getFriendlyErrorMessage(error, m.copy_failed_to_upload_files()));
      setUploadError(nextError);
      console.error("Failed to upload files:", nextError);
      throw nextError;
    } finally {
      setIsUploading(false);
    }
  }, [chatId, clearFiles, generateUploadUrl, pendingFiles, saveUploadedFile]);

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
    [addFiles],
  );

  return {
    pendingFiles,
    isDragOver,
    isUploading,
    uploadError,
    addFiles,
    removeFile,
    clearFiles,
    processFilesDirectly: uploadFilesToStorage,
    uploadFilesToStorage,
    supportsAttachments,
    modelCapabilities,
    allowedMimeTypes,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
