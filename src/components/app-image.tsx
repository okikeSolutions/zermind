import { forwardRef, type ImgHTMLAttributes } from "react";

type AppImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> & {
  alt: string;
  fill?: boolean;
};

export const AppImage = forwardRef<HTMLImageElement, AppImageProps>(function AppImage(
  { alt, fill = false, style, ...props },
  ref,
) {
  return (
    <img
      ref={ref}
      alt={alt}
      {...props}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              ...style,
            }
          : style
      }
    />
  );
});

export default AppImage;
