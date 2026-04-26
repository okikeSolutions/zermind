"use client";

import { type Attachment } from "@/lib/schemas/chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, FileText, ExternalLink, Download, Eye, Paperclip } from "lucide-react";
import { formatBytes } from "@/components/dropzone";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

interface MessageAttachmentProps {
  attachments: Attachment[];
  className?: string;
  showCompact?: boolean; // New prop for compact view in message list
}

export function MessageAttachment({
  attachments,
  className,
  showCompact = false,
}: MessageAttachmentProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const blobUrlsRef = useRef<Map<string, string>>(new Map());

  // Cleanup blob URLs when component unmounts or attachments change
  useEffect(() => {
    const currentBlobUrls = blobUrlsRef.current;
    return () => {
      currentBlobUrls.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  // Clean up blob URLs when attachments change
  useEffect(() => {
    const currentAttachmentIds = new Set(attachments.map((att) => att.id));
    const staleUrls: string[] = [];

    blobUrlsRef.current.forEach((blobUrl, attachmentId) => {
      if (!currentAttachmentIds.has(attachmentId)) {
        URL.revokeObjectURL(blobUrl);
        staleUrls.push(attachmentId);
      }
    });

    staleUrls.forEach((id) => {
      blobUrlsRef.current.delete(id);
    });
  }, [attachments]);

  const handleImageError = (attachmentId: string) => {
    setImageErrors((prev) => new Set(prev).add(attachmentId));
  };

  const createBlobUrl = useCallback((attachment: Attachment): string => {
    try {
      // Check if we already have a blob URL for this attachment
      const existingBlobUrl = blobUrlsRef.current.get(attachment.id);
      if (existingBlobUrl) {
        return existingBlobUrl;
      }

      // Convert data URL to blob
      const [header, data] = attachment.url.split(",");
      const mimeType = header.match(/:(.*?);/)?.[1] || attachment.mimeType;
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // Store the blob URL for cleanup
      blobUrlsRef.current.set(attachment.id, blobUrl);

      return blobUrl;
    } catch (error) {
      console.error("Failed to create blob URL for attachment:", attachment.id, error);
      return attachment.url; // Fallback to original data URL
    }
  }, []);

  const getAttachmentUrl = (attachment: Attachment): string => {
    // Define size threshold for converting to blob URL (1MB in base64 ≈ 1.33MB in bytes)
    const LARGE_ATTACHMENT_THRESHOLD = 1024 * 1024; // 1MB in base64 characters

    try {
      // For large attachments, use blob URLs to avoid browser performance issues
      // Data URLs can cause problems with window.open() and Next.js Image components
      if (attachment.url.length > LARGE_ATTACHMENT_THRESHOLD) {
        return createBlobUrl(attachment);
      }

      // For smaller attachments, use the original data URL
      return attachment.url;
    } catch (error) {
      console.error("Error processing attachment URL:", error);
      return attachment.url; // Fallback to original data URL
    }
  };

  // Early return after all hooks are defined
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "Image";
    }
    if (mimeType === "application/pdf") {
      return "PDF";
    }
    return "Document";
  };

  // Compact view - just show attachment indicator
  if (showCompact) {
    return (
      <div className={cn("flex items-center space-x-1 mt-1", className)}>
        <Paperclip className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {attachments.length} attachment{attachments.length > 1 ? "s" : ""}
        </span>
        <div className="flex space-x-1">
          {attachments.slice(0, 3).map((attachment) => (
            <div key={attachment.id} className="h-2 w-2 rounded-full bg-current opacity-60" />
          ))}
          {attachments.length > 3 && (
            <span className="text-xs text-muted-foreground">+{attachments.length - 3}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 mt-2", className)}>
      {/* Grid layout for multiple images */}
      {attachments.filter((att) => att.type === "image" && !imageErrors.has(att.id)).length > 1 ? (
        <div className="grid grid-cols-2 gap-2">
          {attachments
            .filter((att) => att.type === "image" && !imageErrors.has(att.id))
            .slice(0, 4)
            .map((attachment) => (
              <Card
                key={attachment.id}
                className="overflow-hidden cursor-pointer"
                onClick={() => setExpandedImage(attachment.id)}
              >
                <div className="relative aspect-square">
                  <NextImage
                    src={getAttachmentUrl(attachment)}
                    alt={attachment.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(attachment.id)}
                  />
                  {attachments.filter((att) => att.type === "image").length > 4 &&
                    attachments.filter((att) => att.type === "image").indexOf(attachment) === 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium">
                          +{attachments.filter((att) => att.type === "image").length - 4}
                        </span>
                      </div>
                    )}
                </div>
              </Card>
            ))}
        </div>
      ) : (
        attachments.map((attachment) => {
          const isImage = attachment.type === "image" && !imageErrors.has(attachment.id);

          return (
            <Card
              key={attachment.id}
              className="overflow-hidden bg-background/50 hover:bg-background/70 transition-colors"
            >
              {isImage ? (
                <div className="relative">
                  <div className="relative max-w-sm">
                    <NextImage
                      src={getAttachmentUrl(attachment)}
                      alt={attachment.name}
                      width={400}
                      height={300}
                      className="object-cover max-w-full h-auto rounded-t-lg cursor-pointer"
                      onError={() => handleImageError(attachment.id)}
                      onClick={() => setExpandedImage(attachment.id)}
                    />
                    {/* Image overlay controls */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-6 w-6 p-0 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedImage(attachment.id);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-6 w-6 p-0 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(getAttachmentUrl(attachment), "_blank");
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-2 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge variant="secondary" className="text-xs">
                          {getFileTypeLabel(attachment.mimeType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(attachment.size)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => window.open(getAttachmentUrl(attachment), "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs font-medium truncate mt-1">{attachment.name}</p>
                  </CardContent>
                </div>
              ) : (
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        {getFileTypeIcon(attachment.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getFileTypeLabel(attachment.mimeType)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(attachment.size)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getAttachmentUrl(attachment), "_blank")}
                        className="h-8 w-8 p-0"
                        title="View document"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = getAttachmentUrl(attachment);
                          link.download = attachment.name;
                          link.click();
                        }}
                        className="h-8 w-8 p-0"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })
      )}

      {/* Expanded image modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => setExpandedImage(null)}
            >
              ✕
            </Button>
            {(() => {
              const attachment = attachments.find((att) => att.id === expandedImage);
              return attachment ? (
                <NextImage
                  src={getAttachmentUrl(attachment)}
                  alt={attachment.name}
                  width={800}
                  height={600}
                  className="object-contain max-w-full max-h-full"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
