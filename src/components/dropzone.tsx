import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, File, Loader2, Upload, X } from "lucide-react";
import { createContext, type PropsWithChildren, useCallback, useContext } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import Image from "@/components/app-image";
import { sx } from "@/styles/sx";

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined) return size !== undefined ? `0 ${size}` : "0 bytes";
  const i = size !== undefined ? sizes.indexOf(size) : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export interface FileWithErrors extends File {
  preview?: string;
  errors: Array<{ code: string; message: string }>;
}

type DropzoneContextType = {
  files: FileWithErrors[];
  setFiles: (files: FileWithErrors[]) => void;
  onUpload: () => Promise<void>;
  loading: boolean;
  successes: string[];
  errors: Array<{ name: string; message: string }>;
  maxFileSize: number;
  maxFiles: number;
  isSuccess: boolean;
  isDragActive: boolean;
  isDragReject: boolean;
  openFileDialog?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

type DropzoneProps = Omit<DropzoneContextType, "isDragActive" | "isDragReject" | "inputRef"> & {
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & Record<string, unknown>;
  accept?: Accept;
  disabled?: boolean;
  onFilesAccepted?: (files: File[]) => void;
  maxFileSize: number;
  maxFiles: number;
};

const Dropzone = ({
  className,
  children,
  accept,
  disabled,
  onFilesAccepted,
  inputProps,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const { getRootProps, getInputProps, inputRef, isDragActive, isDragReject, open } = useDropzone({
    accept,
    disabled,
    multiple: restProps.maxFiles !== 1,
    maxFiles: restProps.maxFiles,
    maxSize: restProps.maxFileSize,
    noClick: true,
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const rejectedFiles = fileRejections.map((rejection) =>
        Object.assign(rejection.file, {
          preview: rejection.file.type.startsWith("image/")
            ? URL.createObjectURL(rejection.file)
            : undefined,
          errors: rejection.errors.map((error) => ({
            code: error.code,
            message: error.message,
          })),
        }),
      );

      if (rejectedFiles.length > 0) {
        restProps.setFiles([...restProps.files, ...rejectedFiles]);
      }
      if (acceptedFiles.length > 0) {
        onFilesAccepted?.(acceptedFiles);
      }
    },
  });

  const isSuccess = restProps.isSuccess;
  const isActive = isDragActive;
  const isInvalid =
    (isDragActive && isDragReject) ||
    (restProps.errors.length > 0 && !restProps.isSuccess) ||
    restProps.files.some((file) => file.errors.length !== 0);

  return (
    <DropzoneContext.Provider
      value={{
        ...restProps,
        isDragActive,
        isDragReject,
        inputRef,
        openFileDialog: open,
      }}
    >
      <div
        {...getRootProps(
          sx(
            cn(
              "border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground",
              className,
              isSuccess ? "border-solid" : "border-dashed",
              isActive && "border-primary bg-primary/10",
              isInvalid && "border-destructive bg-destructive/10",
            ),
          ),
        )}
      >
        <input {...getInputProps(inputProps)} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
};
const DropzoneContent = ({ className }: { className?: string }) => {
  const {
    files,
    setFiles,
    onUpload,
    loading,
    successes,
    errors,
    maxFileSize,
    maxFiles,
    isSuccess,
  } = useDropzoneContext();

  const exceedMaxFiles = files.length > maxFiles;

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setFiles(files.filter((file) => file.name !== fileName));
    },
    [files, setFiles],
  );

  if (isSuccess) {
    return (
      <div {...sx(cn("flex flex-row items-center gap-x-2 justify-center", className))}>
        <CheckCircle size={16} {...sx("text-primary")} />
        <p {...sx("text-primary text-sm")}>
          Successfully uploaded {files.length} file{files.length > 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return (
    <div {...sx(cn("flex flex-col", className))}>
      {files.map((file, idx) => {
        const fileError = errors.find((e) => e.name === file.name);
        const isSuccessfullyUploaded = !!successes.find((e) => e === file.name);

        return (
          <div
            key={`${file.name}-${idx}`}
            {...sx("flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 ")}
          >
            {file.type.startsWith("image/") ? (
              <div
                {...sx(
                  "h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center",
                )}
              >
                <Image
                  src={file.preview || ""}
                  alt={file.name}
                  width={40}
                  height={40}
                  {...sx("object-cover")}
                />
              </div>
            ) : (
              <div {...sx("h-10 w-10 rounded border bg-muted flex items-center justify-center")}>
                <File size={18} />
              </div>
            )}

            <div {...sx("shrink grow flex flex-col items-start truncate")}>
              <p title={file.name} {...sx("text-sm truncate max-w-full")}>
                {file.name}
              </p>
              {file.errors.length > 0 ? (
                <p {...sx("text-xs text-destructive")}>
                  {file.errors
                    .map((e) =>
                      e.message.startsWith("File is larger than")
                        ? `File is larger than ${formatBytes(
                            maxFileSize,
                            2,
                          )} (Size: ${formatBytes(file.size, 2)})`
                        : e.message,
                    )
                    .join(", ")}
                </p>
              ) : loading && !isSuccessfullyUploaded ? (
                <p {...sx("text-xs text-muted-foreground")}>Uploading file...</p>
              ) : fileError ? (
                <p {...sx("text-xs text-destructive")}>Failed to upload: {fileError.message}</p>
              ) : isSuccessfullyUploaded ? (
                <p {...sx("text-xs text-primary")}>Successfully uploaded file</p>
              ) : (
                <p {...sx("text-xs text-muted-foreground")}>{formatBytes(file.size, 2)}</p>
              )}
            </div>

            {!loading && !isSuccessfullyUploaded && (
              <Button
                size="icon"
                variant="link"
                className="shrink-0 justify-self-end text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveFile(file.name)}
              >
                <X />
              </Button>
            )}
          </div>
        );
      })}
      {exceedMaxFiles && (
        <p {...sx("text-sm text-left mt-2 text-destructive")}>
          You may upload only up to {maxFiles} files, please remove {files.length - maxFiles} file
          {files.length - maxFiles > 1 ? "s" : ""}.
        </p>
      )}
      {files.length > 0 && !exceedMaxFiles && (
        <div {...sx("mt-2")}>
          <Button
            variant="outline"
            onClick={onUpload}
            disabled={files.some((file) => file.errors.length !== 0) || loading}
          >
            {loading ? (
              <>
                <Loader2 {...sx("mr-2 h-4 w-4 animate-spin")} />
                Uploading...
              </>
            ) : (
              <>Upload files</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { maxFiles, maxFileSize, inputRef, openFileDialog, isSuccess } = useDropzoneContext();

  if (isSuccess) {
    return null;
  }

  return (
    <div {...sx(cn("flex flex-col items-center gap-y-2", className))}>
      <Upload size={20} {...sx("text-muted-foreground")} />
      <p {...sx("text-sm")}>
        Upload{!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ""} file
        {!maxFiles || maxFiles > 1 ? "s" : ""}
      </p>
      <div {...sx("flex flex-col items-center gap-y-1")}>
        <p {...sx("text-xs text-muted-foreground")}>
          Drag and drop or{" "}
          <button
            type="button"
            onClick={() => openFileDialog?.() ?? inputRef?.current?.click()}
            {...sx("underline cursor-pointer transition hover:text-foreground")}
          >
            select {maxFiles === 1 ? `file` : "files"}
          </button>{" "}
          to upload
        </p>
        {maxFileSize !== Number.POSITIVE_INFINITY && (
          <p {...sx("text-xs text-muted-foreground")}>
            Maximum file size: {formatBytes(maxFileSize, 2)}
          </p>
        )}
      </div>
    </div>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext };
