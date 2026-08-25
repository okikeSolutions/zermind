import * as stylex from "@stylexjs/stylex";

export const utilityStyles = stylex.create({
  "-mx-1": {
    "@layer utilities": {
      marginInline: "calc(var(--spacing) * -1)",
    },
  },
  "-space-x-2": {
    "@layer utilities": {
      "--tw-space-x-reverse": "0",
      marginInlineStart: "calc(calc(var(--spacing) * -2) * var(--tw-space-x-reverse))",
      marginInlineEnd: "calc(calc(var(--spacing) * -2) * calc(1 - var(--tw-space-x-reverse)))",
    },
  },
  "-translate-x-1/2": {
    "@layer utilities": {
      "--tw-translate-x": "calc(calc(1 / 2 * 100%) * -1)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "-translate-x-px": {
    "@layer utilities": {
      "--tw-translate-x": "-1px",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "-translate-y-1/2": {
    "@layer utilities": {
      "--tw-translate-y": "calc(calc(1 / 2 * 100%) * -1)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "[.border-b]:pb-6": {
    "@layer utilities": {
      paddingBottom: "calc(var(--spacing) * 6)",
    },
  },
  "[.border-t]:pt-6": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 6)",
    },
  },
  "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2": {
    "@layer utilities": {
      right: "calc(var(--spacing) * -2)",
    },
  },
  "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize": {
    "@layer utilities": {
      cursor: "e-resize",
    },
  },
  "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2": {
    "@layer utilities": {
      left: "calc(var(--spacing) * -2)",
    },
  },
  "[[data-side=right][data-state=collapsed]_&]:cursor-w-resize": {
    "@layer utilities": {
      cursor: "w-resize",
    },
  },
  "[&_input]:hidden": {
    "@layer utilities": {
      display: "none",
    },
  },
  "[&_p]:leading-relaxed": {
    "@layer utilities": {
      "--tw-leading": "var(--leading-relaxed)",
      lineHeight: "var(--leading-relaxed)",
    },
  },
  "[&_svg:not([class*='size-'])]:size-4": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 4)",
      height: "calc(var(--spacing) * 4)",
    },
  },
  "[&_svg:not([class*='text-'])]:text-muted-foreground": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
    },
  },
  "[&_svg]:pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "[&_svg]:shrink-0": {
    "@layer utilities": {
      flexShrink: "0",
    },
  },
  "[&>button]:hidden": {
    "@layer utilities": {
      display: "none",
    },
  },
  "[&>span:last-child]:truncate": {
    "@layer utilities": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  "[&>svg]:pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "[&>svg]:shrink-0": {
    "@layer utilities": {
      flexShrink: "0",
    },
  },
  "[&>svg]:size-3": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 3)",
      height: "calc(var(--spacing) * 3)",
    },
  },
  "[&>svg]:size-4": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 4)",
      height: "calc(var(--spacing) * 4)",
    },
  },
  "[&>svg]:text-current": {
    "@layer utilities": {
      color: "currentcolor",
    },
  },
  "[&>svg]:text-sidebar-accent-foreground": {
    "@layer utilities": {
      color: "var(--sidebar-accent-foreground)",
    },
  },
  "[&>svg]:translate-y-0.5": {
    "@layer utilities": {
      "--tw-translate-y": "calc(var(--spacing) * 0.5)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "[a&]:hover:bg-accent": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--accent)",
      },
    },
  },
  "[a&]:hover:bg-destructive/90": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--destructive)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--destructive) 90%, transparent)",
        },
      },
    },
  },
  "[a&]:hover:bg-primary/90": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--primary)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--primary) 90%, transparent)",
        },
      },
    },
  },
  "[a&]:hover:bg-secondary/90": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--secondary)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--secondary) 90%, transparent)",
        },
      },
    },
  },
  "[a&]:hover:text-accent-foreground": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--accent-foreground)",
      },
    },
  },
  "[animation-delay:-0.15s]": {
    "@layer utilities": {
      animationDelay: "-0.15s",
    },
  },
  "[animation-delay:-0.3s]": {
    "@layer utilities": {
      animationDelay: "-0.3s",
    },
  },
  "@container/card-header": {
    "@layer utilities": {
      containerType: "inline-size",
      containerName: "card-header",
    },
  },
  "*:[span]:last:flex": {
    "@layer utilities": {
      display: "flex",
    },
  },
  "*:[span]:last:gap-2": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 2)",
    },
  },
  "*:[span]:last:items-center": {
    "@layer utilities": {
      alignItems: "center",
    },
  },
  "*:data-[slot=alert-description]:text-destructive/90": {
    "@layer utilities": {
      color: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        color: "color-mix(in oklab, var(--destructive) 90%, transparent)",
      },
    },
  },
  "*:data-[slot=select-value]:flex": {
    "@layer utilities": {
      display: "flex",
    },
  },
  "*:data-[slot=select-value]:gap-2": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 2)",
    },
  },
  "*:data-[slot=select-value]:items-center": {
    "@layer utilities": {
      alignItems: "center",
    },
  },
  "*:data-[slot=select-value]:line-clamp-1": {
    "@layer utilities": {
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: "1",
    },
  },
  absolute: {
    "@layer utilities": {
      position: "absolute",
    },
  },
  "active:bg-sidebar-accent": {
    "@layer utilities": {
      backgroundColor: "var(--sidebar-accent)",
    },
  },
  "active:scale-[0.98]": {
    "@layer utilities": {
      scale: "0.98",
    },
  },
  "active:text-sidebar-accent-foreground": {
    "@layer utilities": {
      color: "var(--sidebar-accent-foreground)",
    },
  },
  "after:-inset-2": {
    "@layer utilities": {
      content: "var(--tw-content)",
      inset: "calc(var(--spacing) * -2)",
    },
  },
  "after:absolute": {
    "@layer utilities": {
      content: "var(--tw-content)",
      position: "absolute",
    },
  },
  "after:inset-y-0": {
    "@layer utilities": {
      content: "var(--tw-content)",
      insetBlock: "calc(var(--spacing) * 0)",
    },
  },
  "after:left-1/2": {
    "@layer utilities": {
      content: "var(--tw-content)",
      left: "calc(1 / 2 * 100%)",
    },
  },
  "after:w-[2px]": {
    "@layer utilities": {
      content: "var(--tw-content)",
      width: "2px",
    },
  },
  "animate-bounce": {
    "@layer utilities": {
      animation: "var(--animate-bounce)",
    },
  },
  "animate-in": {
    "@layer utilities": {
      animation:
        "enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)",
    },
  },
  "animate-pulse": {
    "@layer utilities": {
      animation: "var(--animate-pulse)",
    },
  },
  "animate-spin": {
    "@layer utilities": {
      animation: "var(--animate-spin)",
    },
  },
  "aria-disabled:opacity-50": {
    "@layer utilities": {
      opacity: "50%",
    },
  },
  "aria-disabled:pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "aria-invalid:border-destructive": {
    "@layer utilities": {
      borderColor: "var(--destructive)",
    },
  },
  "aria-invalid:ring-destructive/20": {
    "@layer utilities": {
      "--tw-ring-color": "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-ring-color": "color-mix(in oklab, var(--destructive) 20%, transparent)",
      },
    },
  },
  "aspect-square": {
    "@layer utilities": {
      aspectRatio: "1 / 1",
    },
  },
  "auto-rows-min": {
    "@layer utilities": {
      gridAutoRows: "min-content",
    },
  },
  "backdrop-blur": {
    "@layer utilities": {
      "--tw-backdrop-blur": "blur(8px)",
      WebkitBackdropFilter:
        "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
      backdropFilter:
        "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    },
  },
  "backdrop-blur-sm": {
    "@layer utilities": {
      "--tw-backdrop-blur": "blur(var(--blur-sm))",
      WebkitBackdropFilter:
        "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
      backdropFilter:
        "var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)",
    },
  },
  "bg-accent": {
    "@layer utilities": {
      backgroundColor: "var(--accent)",
    },
  },
  "bg-background": {
    "@layer utilities": {
      backgroundColor: "var(--background)",
    },
  },
  "bg-background/50": {
    "@layer utilities": {
      backgroundColor: "var(--background)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--background) 50%, transparent)",
      },
    },
  },
  "bg-background/80": {
    "@layer utilities": {
      backgroundColor: "var(--background)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--background) 80%, transparent)",
      },
    },
  },
  "bg-background/95": {
    "@layer utilities": {
      backgroundColor: "var(--background)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--background) 95%, transparent)",
      },
    },
  },
  "bg-black/20": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, #000 20%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-black) 20%, transparent)",
      },
    },
  },
  "bg-black/50": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, #000 50%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-black) 50%, transparent)",
      },
    },
  },
  "bg-black/80": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, #000 80%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-black) 80%, transparent)",
      },
    },
  },
  "bg-blue-100": {
    "@layer utilities": {
      backgroundColor: "var(--color-blue-100)",
    },
  },
  "bg-blue-50": {
    "@layer utilities": {
      backgroundColor: "var(--color-blue-50)",
    },
  },
  "bg-blue-50/50": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(97% 0.014 254.604) 50%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-blue-50) 50%, transparent)",
      },
    },
  },
  "bg-blue-500": {
    "@layer utilities": {
      backgroundColor: "var(--color-blue-500)",
    },
  },
  "bg-border": {
    "@layer utilities": {
      backgroundColor: "var(--border)",
    },
  },
  "bg-card": {
    "@layer utilities": {
      backgroundColor: "var(--card)",
    },
  },
  "bg-clip-text": {
    "@layer utilities": {
      backgroundClip: "text",
    },
  },
  "bg-current": {
    "@layer utilities": {
      backgroundColor: "currentcolor",
    },
  },
  "bg-destructive": {
    "@layer utilities": {
      backgroundColor: "var(--destructive)",
    },
  },
  "bg-destructive/10": {
    "@layer utilities": {
      backgroundColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--destructive) 10%, transparent)",
      },
    },
  },
  "bg-destructive/20": {
    "@layer utilities": {
      backgroundColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--destructive) 20%, transparent)",
      },
    },
  },
  "bg-emerald-50": {
    "@layer utilities": {
      backgroundColor: "var(--color-emerald-50)",
    },
  },
  "bg-gradient-to-br": {
    "@layer utilities": {
      "--tw-gradient-position": "to bottom right in oklab",
      backgroundImage: "linear-gradient(var(--tw-gradient-stops))",
    },
  },
  "bg-gradient-to-r": {
    "@layer utilities": {
      "--tw-gradient-position": "to right in oklab",
      backgroundImage: "linear-gradient(var(--tw-gradient-stops))",
    },
  },
  "bg-gray-100": {
    "@layer utilities": {
      backgroundColor: "var(--color-gray-100)",
    },
  },
  "bg-gray-200": {
    "@layer utilities": {
      backgroundColor: "var(--color-gray-200)",
    },
  },
  "bg-green-50": {
    "@layer utilities": {
      backgroundColor: "var(--color-green-50)",
    },
  },
  "bg-muted": {
    "@layer utilities": {
      backgroundColor: "var(--muted)",
    },
  },
  "bg-muted/30": {
    "@layer utilities": {
      backgroundColor: "var(--muted)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--muted) 30%, transparent)",
      },
    },
  },
  "bg-muted/50": {
    "@layer utilities": {
      backgroundColor: "var(--muted)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--muted) 50%, transparent)",
      },
    },
  },
  "bg-orange-50": {
    "@layer utilities": {
      backgroundColor: "var(--color-orange-50)",
    },
  },
  "bg-popover": {
    "@layer utilities": {
      backgroundColor: "var(--popover)",
    },
  },
  "bg-primary": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
    },
  },
  "bg-primary/10": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
      },
    },
  },
  "bg-primary/20": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--primary) 20%, transparent)",
      },
    },
  },
  "bg-primary/60": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--primary) 60%, transparent)",
      },
    },
  },
  "bg-purple-100": {
    "@layer utilities": {
      backgroundColor: "var(--color-purple-100)",
    },
  },
  "bg-purple-50": {
    "@layer utilities": {
      backgroundColor: "var(--color-purple-50)",
    },
  },
  "bg-purple-50/50": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(97.7% 0.014 308.299) 50%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-purple-50) 50%, transparent)",
      },
    },
  },
  "bg-red-500": {
    "@layer utilities": {
      backgroundColor: "var(--color-red-500)",
    },
  },
  "bg-secondary": {
    "@layer utilities": {
      backgroundColor: "var(--secondary)",
    },
  },
  "bg-sidebar": {
    "@layer utilities": {
      backgroundColor: "var(--sidebar)",
    },
  },
  "bg-sidebar-border": {
    "@layer utilities": {
      backgroundColor: "var(--sidebar-border)",
    },
  },
  "bg-slate-50": {
    "@layer utilities": {
      backgroundColor: "var(--color-slate-50)",
    },
  },
  "bg-transparent": {
    "@layer utilities": {
      backgroundColor: "transparent",
    },
  },
  "bg-yellow-100": {
    "@layer utilities": {
      backgroundColor: "var(--color-yellow-100)",
    },
  },
  "bg-zinc-900": {
    "@layer utilities": {
      backgroundColor: "var(--color-zinc-900)",
    },
  },
  block: {
    "@layer utilities": {
      display: "block",
    },
  },
  border: {
    "@layer utilities": {
      borderStyle: "var(--tw-border-style)",
      borderWidth: "1px",
    },
  },
  "border-2": {
    "@layer utilities": {
      borderStyle: "var(--tw-border-style)",
      borderWidth: "2px",
    },
  },
  "border-b": {
    "@layer utilities": {
      borderBottomStyle: "var(--tw-border-style)",
      borderBottomWidth: "1px",
    },
  },
  "border-b-2": {
    "@layer utilities": {
      borderBottomStyle: "var(--tw-border-style)",
      borderBottomWidth: "2px",
    },
  },
  "border-background": {
    "@layer utilities": {
      borderColor: "var(--background)",
    },
  },
  "border-blue-200": {
    "@layer utilities": {
      borderColor: "var(--color-blue-200)",
    },
  },
  "border-border": {
    "@layer utilities": {
      borderColor: "var(--border)",
    },
  },
  "border-border/50": {
    "@layer utilities": {
      borderColor: "var(--border)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--border) 50%, transparent)",
      },
    },
  },
  "border-dashed": {
    "@layer utilities": {
      "--tw-border-style": "dashed",
      borderStyle: "dashed",
    },
  },
  "border-destructive": {
    "@layer utilities": {
      borderColor: "var(--destructive)",
    },
  },
  "border-destructive/20": {
    "@layer utilities": {
      borderColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--destructive) 20%, transparent)",
      },
    },
  },
  "border-destructive/50": {
    "@layer utilities": {
      borderColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--destructive) 50%, transparent)",
      },
    },
  },
  "border-emerald-200": {
    "@layer utilities": {
      borderColor: "var(--color-emerald-200)",
    },
  },
  "border-gray-300": {
    "@layer utilities": {
      borderColor: "var(--color-gray-300)",
    },
  },
  "border-green-200": {
    "@layer utilities": {
      borderColor: "var(--color-green-200)",
    },
  },
  "border-input": {
    "@layer utilities": {
      borderColor: "var(--input)",
    },
  },
  "border-l": {
    "@layer utilities": {
      borderLeftStyle: "var(--tw-border-style)",
      borderLeftWidth: "1px",
    },
  },
  "border-l-transparent": {
    "@layer utilities": {
      borderLeftColor: "transparent",
    },
  },
  "border-muted": {
    "@layer utilities": {
      borderColor: "var(--muted)",
    },
  },
  "border-muted-foreground/20": {
    "@layer utilities": {
      borderColor: "var(--muted-foreground)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
      },
    },
  },
  "border-none": {
    "@layer utilities": {
      "--tw-border-style": "none",
      borderStyle: "none",
    },
  },
  "border-orange-200": {
    "@layer utilities": {
      borderColor: "var(--color-orange-200)",
    },
  },
  "border-primary": {
    "@layer utilities": {
      borderColor: "var(--primary)",
    },
  },
  "border-primary-foreground/20": {
    "@layer utilities": {
      borderColor: "var(--primary-foreground)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--primary-foreground) 20%, transparent)",
      },
    },
  },
  "border-primary/10": {
    "@layer utilities": {
      borderColor: "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
      },
    },
  },
  "border-primary/20": {
    "@layer utilities": {
      borderColor: "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--primary) 20%, transparent)",
      },
    },
  },
  "border-purple-200": {
    "@layer utilities": {
      borderColor: "var(--color-purple-200)",
    },
  },
  "border-purple-500": {
    "@layer utilities": {
      borderColor: "var(--color-purple-500)",
    },
  },
  "border-r": {
    "@layer utilities": {
      borderRightStyle: "var(--tw-border-style)",
      borderRightWidth: "1px",
    },
  },
  "border-sidebar-border": {
    "@layer utilities": {
      borderColor: "var(--sidebar-border)",
    },
  },
  "border-slate-200": {
    "@layer utilities": {
      borderColor: "var(--color-slate-200)",
    },
  },
  "border-solid": {
    "@layer utilities": {
      "--tw-border-style": "solid",
      borderStyle: "solid",
    },
  },
  "border-t": {
    "@layer utilities": {
      borderTopStyle: "var(--tw-border-style)",
      borderTopWidth: "1px",
    },
  },
  "border-t-transparent": {
    "@layer utilities": {
      borderTopColor: "transparent",
    },
  },
  "border-transparent": {
    "@layer utilities": {
      borderColor: "transparent",
    },
  },
  "bottom-0": {
    "@layer utilities": {
      bottom: "calc(var(--spacing) * 0)",
    },
  },
  "bottom-2": {
    "@layer utilities": {
      bottom: "calc(var(--spacing) * 2)",
    },
  },
  "break-all": {
    "@layer utilities": {
      wordBreak: "break-all",
    },
  },
  "break-words": {
    "@layer utilities": {
      overflowWrap: "break-word",
    },
  },
  capitalize: {
    "@layer utilities": {
      textTransform: "capitalize",
    },
  },
  "col-start-2": {
    "@layer utilities": {
      gridColumnStart: "2",
    },
  },
  container: {
    "@layer utilities": {
      width: "100%",
      "@media (width >= 40rem)": {
        maxWidth: "40rem",
      },
      "@media (width >= 48rem)": {
        maxWidth: "48rem",
      },
      "@media (width >= 64rem)": {
        maxWidth: "64rem",
      },
      "@media (width >= 80rem)": {
        maxWidth: "80rem",
      },
      "@media (width >= 96rem)": {
        maxWidth: "96rem",
      },
    },
  },
  "cursor-default": {
    "@layer utilities": {
      cursor: "default",
    },
  },
  "cursor-not-allowed": {
    "@layer utilities": {
      cursor: "not-allowed",
    },
  },
  "cursor-pointer": {
    "@layer utilities": {
      cursor: "pointer",
    },
  },
  dark: {
    "--background": "oklch(0.1448 0 0)",
    "--foreground": "oklch(0.9851 0 0)",
    "--card": "oklch(0.2134 0 0)",
    "--card-foreground": "oklch(0.9851 0 0)",
    "--popover": "oklch(0.2686 0 0)",
    "--popover-foreground": "oklch(0.9851 0 0)",
    "--primary": "oklch(0.5555 0 0)",
    "--primary-foreground": "oklch(0.9851 0 0)",
    "--secondary": "oklch(0.2686 0 0)",
    "--secondary-foreground": "oklch(0.9851 0 0)",
    "--muted": "oklch(0.2686 0 0)",
    "--muted-foreground": "oklch(0.709 0 0)",
    "--accent": "oklch(0.3715 0 0)",
    "--accent-foreground": "oklch(0.9851 0 0)",
    "--destructive": "oklch(0.7022 0.1892 22.2279)",
    "--destructive-foreground": "oklch(0.2686 0 0)",
    "--border": "oklch(0.3407 0 0)",
    "--input": "oklch(0.4386 0 0)",
    "--ring": "oklch(0.5555 0 0)",
    "--chart-1": "oklch(0.5555 0 0)",
    "--chart-2": "oklch(0.5555 0 0)",
    "--chart-3": "oklch(0.5555 0 0)",
    "--chart-4": "oklch(0.5555 0 0)",
    "--chart-5": "oklch(0.5555 0 0)",
    "--sidebar": "oklch(0.2046 0 0)",
    "--sidebar-foreground": "oklch(0.9851 0 0)",
    "--sidebar-primary": "oklch(0.9851 0 0)",
    "--sidebar-primary-foreground": "oklch(0.2046 0 0)",
    "--sidebar-accent": "oklch(0.2686 0 0)",
    "--sidebar-accent-foreground": "oklch(0.9851 0 0)",
    "--sidebar-border": "oklch(1 0 0)",
    "--sidebar-ring": "oklch(0.4386 0 0)",
    "--font-sans": "Geist Mono, monospace",
    "--font-serif": "Geist Mono, monospace",
    "--font-mono": "Geist Mono, monospace",
    "--radius": "0rem",
    "--shadow-2xs": "0px 1px 0px 0px hsl(0 0% 0% / 0)",
    "--shadow-xs": "0px 1px 0px 0px hsl(0 0% 0% / 0)",
    "--shadow-sm": "0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0)",
    "--shadow": "0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0)",
    "--shadow-md": "0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 2px 4px -1px hsl(0 0% 0% / 0)",
    "--shadow-lg": "0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 4px 6px -1px hsl(0 0% 0% / 0)",
    "--shadow-xl": "0px 1px 0px 0px hsl(0 0% 0% / 0), 0px 8px 10px -1px hsl(0 0% 0% / 0)",
    "--shadow-2xl": "0px 1px 0px 0px hsl(0 0% 0% / 0)",
  },
  "dark:aria-invalid:ring-destructive/40": {
    "@layer utilities": {
      "--tw-ring-color": "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-ring-color": "color-mix(in oklab, var(--destructive) 40%, transparent)",
      },
    },
  },
  "dark:bg-blue-900": {
    "@layer utilities": {
      backgroundColor: "var(--color-blue-900)",
    },
  },
  "dark:bg-blue-900/20": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(37.9% 0.146 265.522) 20%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-blue-900) 20%, transparent)",
      },
    },
  },
  "dark:bg-blue-950/20": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(28.2% 0.091 267.935) 20%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-blue-950) 20%, transparent)",
      },
    },
  },
  "dark:bg-blue-950/80": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(28.2% 0.091 267.935) 80%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-blue-950) 80%, transparent)",
      },
    },
  },
  "dark:bg-destructive/60": {
    "@layer utilities": {
      backgroundColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--destructive) 60%, transparent)",
      },
    },
  },
  "dark:bg-emerald-950/80": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(26.2% 0.051 172.552) 80%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-emerald-950) 80%, transparent)",
      },
    },
  },
  "dark:bg-gray-800": {
    "@layer utilities": {
      backgroundColor: "var(--color-gray-800)",
    },
  },
  "dark:bg-gray-900": {
    "@layer utilities": {
      backgroundColor: "var(--color-gray-900)",
    },
  },
  "dark:bg-gray-900/20": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(21% 0.034 264.665) 20%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-gray-900) 20%, transparent)",
      },
    },
  },
  "dark:bg-input/30": {
    "@layer utilities": {
      backgroundColor: "var(--input)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--input) 30%, transparent)",
      },
    },
  },
  "dark:bg-neutral-800": {
    "@layer utilities": {
      backgroundColor: "var(--color-neutral-800)",
    },
  },
  "dark:bg-orange-950/80": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(26.6% 0.079 36.259) 80%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-orange-950) 80%, transparent)",
      },
    },
  },
  "dark:bg-purple-900": {
    "@layer utilities": {
      backgroundColor: "var(--color-purple-900)",
    },
  },
  "dark:bg-purple-950/20": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(29.1% 0.149 302.717) 20%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-purple-950) 20%, transparent)",
      },
    },
  },
  "dark:bg-purple-950/50": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(29.1% 0.149 302.717) 50%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-purple-950) 50%, transparent)",
      },
    },
  },
  "dark:bg-purple-950/80": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(29.1% 0.149 302.717) 80%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-purple-950) 80%, transparent)",
      },
    },
  },
  "dark:bg-slate-950/80": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(12.9% 0.042 264.695) 80%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-slate-950) 80%, transparent)",
      },
    },
  },
  "dark:bg-yellow-900": {
    "@layer utilities": {
      backgroundColor: "var(--color-yellow-900)",
    },
  },
  "dark:bg-yellow-900/20": {
    "@layer utilities": {
      backgroundColor: "color-mix(in srgb, oklch(42.1% 0.095 57.708) 20%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--color-yellow-900) 20%, transparent)",
      },
    },
  },
  "dark:bg-zinc-100": {
    "@layer utilities": {
      backgroundColor: "var(--color-zinc-100)",
    },
  },
  "dark:border-blue-800": {
    "@layer utilities": {
      borderColor: "var(--color-blue-800)",
    },
  },
  "dark:border-emerald-800": {
    "@layer utilities": {
      borderColor: "var(--color-emerald-800)",
    },
  },
  "dark:border-input": {
    "@layer utilities": {
      borderColor: "var(--input)",
    },
  },
  "dark:border-orange-800": {
    "@layer utilities": {
      borderColor: "var(--color-orange-800)",
    },
  },
  "dark:border-purple-800": {
    "@layer utilities": {
      borderColor: "var(--color-purple-800)",
    },
  },
  "dark:border-slate-800": {
    "@layer utilities": {
      borderColor: "var(--color-slate-800)",
    },
  },
  "dark:data-[state=checked]:bg-primary": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
    },
  },
  "dark:data-[state=checked]:bg-primary-foreground": {
    "@layer utilities": {
      backgroundColor: "var(--primary-foreground)",
    },
  },
  "dark:data-[state=unchecked]:bg-foreground": {
    "@layer utilities": {
      backgroundColor: "var(--foreground)",
    },
  },
  "dark:data-[state=unchecked]:bg-input/80": {
    "@layer utilities": {
      backgroundColor: "var(--input)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--input) 80%, transparent)",
      },
    },
  },
  "dark:data-[variant=destructive]:focus:bg-destructive/20": {
    "@layer utilities": {
      backgroundColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--destructive) 20%, transparent)",
      },
    },
  },
  "dark:focus-visible:ring-destructive/40": {
    "@layer utilities": {
      "--tw-ring-color": "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-ring-color": "color-mix(in oklab, var(--destructive) 40%, transparent)",
      },
    },
  },
  "dark:hover:bg-accent/50": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--accent)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--accent) 50%, transparent)",
        },
      },
    },
  },
  "dark:hover:bg-input/50": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--input)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--input) 50%, transparent)",
        },
      },
    },
  },
  "dark:hover:bg-purple-950/70": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "color-mix(in srgb, oklch(29.1% 0.149 302.717) 70%, transparent)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--color-purple-950) 70%, transparent)",
        },
      },
    },
  },
  "dark:text-blue-200": {
    "@layer utilities": {
      color: "var(--color-blue-200)",
    },
  },
  "dark:text-blue-300": {
    "@layer utilities": {
      color: "var(--color-blue-300)",
    },
  },
  "dark:text-blue-400": {
    "@layer utilities": {
      color: "var(--color-blue-400)",
    },
  },
  "dark:text-emerald-400": {
    "@layer utilities": {
      color: "var(--color-emerald-400)",
    },
  },
  "dark:text-gray-300": {
    "@layer utilities": {
      color: "var(--color-gray-300)",
    },
  },
  "dark:text-orange-400": {
    "@layer utilities": {
      color: "var(--color-orange-400)",
    },
  },
  "dark:text-purple-300": {
    "@layer utilities": {
      color: "var(--color-purple-300)",
    },
  },
  "dark:text-purple-400": {
    "@layer utilities": {
      color: "var(--color-purple-400)",
    },
  },
  "dark:text-slate-400": {
    "@layer utilities": {
      color: "var(--color-slate-400)",
    },
  },
  "dark:text-yellow-200": {
    "@layer utilities": {
      color: "var(--color-yellow-200)",
    },
  },
  "dark:text-yellow-300": {
    "@layer utilities": {
      color: "var(--color-yellow-300)",
    },
  },
  "dark:text-zinc-900": {
    "@layer utilities": {
      color: "var(--color-zinc-900)",
    },
  },
  "data-[active=true]:bg-sidebar-accent": {
    "@layer utilities": {
      backgroundColor: "var(--sidebar-accent)",
    },
  },
  "data-[active=true]:font-medium": {
    "@layer utilities": {
      "--tw-font-weight": "var(--font-weight-medium)",
      fontWeight: "var(--font-weight-medium)",
    },
  },
  "data-[active=true]:text-sidebar-accent-foreground": {
    "@layer utilities": {
      color: "var(--sidebar-accent-foreground)",
    },
  },
  "data-[disabled]:opacity-50": {
    "@layer utilities": {
      opacity: "50%",
    },
  },
  "data-[disabled]:pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "data-[error=true]:text-destructive": {
    "@layer utilities": {
      color: "var(--destructive)",
    },
  },
  "data-[inset]:pl-8": {
    "@layer utilities": {
      paddingLeft: "calc(var(--spacing) * 8)",
    },
  },
  "data-[orientation=horizontal]:h-px": {
    "@layer utilities": {
      height: "1px",
    },
  },
  "data-[orientation=horizontal]:w-full": {
    "@layer utilities": {
      width: "100%",
    },
  },
  "data-[orientation=vertical]:h-full": {
    "@layer utilities": {
      height: "100%",
    },
  },
  "data-[orientation=vertical]:w-px": {
    "@layer utilities": {
      width: "1px",
    },
  },
  "data-[placeholder]:text-muted-foreground": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
    },
  },
  "data-[side=bottom]:slide-in-from-top-2": {
    "@layer utilities": {
      "--tw-enter-translate-y": "calc(2*var(--spacing)*-1)",
    },
  },
  "data-[side=bottom]:translate-y-1": {
    "@layer utilities": {
      "--tw-translate-y": "calc(var(--spacing) * 1)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "data-[side=left]:-translate-x-1": {
    "@layer utilities": {
      "--tw-translate-x": "calc(var(--spacing) * -1)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "data-[side=left]:slide-in-from-right-2": {
    "@layer utilities": {
      "--tw-enter-translate-x": "calc(2*var(--spacing))",
    },
  },
  "data-[side=right]:slide-in-from-left-2": {
    "@layer utilities": {
      "--tw-enter-translate-x": "calc(2*var(--spacing)*-1)",
    },
  },
  "data-[side=right]:translate-x-1": {
    "@layer utilities": {
      "--tw-translate-x": "calc(var(--spacing) * 1)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "data-[side=top]:-translate-y-1": {
    "@layer utilities": {
      "--tw-translate-y": "calc(var(--spacing) * -1)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "data-[side=top]:slide-in-from-bottom-2": {
    "@layer utilities": {
      "--tw-enter-translate-y": "calc(2*var(--spacing))",
    },
  },
  "data-[size=default]:h-9": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 9)",
    },
  },
  "data-[size=sm]:h-8": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 8)",
    },
  },
  "data-[state=checked]:bg-primary": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
    },
  },
  "data-[state=checked]:bg-purple-500": {
    "@layer utilities": {
      backgroundColor: "var(--color-purple-500)",
    },
  },
  "data-[state=checked]:border-primary": {
    "@layer utilities": {
      borderColor: "var(--primary)",
    },
  },
  "data-[state=checked]:text-primary-foreground": {
    "@layer utilities": {
      color: "var(--primary-foreground)",
    },
  },
  "data-[state=checked]:translate-x-[calc(100%-2px)]": {
    "@layer utilities": {
      "--tw-translate-x": "calc(100% - 2px)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "data-[state=closed]:animate-out": {
    "@layer utilities": {
      animation:
        "exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)",
    },
  },
  "data-[state=closed]:duration-300": {
    "@layer utilities": {
      "--tw-duration": "300ms",
      transitionDuration: "300ms",
    },
  },
  "data-[state=closed]:fade-out-0": {
    "@layer utilities": {
      "--tw-exit-opacity": "0",
    },
  },
  "data-[state=closed]:slide-out-to-bottom": {
    "@layer utilities": {
      "--tw-exit-translate-y": "100%",
    },
  },
  "data-[state=closed]:slide-out-to-left": {
    "@layer utilities": {
      "--tw-exit-translate-x": "-100%",
    },
  },
  "data-[state=closed]:slide-out-to-right": {
    "@layer utilities": {
      "--tw-exit-translate-x": "100%",
    },
  },
  "data-[state=closed]:slide-out-to-top": {
    "@layer utilities": {
      "--tw-exit-translate-y": "-100%",
    },
  },
  "data-[state=closed]:zoom-out-95": {
    "@layer utilities": {
      "--tw-exit-scale": ".95",
    },
  },
  "data-[state=open]:animate-in": {
    "@layer utilities": {
      animation:
        "enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)",
    },
  },
  "data-[state=open]:bg-accent": {
    "@layer utilities": {
      backgroundColor: "var(--accent)",
    },
  },
  "data-[state=open]:bg-secondary": {
    "@layer utilities": {
      backgroundColor: "var(--secondary)",
    },
  },
  "data-[state=open]:duration-500": {
    "@layer utilities": {
      "--tw-duration": "500ms",
      transitionDuration: "500ms",
    },
  },
  "data-[state=open]:fade-in-0": {
    "@layer utilities": {
      "--tw-enter-opacity": "0",
    },
  },
  "data-[state=open]:hover:bg-sidebar-accent": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--sidebar-accent)",
      },
    },
  },
  "data-[state=open]:hover:text-sidebar-accent-foreground": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--sidebar-accent-foreground)",
      },
    },
  },
  "data-[state=open]:opacity-100": {
    "@layer utilities": {
      opacity: "100%",
    },
  },
  "data-[state=open]:slide-in-from-bottom": {
    "@layer utilities": {
      "--tw-enter-translate-y": "100%",
    },
  },
  "data-[state=open]:slide-in-from-left": {
    "@layer utilities": {
      "--tw-enter-translate-x": "-100%",
    },
  },
  "data-[state=open]:slide-in-from-right": {
    "@layer utilities": {
      "--tw-enter-translate-x": "100%",
    },
  },
  "data-[state=open]:slide-in-from-top": {
    "@layer utilities": {
      "--tw-enter-translate-y": "-100%",
    },
  },
  "data-[state=open]:text-accent-foreground": {
    "@layer utilities": {
      color: "var(--accent-foreground)",
    },
  },
  "data-[state=open]:text-muted-foreground": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
    },
  },
  "data-[state=open]:zoom-in-95": {
    "@layer utilities": {
      "--tw-enter-scale": ".95",
    },
  },
  "data-[state=unchecked]:bg-input": {
    "@layer utilities": {
      backgroundColor: "var(--input)",
    },
  },
  "data-[state=unchecked]:translate-x-0": {
    "@layer utilities": {
      "--tw-translate-x": "calc(var(--spacing) * 0)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "data-[variant=destructive]:*:[svg]:!text-destructive": {
    "@layer utilities": {
      color: "var(--destructive) !important",
    },
  },
  "data-[variant=destructive]:focus:bg-destructive/10": {
    "@layer utilities": {
      backgroundColor: "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        backgroundColor: "color-mix(in oklab, var(--destructive) 10%, transparent)",
      },
    },
  },
  "data-[variant=destructive]:focus:text-destructive": {
    "@layer utilities": {
      color: "var(--destructive)",
    },
  },
  "data-[variant=destructive]:text-destructive": {
    "@layer utilities": {
      color: "var(--destructive)",
    },
  },
  "disabled:cursor-not-allowed": {
    "@layer utilities": {
      cursor: "not-allowed",
    },
  },
  "disabled:opacity-50": {
    "@layer utilities": {
      opacity: "50%",
    },
  },
  "disabled:opacity-60": {
    "@layer utilities": {
      opacity: "60%",
    },
  },
  "disabled:pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "disabled:transform-none": {
    "@layer utilities": {
      transform: "none",
    },
  },
  "drop-shadow-md": {
    "@layer utilities": {
      "--tw-drop-shadow-size":
        "drop-shadow(0 3px 3px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.12)))",
      "--tw-drop-shadow": "drop-shadow(var(--drop-shadow-md))",
      filter:
        "var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)",
    },
  },
  "duration-100": {
    "@layer utilities": {
      "--tw-duration": "100ms",
      transitionDuration: "100ms",
    },
  },
  "duration-200": {
    "@layer utilities": {
      "--tw-duration": "200ms",
      transitionDuration: "200ms",
    },
  },
  "duration-300": {
    "@layer utilities": {
      "--tw-duration": "300ms",
      transitionDuration: "300ms",
    },
  },
  "ease-in-out": {
    "@layer utilities": {
      "--tw-ease": "var(--ease-in-out)",
      transitionTimingFunction: "var(--ease-in-out)",
    },
  },
  "ease-linear": {
    "@layer utilities": {
      "--tw-ease": "linear",
      transitionTimingFunction: "linear",
    },
  },
  "ease-out": {
    "@layer utilities": {
      "--tw-ease": "var(--ease-out)",
      transitionTimingFunction: "var(--ease-out)",
    },
  },
  end: {
    "@layer utilities": {
      insetInlineEnd: "var(--spacing)",
    },
  },
  "fade-in-0": {
    "@layer utilities": {
      "--tw-enter-opacity": "0",
    },
  },
  "field-sizing-content": {
    "@layer utilities": {
      fieldSizing: "content",
    },
  },
  "file:bg-transparent": {
    "@layer utilities": {
      backgroundColor: "transparent",
    },
  },
  "file:border-0": {
    "@layer utilities": {
      borderStyle: "var(--tw-border-style)",
      borderWidth: "0px",
    },
  },
  "file:font-medium": {
    "@layer utilities": {
      "--tw-font-weight": "var(--font-weight-medium)",
      fontWeight: "var(--font-weight-medium)",
    },
  },
  "file:h-7": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 7)",
    },
  },
  "file:inline-flex": {
    "@layer utilities": {
      display: "inline-flex",
    },
  },
  "file:text-foreground": {
    "@layer utilities": {
      color: "var(--foreground)",
    },
  },
  "file:text-sm": {
    "@layer utilities": {
      fontSize: "var(--text-sm)",
      lineHeight: "var(--tw-leading, var(--text-sm--line-height))",
    },
  },
  "fill-current": {
    "@layer utilities": {
      fill: "currentcolor",
    },
  },
  "fill-primary": {
    "@layer utilities": {
      fill: "var(--primary)",
    },
  },
  "first:mt-4": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 4)",
    },
  },
  fixed: {
    "@layer utilities": {
      position: "fixed",
    },
  },
  flex: {
    "@layer utilities": {
      display: "flex",
    },
  },
  "flex-1": {
    "@layer utilities": {
      flex: "1",
    },
  },
  "flex-auto": {
    "@layer utilities": {
      flex: "auto",
    },
  },
  "flex-col": {
    "@layer utilities": {
      flexDirection: "column",
    },
  },
  "flex-col-reverse": {
    "@layer utilities": {
      flexDirection: "column-reverse",
    },
  },
  "flex-row": {
    "@layer utilities": {
      flexDirection: "row",
    },
  },
  "flex-shrink-0": {
    "@layer utilities": {
      flexShrink: "0",
    },
  },
  "flex-wrap": {
    "@layer utilities": {
      flexWrap: "wrap",
    },
  },
  "focus-visible:border-ring": {
    "@layer utilities": {
      borderColor: "var(--ring)",
    },
  },
  "focus-visible:outline-1": {
    "@layer utilities": {
      outlineStyle: "var(--tw-outline-style)",
      outlineWidth: "1px",
    },
  },
  "focus-visible:ring-[3px]": {
    "@layer utilities": {
      "--tw-ring-shadow":
        "var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "focus-visible:ring-0": {
    "@layer utilities": {
      "--tw-ring-shadow":
        "var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "focus-visible:ring-2": {
    "@layer utilities": {
      "--tw-ring-shadow":
        "var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "focus-visible:ring-destructive/20": {
    "@layer utilities": {
      "--tw-ring-color": "var(--destructive)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-ring-color": "color-mix(in oklab, var(--destructive) 20%, transparent)",
      },
    },
  },
  "focus-visible:ring-ring/50": {
    "@layer utilities": {
      "--tw-ring-color": "var(--ring)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-ring-color": "color-mix(in oklab, var(--ring) 50%, transparent)",
      },
    },
  },
  "focus:bg-accent": {
    "@layer utilities": {
      backgroundColor: "var(--accent)",
    },
  },
  "focus:border-primary/40": {
    "@layer utilities": {
      borderColor: "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        borderColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
      },
    },
  },
  "focus:outline-hidden": {
    "@layer utilities": {
      "--tw-outline-style": "none",
      outlineStyle: "none",
      "@media (forced-colors: active)": {
        outline: "2px solid transparent",
        outlineOffset: "2px",
      },
    },
  },
  "focus:ring-2": {
    "@layer utilities": {
      "--tw-ring-shadow":
        "var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "focus:ring-offset-2": {
    "@layer utilities": {
      "--tw-ring-offset-width": "2px",
      "--tw-ring-offset-shadow":
        "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
    },
  },
  "focus:ring-ring": {
    "@layer utilities": {
      "--tw-ring-color": "var(--ring)",
    },
  },
  "focus:text-accent-foreground": {
    "@layer utilities": {
      color: "var(--accent-foreground)",
    },
  },
  "focus:text-destructive": {
    "@layer utilities": {
      color: "var(--destructive)",
    },
  },
  "font-bold": {
    "@layer utilities": {
      "--tw-font-weight": "var(--font-weight-bold)",
      fontWeight: "var(--font-weight-bold)",
    },
  },
  "font-medium": {
    "@layer utilities": {
      "--tw-font-weight": "var(--font-weight-medium)",
      fontWeight: "var(--font-weight-medium)",
    },
  },
  "font-mono": {
    "@layer utilities": {
      fontFamily: "var(--font-mono)",
    },
  },
  "font-semibold": {
    "@layer utilities": {
      "--tw-font-weight": "var(--font-weight-semibold)",
      fontWeight: "var(--font-weight-semibold)",
    },
  },
  "from-background": {
    "@layer utilities": {
      "--tw-gradient-from": "var(--background)",
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "from-blue-500": {
    "@layer utilities": {
      "--tw-gradient-from": "var(--color-blue-500)",
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "from-primary/5": {
    "@layer utilities": {
      "--tw-gradient-from": "var(--primary)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-gradient-from": "color-mix(in oklab, var(--primary) 5%, transparent)",
      },
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "from-purple-500": {
    "@layer utilities": {
      "--tw-gradient-from": "var(--color-purple-500)",
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "gap-1": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 1)",
    },
  },
  "gap-1.5": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 1.5)",
    },
  },
  "gap-2": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 2)",
    },
  },
  "gap-3": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 3)",
    },
  },
  "gap-4": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 4)",
    },
  },
  "gap-6": {
    "@layer utilities": {
      gap: "calc(var(--spacing) * 6)",
    },
  },
  "gap-x-2": {
    "@layer utilities": {
      columnGap: "calc(var(--spacing) * 2)",
    },
  },
  "gap-x-3": {
    "@layer utilities": {
      columnGap: "calc(var(--spacing) * 3)",
    },
  },
  "gap-x-4": {
    "@layer utilities": {
      columnGap: "calc(var(--spacing) * 4)",
    },
  },
  "gap-y-0.5": {
    "@layer utilities": {
      rowGap: "calc(var(--spacing) * 0.5)",
    },
  },
  "gap-y-1": {
    "@layer utilities": {
      rowGap: "calc(var(--spacing) * 1)",
    },
  },
  "gap-y-2": {
    "@layer utilities": {
      rowGap: "calc(var(--spacing) * 2)",
    },
  },
  grid: {
    "@layer utilities": {
      display: "grid",
    },
  },
  "grid-cols-[0_1fr]": {
    "@layer utilities": {
      gridTemplateColumns: "0 1fr",
    },
  },
  "grid-cols-1": {
    "@layer utilities": {
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    },
  },
  "grid-cols-2": {
    "@layer utilities": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  "grid-rows-[auto_auto]": {
    "@layer utilities": {
      gridTemplateRows: "auto auto",
    },
  },
  "group-data-[collapsible=icon]:-mt-8": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * -8)",
    },
  },
  "group-data-[collapsible=icon]:hidden": {
    "@layer utilities": {
      display: "none",
    },
  },
  "group-data-[collapsible=icon]:opacity-0": {
    "@layer utilities": {
      opacity: "0%",
    },
  },
  "group-data-[collapsible=icon]:overflow-hidden": {
    "@layer utilities": {
      overflow: "hidden",
    },
  },
  "group-data-[collapsible=icon]:p-0!": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 0) !important",
    },
  },
  "group-data-[collapsible=icon]:p-2!": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 2) !important",
    },
  },
  "group-data-[collapsible=icon]:size-8!": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 8) !important",
      height: "calc(var(--spacing) * 8) !important",
    },
  },
  "group-data-[collapsible=icon]:w-(--sidebar-width-icon)": {
    "@layer utilities": {
      width: "var(--sidebar-width-icon)",
    },
  },
  "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]": {
    "@layer utilities": {
      width: "calc(var(--sidebar-width-icon) + (calc(var(--spacing) * 4)))",
    },
  },
  "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]": {
    "@layer utilities": {
      width: "calc(var(--sidebar-width-icon) + (calc(var(--spacing) * 4)) + 2px)",
    },
  },
  "group-data-[collapsible=offcanvas]:after:left-full": {
    "@layer utilities": {
      content: "var(--tw-content)",
      left: "100%",
    },
  },
  "group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]": {
    "@layer utilities": {
      left: "calc(var(--sidebar-width) * -1)",
    },
  },
  "group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]": {
    "@layer utilities": {
      right: "calc(var(--sidebar-width) * -1)",
    },
  },
  "group-data-[collapsible=offcanvas]:translate-x-0": {
    "@layer utilities": {
      "--tw-translate-x": "calc(var(--spacing) * 0)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "group-data-[collapsible=offcanvas]:w-0": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 0)",
    },
  },
  "group-data-[disabled=true]:opacity-50": {
    "@layer utilities": {
      opacity: "50%",
    },
  },
  "group-data-[disabled=true]:pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "group-data-[side=left]:-right-4": {
    "@layer utilities": {
      right: "calc(var(--spacing) * -4)",
    },
  },
  "group-data-[side=left]:border-r": {
    "@layer utilities": {
      borderRightStyle: "var(--tw-border-style)",
      borderRightWidth: "1px",
    },
  },
  "group-data-[side=right]:border-l": {
    "@layer utilities": {
      borderLeftStyle: "var(--tw-border-style)",
      borderLeftWidth: "1px",
    },
  },
  "group-data-[side=right]:left-0": {
    "@layer utilities": {
      left: "calc(var(--spacing) * 0)",
    },
  },
  "group-data-[side=right]:rotate-180": {
    "@layer utilities": {
      rotate: "180deg",
    },
  },
  "group-data-[variant=floating]:border": {
    "@layer utilities": {
      borderStyle: "var(--tw-border-style)",
      borderWidth: "1px",
    },
  },
  "group-data-[variant=floating]:border-sidebar-border": {
    "@layer utilities": {
      borderColor: "var(--sidebar-border)",
    },
  },
  "group-data-[variant=floating]:rounded-lg": {
    "@layer utilities": {
      borderRadius: "var(--radius)",
    },
  },
  "group-data-[variant=floating]:shadow-sm": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-sm)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "group-focus-within/menu-item:opacity-100": {
    "@layer utilities": {
      opacity: "100%",
    },
  },
  "group-has-data-[sidebar=menu-action]/menu-item:pr-8": {
    "@layer utilities": {
      paddingRight: "calc(var(--spacing) * 8)",
    },
  },
  "group-hover/menu-item:opacity-100": {
    "@layer utilities": {
      "@media (hover: hover)": {
        opacity: "100%",
      },
    },
  },
  grow: {
    "@layer utilities": {
      flexGrow: "1",
    },
  },
  "h-[1.15rem]": {
    "@layer utilities": {
      height: "1.15rem",
    },
  },
  "h-[calc(100vh-73px)]": {
    "@layer utilities": {
      height: "calc(100vh - 73px)",
    },
  },
  "h-[var(--radix-select-trigger-height)]": {
    "@layer utilities": {
      height: "var(--radix-select-trigger-height)",
    },
  },
  "h-1.5": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 1.5)",
    },
  },
  "h-10": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 10)",
    },
  },
  "h-12": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 12)",
    },
  },
  "h-16": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 16)",
    },
  },
  "h-2": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 2)",
    },
  },
  "h-2.5": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 2.5)",
    },
  },
  "h-3": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 3)",
    },
  },
  "h-4": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 4)",
    },
  },
  "h-5": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 5)",
    },
  },
  "h-6": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 6)",
    },
  },
  "h-7": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 7)",
    },
  },
  "h-8": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 8)",
    },
  },
  "h-9": {
    "@layer utilities": {
      height: "calc(var(--spacing) * 9)",
    },
  },
  "h-auto": {
    "@layer utilities": {
      height: "auto",
    },
  },
  "h-full": {
    "@layer utilities": {
      height: "100%",
    },
  },
  "h-px": {
    "@layer utilities": {
      height: "1px",
    },
  },
  "h-screen": {
    "@layer utilities": {
      height: "100vh",
    },
  },
  "h-svh": {
    "@layer utilities": {
      height: "100svh",
    },
  },
  "has-[>svg]:gap-x-3": {
    "@layer utilities": {
      columnGap: "calc(var(--spacing) * 3)",
    },
  },
  "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]": {
    "@layer utilities": {
      gridTemplateColumns: "calc(var(--spacing) * 4) 1fr",
    },
  },
  "has-[>svg]:px-2.5": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 2.5)",
    },
  },
  "has-[>svg]:px-3": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 3)",
    },
  },
  "has-[>svg]:px-4": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 4)",
    },
  },
  "has-data-[slot=card-action]:grid-cols-[1fr_auto]": {
    "@layer utilities": {
      gridTemplateColumns: "1fr auto",
    },
  },
  "has-data-[variant=inset]:bg-sidebar": {
    "@layer utilities": {
      backgroundColor: "var(--sidebar)",
    },
  },
  hidden: {
    "@layer utilities": {
      display: "none",
    },
  },
  "hover:after:bg-sidebar-border": {
    "@layer utilities": {
      "@media (hover: hover)": {
        content: "var(--tw-content)",
        backgroundColor: "var(--sidebar-border)",
      },
    },
  },
  "hover:bg-accent": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--accent)",
      },
    },
  },
  "hover:bg-background": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--background)",
      },
    },
  },
  "hover:bg-background/20": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--background)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--background) 20%, transparent)",
        },
      },
    },
  },
  "hover:bg-background/70": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--background)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--background) 70%, transparent)",
        },
      },
    },
  },
  "hover:bg-destructive/90": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--destructive)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--destructive) 90%, transparent)",
        },
      },
    },
  },
  "hover:bg-muted": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--muted)",
      },
    },
  },
  "hover:bg-muted/50": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--muted)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--muted) 50%, transparent)",
        },
      },
    },
  },
  "hover:bg-primary/80": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--primary)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--primary) 80%, transparent)",
        },
      },
    },
  },
  "hover:bg-primary/90": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--primary)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--primary) 90%, transparent)",
        },
      },
    },
  },
  "hover:bg-purple-100": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--color-purple-100)",
      },
    },
  },
  "hover:bg-red-600": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--color-red-600)",
      },
    },
  },
  "hover:bg-secondary/80": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--secondary)",
        "@supports (color: color-mix(in lab, red, red))": {
          backgroundColor: "color-mix(in oklab, var(--secondary) 80%, transparent)",
        },
      },
    },
  },
  "hover:bg-sidebar-accent": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--sidebar-accent)",
      },
    },
  },
  "hover:bg-transparent": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "transparent",
      },
    },
  },
  "hover:border-primary/30": {
    "@layer utilities": {
      "@media (hover: hover)": {
        borderColor: "var(--primary)",
        "@supports (color: color-mix(in lab, red, red))": {
          borderColor: "color-mix(in oklab, var(--primary) 30%, transparent)",
        },
      },
    },
  },
  "hover:border-purple-300": {
    "@layer utilities": {
      "@media (hover: hover)": {
        borderColor: "var(--color-purple-300)",
      },
    },
  },
  "hover:from-blue-600": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-gradient-from": "var(--color-blue-600)",
        "--tw-gradient-stops":
          "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
      },
    },
  },
  "hover:from-purple-600": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-gradient-from": "var(--color-purple-600)",
        "--tw-gradient-stops":
          "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
      },
    },
  },
  "hover:group-data-[collapsible=offcanvas]:bg-sidebar": {
    "@layer utilities": {
      "@media (hover: hover)": {
        backgroundColor: "var(--sidebar)",
      },
    },
  },
  "hover:opacity-100": {
    "@layer utilities": {
      "@media (hover: hover)": {
        opacity: "100%",
      },
    },
  },
  "hover:scale-[1.02]": {
    "@layer utilities": {
      "@media (hover: hover)": {
        scale: "1.02",
      },
    },
  },
  "hover:scale-105": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-scale-x": "105%",
        "--tw-scale-y": "105%",
        "--tw-scale-z": "105%",
        scale: "var(--tw-scale-x) var(--tw-scale-y)",
      },
    },
  },
  "hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-shadow": "0 0 0 1px var(--tw-shadow-color, hsl(var(--sidebar-accent)))",
        boxShadow:
          "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
      },
    },
  },
  "hover:shadow-xl": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-shadow": "var(--shadow-xl)",
        boxShadow:
          "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
      },
    },
  },
  "hover:text-accent-foreground": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--accent-foreground)",
      },
    },
  },
  "hover:text-foreground": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--foreground)",
      },
    },
  },
  "hover:text-primary/80": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--primary)",
        "@supports (color: color-mix(in lab, red, red))": {
          color: "color-mix(in oklab, var(--primary) 80%, transparent)",
        },
      },
    },
  },
  "hover:text-rose-700": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--color-rose-700)",
      },
    },
  },
  "hover:text-sidebar-accent-foreground": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--sidebar-accent-foreground)",
      },
    },
  },
  "hover:to-pink-600": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-gradient-to": "var(--color-pink-600)",
        "--tw-gradient-stops":
          "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
      },
    },
  },
  "hover:to-purple-700": {
    "@layer utilities": {
      "@media (hover: hover)": {
        "--tw-gradient-to": "var(--color-purple-700)",
        "--tw-gradient-stops":
          "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
      },
    },
  },
  "hover:underline": {
    "@layer utilities": {
      "@media (hover: hover)": {
        textDecorationLine: "underline",
      },
    },
  },
  "in-data-[side=left]:cursor-w-resize": {
    "@layer utilities": {
      cursor: "w-resize",
    },
  },
  "in-data-[side=right]:cursor-e-resize": {
    "@layer utilities": {
      cursor: "e-resize",
    },
  },
  "inline-block": {
    "@layer utilities": {
      display: "inline-block",
    },
  },
  "inline-flex": {
    "@layer utilities": {
      display: "inline-flex",
    },
  },
  "inset-0": {
    "@layer utilities": {
      inset: "calc(var(--spacing) * 0)",
    },
  },
  "inset-x-0": {
    "@layer utilities": {
      insetInline: "calc(var(--spacing) * 0)",
    },
  },
  "inset-y-0": {
    "@layer utilities": {
      insetBlock: "calc(var(--spacing) * 0)",
    },
  },
  "items-center": {
    "@layer utilities": {
      alignItems: "center",
    },
  },
  "items-start": {
    "@layer utilities": {
      alignItems: "flex-start",
    },
  },
  "items-stretch": {
    "@layer utilities": {
      alignItems: "stretch",
    },
  },
  "justify-between": {
    "@layer utilities": {
      justifyContent: "space-between",
    },
  },
  "justify-center": {
    "@layer utilities": {
      justifyContent: "center",
    },
  },
  "justify-end": {
    "@layer utilities": {
      justifyContent: "flex-end",
    },
  },
  "justify-items-start": {
    "@layer utilities": {
      justifyItems: "start",
    },
  },
  "justify-self-end": {
    "@layer utilities": {
      justifySelf: "flex-end",
    },
  },
  "justify-start": {
    "@layer utilities": {
      justifyContent: "flex-start",
    },
  },
  "last:mb-4": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 4)",
    },
  },
  "leading-none": {
    "@layer utilities": {
      "--tw-leading": "1",
      lineHeight: "1",
    },
  },
  "leading-relaxed": {
    "@layer utilities": {
      "--tw-leading": "var(--leading-relaxed)",
      lineHeight: "var(--leading-relaxed)",
    },
  },
  "leading-tight": {
    "@layer utilities": {
      "--tw-leading": "var(--leading-tight)",
      lineHeight: "var(--leading-tight)",
    },
  },
  "left-[50%]": {
    "@layer utilities": {
      left: "50%",
    },
  },
  "left-0": {
    "@layer utilities": {
      left: "calc(var(--spacing) * 0)",
    },
  },
  "left-2": {
    "@layer utilities": {
      left: "calc(var(--spacing) * 2)",
    },
  },
  "left-4": {
    "@layer utilities": {
      left: "calc(var(--spacing) * 4)",
    },
  },
  "lg:grid-cols-2": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      },
    },
  },
  "lg:grid-cols-3": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      },
    },
  },
  "lg:grid-cols-6": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
      },
    },
  },
  "lg:grid-rows-2": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        gridTemplateRows: "repeat(2, minmax(0, 1fr))",
      },
    },
  },
  "lg:p-8": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        padding: "calc(var(--spacing) * 8)",
      },
    },
  },
  "lg:pb-32": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        paddingBottom: "calc(var(--spacing) * 32)",
      },
    },
  },
  "lg:pt-32": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        paddingTop: "calc(var(--spacing) * 32)",
      },
    },
  },
  "lg:px-6": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        paddingInline: "calc(var(--spacing) * 6)",
      },
    },
  },
  "lg:px-8": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        paddingInline: "calc(var(--spacing) * 8)",
      },
    },
  },
  "lg:py-20": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        paddingBlock: "calc(var(--spacing) * 20)",
      },
    },
  },
  "lg:text-2xl": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        fontSize: "var(--text-2xl)",
        lineHeight: "var(--tw-leading, var(--text-2xl--line-height))",
      },
    },
  },
  "lg:text-4xl": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        fontSize: "var(--text-4xl)",
        lineHeight: "var(--tw-leading, var(--text-4xl--line-height))",
      },
    },
  },
  "lg:text-base": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        fontSize: "var(--text-base)",
        lineHeight: "var(--tw-leading, var(--text-base--line-height))",
      },
    },
  },
  "lg:text-xl": {
    "@layer utilities": {
      "@media (width >= 64rem)": {
        fontSize: "var(--text-xl)",
        lineHeight: "var(--tw-leading, var(--text-xl--line-height))",
      },
    },
  },
  "line-clamp-1": {
    "@layer utilities": {
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: "1",
    },
  },
  "line-clamp-2": {
    "@layer utilities": {
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: "2",
    },
  },
  "list-disc": {
    "@layer utilities": {
      listStyleType: "disc",
    },
  },
  "m-2": {
    "@layer utilities": {
      margin: "calc(var(--spacing) * 2)",
    },
  },
  "max-h-(--radix-dropdown-menu-content-available-height)": {
    "@layer utilities": {
      maxHeight: "var(--radix-dropdown-menu-content-available-height)",
    },
  },
  "max-h-(--radix-select-content-available-height)": {
    "@layer utilities": {
      maxHeight: "var(--radix-select-content-available-height)",
    },
  },
  "max-h-[70vh]": {
    "@layer utilities": {
      maxHeight: "70vh",
    },
  },
  "max-h-[90vh]": {
    "@layer utilities": {
      maxHeight: "90vh",
    },
  },
  "max-h-20": {
    "@layer utilities": {
      maxHeight: "calc(var(--spacing) * 20)",
    },
  },
  "max-h-24": {
    "@layer utilities": {
      maxHeight: "calc(var(--spacing) * 24)",
    },
  },
  "max-h-32": {
    "@layer utilities": {
      maxHeight: "calc(var(--spacing) * 32)",
    },
  },
  "max-h-full": {
    "@layer utilities": {
      maxHeight: "100%",
    },
  },
  "max-w-(--skeleton-width)": {
    "@layer utilities": {
      maxWidth: "var(--skeleton-width)",
    },
  },
  "max-w-[120px]": {
    "@layer utilities": {
      maxWidth: "120px",
    },
  },
  "max-w-[140px]": {
    "@layer utilities": {
      maxWidth: "140px",
    },
  },
  "max-w-[320px]": {
    "@layer utilities": {
      maxWidth: "320px",
    },
  },
  "max-w-[425px]": {
    "@layer utilities": {
      maxWidth: "425px",
    },
  },
  "max-w-[85%]": {
    "@layer utilities": {
      maxWidth: "85%",
    },
  },
  "max-w-[calc(100%-2rem)]": {
    "@layer utilities": {
      maxWidth: "calc(100% - 2rem)",
    },
  },
  "max-w-2xl": {
    "@layer utilities": {
      maxWidth: "var(--container-2xl)",
    },
  },
  "max-w-4xl": {
    "@layer utilities": {
      maxWidth: "var(--container-4xl)",
    },
  },
  "max-w-5xl": {
    "@layer utilities": {
      maxWidth: "var(--container-5xl)",
    },
  },
  "max-w-full": {
    "@layer utilities": {
      maxWidth: "100%",
    },
  },
  "max-w-md": {
    "@layer utilities": {
      maxWidth: "var(--container-md)",
    },
  },
  "max-w-none": {
    "@layer utilities": {
      maxWidth: "none",
    },
  },
  "max-w-sm": {
    "@layer utilities": {
      maxWidth: "var(--container-sm)",
    },
  },
  "mb-1": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 1)",
    },
  },
  "mb-2": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 2)",
    },
  },
  "mb-3": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 3)",
    },
  },
  "mb-4": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 4)",
    },
  },
  "mb-6": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 6)",
    },
  },
  "mb-8": {
    "@layer utilities": {
      marginBottom: "calc(var(--spacing) * 8)",
    },
  },
  "md:after:hidden": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        content: "var(--tw-content)",
        display: "none",
      },
    },
  },
  "md:block": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        display: "block",
      },
    },
  },
  "md:flex": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        display: "flex",
      },
    },
  },
  "md:grid-cols-1": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      },
    },
  },
  "md:grid-cols-2": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      },
    },
  },
  "md:max-w-[70%]": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        maxWidth: "70%",
      },
    },
  },
  "md:opacity-0": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        opacity: "0%",
      },
    },
  },
  "md:p-10": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        padding: "calc(var(--spacing) * 10)",
      },
    },
  },
  "md:peer-data-[variant=inset]:m-2": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        margin: "calc(var(--spacing) * 2)",
      },
    },
  },
  "md:peer-data-[variant=inset]:ml-0": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        marginLeft: "calc(var(--spacing) * 0)",
      },
    },
  },
  "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        marginLeft: "calc(var(--spacing) * 2)",
      },
    },
  },
  "md:peer-data-[variant=inset]:rounded-xl": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        borderRadius: "calc(var(--radius) + 4px)",
      },
    },
  },
  "md:peer-data-[variant=inset]:shadow-sm": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        "--tw-shadow": "var(--shadow-sm)",
        boxShadow:
          "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
      },
    },
  },
  "md:text-base": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        fontSize: "var(--text-base)",
        lineHeight: "var(--tw-leading, var(--text-base--line-height))",
      },
    },
  },
  "md:text-sm": {
    "@layer utilities": {
      "@media (width >= 48rem)": {
        fontSize: "var(--text-sm)",
        lineHeight: "var(--tw-leading, var(--text-sm--line-height))",
      },
    },
  },
  "min-h-[100px]": {
    "@layer utilities": {
      minHeight: "100px",
    },
  },
  "min-h-[2.5rem]": {
    "@layer utilities": {
      minHeight: "2.5rem",
    },
  },
  "min-h-[36px]": {
    "@layer utilities": {
      minHeight: "36px",
    },
  },
  "min-h-[3rem]": {
    "@layer utilities": {
      minHeight: "3rem",
    },
  },
  "min-h-[40px]": {
    "@layer utilities": {
      minHeight: "40px",
    },
  },
  "min-h-[44px]": {
    "@layer utilities": {
      minHeight: "44px",
    },
  },
  "min-h-0": {
    "@layer utilities": {
      minHeight: "calc(var(--spacing) * 0)",
    },
  },
  "min-h-16": {
    "@layer utilities": {
      minHeight: "calc(var(--spacing) * 16)",
    },
  },
  "min-h-4": {
    "@layer utilities": {
      minHeight: "calc(var(--spacing) * 4)",
    },
  },
  "min-h-full": {
    "@layer utilities": {
      minHeight: "100%",
    },
  },
  "min-h-screen": {
    "@layer utilities": {
      minHeight: "100vh",
    },
  },
  "min-h-svh": {
    "@layer utilities": {
      minHeight: "100svh",
    },
  },
  "min-w-[40px]": {
    "@layer utilities": {
      minWidth: "40px",
    },
  },
  "min-w-[44px]": {
    "@layer utilities": {
      minWidth: "44px",
    },
  },
  "min-w-[8rem]": {
    "@layer utilities": {
      minWidth: "8rem",
    },
  },
  "min-w-[var(--radix-select-trigger-width)]": {
    "@layer utilities": {
      minWidth: "var(--radix-select-trigger-width)",
    },
  },
  "min-w-0": {
    "@layer utilities": {
      minWidth: "calc(var(--spacing) * 0)",
    },
  },
  "min-w-5": {
    "@layer utilities": {
      minWidth: "calc(var(--spacing) * 5)",
    },
  },
  "ml-0": {
    "@layer utilities": {
      marginLeft: "calc(var(--spacing) * 0)",
    },
  },
  "ml-1": {
    "@layer utilities": {
      marginLeft: "calc(var(--spacing) * 1)",
    },
  },
  "ml-1.5": {
    "@layer utilities": {
      marginLeft: "calc(var(--spacing) * 1.5)",
    },
  },
  "ml-2": {
    "@layer utilities": {
      marginLeft: "calc(var(--spacing) * 2)",
    },
  },
  "ml-4": {
    "@layer utilities": {
      marginLeft: "calc(var(--spacing) * 4)",
    },
  },
  "ml-auto": {
    "@layer utilities": {
      marginLeft: "auto",
    },
  },
  "mr-1": {
    "@layer utilities": {
      marginRight: "calc(var(--spacing) * 1)",
    },
  },
  "mr-1.5": {
    "@layer utilities": {
      marginRight: "calc(var(--spacing) * 1.5)",
    },
  },
  "mr-2": {
    "@layer utilities": {
      marginRight: "calc(var(--spacing) * 2)",
    },
  },
  "mr-4": {
    "@layer utilities": {
      marginRight: "calc(var(--spacing) * 4)",
    },
  },
  "mt-0.5": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 0.5)",
    },
  },
  "mt-1": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 1)",
    },
  },
  "mt-1.5": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 1.5)",
    },
  },
  "mt-2": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 2)",
    },
  },
  "mt-3": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 3)",
    },
  },
  "mt-4": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 4)",
    },
  },
  "mt-6": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 6)",
    },
  },
  "mt-8": {
    "@layer utilities": {
      marginTop: "calc(var(--spacing) * 8)",
    },
  },
  "mt-auto": {
    "@layer utilities": {
      marginTop: "auto",
    },
  },
  "mx-1": {
    "@layer utilities": {
      marginInline: "calc(var(--spacing) * 1)",
    },
  },
  "mx-2": {
    "@layer utilities": {
      marginInline: "calc(var(--spacing) * 2)",
    },
  },
  "mx-3.5": {
    "@layer utilities": {
      marginInline: "calc(var(--spacing) * 3.5)",
    },
  },
  "mx-4": {
    "@layer utilities": {
      marginInline: "calc(var(--spacing) * 4)",
    },
  },
  "mx-auto": {
    "@layer utilities": {
      marginInline: "auto",
    },
  },
  "my-1": {
    "@layer utilities": {
      marginBlock: "calc(var(--spacing) * 1)",
    },
  },
  "object-contain": {
    "@layer utilities": {
      objectFit: "contain",
    },
  },
  "object-cover": {
    "@layer utilities": {
      objectFit: "cover",
    },
  },
  "opacity-100": {
    "@layer utilities": {
      opacity: "100%",
    },
  },
  "opacity-50": {
    "@layer utilities": {
      opacity: "50%",
    },
  },
  "opacity-60": {
    "@layer utilities": {
      opacity: "60%",
    },
  },
  "opacity-70": {
    "@layer utilities": {
      opacity: "70%",
    },
  },
  "origin-(--radix-dropdown-menu-content-transform-origin)": {
    "@layer utilities": {
      transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
    },
  },
  "origin-(--radix-select-content-transform-origin)": {
    "@layer utilities": {
      transformOrigin: "var(--radix-select-content-transform-origin)",
    },
  },
  "origin-(--radix-tooltip-content-transform-origin)": {
    "@layer utilities": {
      transformOrigin: "var(--radix-tooltip-content-transform-origin)",
    },
  },
  outline: {
    "@layer utilities": {
      outlineStyle: "var(--tw-outline-style)",
      outlineWidth: "1px",
    },
  },
  "outline-hidden": {
    "@layer utilities": {
      "--tw-outline-style": "none",
      outlineStyle: "none",
      "@media (forced-colors: active)": {
        outline: "2px solid transparent",
        outlineOffset: "2px",
      },
    },
  },
  "outline-none": {
    "@layer utilities": {
      "--tw-outline-style": "none",
      outlineStyle: "none",
    },
  },
  "overflow-auto": {
    "@layer utilities": {
      overflow: "auto",
    },
  },
  "overflow-hidden": {
    "@layer utilities": {
      overflow: "hidden",
    },
  },
  "overflow-x-hidden": {
    "@layer utilities": {
      overflowX: "hidden",
    },
  },
  "overflow-y-auto": {
    "@layer utilities": {
      overflowY: "auto",
    },
  },
  "p-0": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 0)",
    },
  },
  "p-0.5": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 0.5)",
    },
  },
  "p-1": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 1)",
    },
  },
  "p-1.5": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 1.5)",
    },
  },
  "p-2": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 2)",
    },
  },
  "p-3": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 3)",
    },
  },
  "p-4": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 4)",
    },
  },
  "p-6": {
    "@layer utilities": {
      padding: "calc(var(--spacing) * 6)",
    },
  },
  "p-px": {
    "@layer utilities": {
      padding: "1px",
    },
  },
  "pb-2": {
    "@layer utilities": {
      paddingBottom: "calc(var(--spacing) * 2)",
    },
  },
  "pb-3": {
    "@layer utilities": {
      paddingBottom: "calc(var(--spacing) * 3)",
    },
  },
  "pb-4": {
    "@layer utilities": {
      paddingBottom: "calc(var(--spacing) * 4)",
    },
  },
  "pb-8": {
    "@layer utilities": {
      paddingBottom: "calc(var(--spacing) * 8)",
    },
  },
  "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground": {
    "@layer utilities": {
      color: "var(--sidebar-accent-foreground)",
    },
  },
  "peer-data-[size=default]/menu-button:top-1.5": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 1.5)",
    },
  },
  "peer-data-[size=lg]/menu-button:top-2.5": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 2.5)",
    },
  },
  "peer-data-[size=sm]/menu-button:top-1": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 1)",
    },
  },
  "peer-disabled:cursor-not-allowed": {
    "@layer utilities": {
      cursor: "not-allowed",
    },
  },
  "peer-disabled:opacity-50": {
    "@layer utilities": {
      opacity: "50%",
    },
  },
  "peer-hover/menu-button:text-sidebar-accent-foreground": {
    "@layer utilities": {
      "@media (hover: hover)": {
        color: "var(--sidebar-accent-foreground)",
      },
    },
  },
  "pl-2": {
    "@layer utilities": {
      paddingLeft: "calc(var(--spacing) * 2)",
    },
  },
  "pl-8": {
    "@layer utilities": {
      paddingLeft: "calc(var(--spacing) * 8)",
    },
  },
  "placeholder:text-muted-foreground": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
    },
  },
  "pointer-events-none": {
    "@layer utilities": {
      pointerEvents: "none",
    },
  },
  "pr-10": {
    "@layer utilities": {
      paddingRight: "calc(var(--spacing) * 10)",
    },
  },
  "pr-12": {
    "@layer utilities": {
      paddingRight: "calc(var(--spacing) * 12)",
    },
  },
  "pr-2": {
    "@layer utilities": {
      paddingRight: "calc(var(--spacing) * 2)",
    },
  },
  "pr-4": {
    "@layer utilities": {
      paddingRight: "calc(var(--spacing) * 4)",
    },
  },
  "pr-8": {
    "@layer utilities": {
      paddingRight: "calc(var(--spacing) * 8)",
    },
  },
  "pt-0": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 0)",
    },
  },
  "pt-1": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 1)",
    },
  },
  "pt-2": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 2)",
    },
  },
  "pt-20": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 20)",
    },
  },
  "pt-3": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 3)",
    },
  },
  "pt-4": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 4)",
    },
  },
  "pt-6": {
    "@layer utilities": {
      paddingTop: "calc(var(--spacing) * 6)",
    },
  },
  "px-1": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 1)",
    },
  },
  "px-1.5": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 1.5)",
    },
  },
  "px-2": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 2)",
    },
  },
  "px-2.5": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 2.5)",
    },
  },
  "px-3": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 3)",
    },
  },
  "px-4": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 4)",
    },
  },
  "px-6": {
    "@layer utilities": {
      paddingInline: "calc(var(--spacing) * 6)",
    },
  },
  "py-0.5": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 0.5)",
    },
  },
  "py-1": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 1)",
    },
  },
  "py-1.5": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 1.5)",
    },
  },
  "py-12": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 12)",
    },
  },
  "py-16": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 16)",
    },
  },
  "py-2": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 2)",
    },
  },
  "py-3": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 3)",
    },
  },
  "py-4": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 4)",
    },
  },
  "py-6": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 6)",
    },
  },
  "py-8": {
    "@layer utilities": {
      paddingBlock: "calc(var(--spacing) * 8)",
    },
  },
  relative: {
    "@layer utilities": {
      position: "relative",
    },
  },
  "resize-none": {
    "@layer utilities": {
      resize: "none",
    },
  },
  "right-0": {
    "@layer utilities": {
      right: "calc(var(--spacing) * 0)",
    },
  },
  "right-1": {
    "@layer utilities": {
      right: "calc(var(--spacing) * 1)",
    },
  },
  "right-2": {
    "@layer utilities": {
      right: "calc(var(--spacing) * 2)",
    },
  },
  "right-3": {
    "@layer utilities": {
      right: "calc(var(--spacing) * 3)",
    },
  },
  "right-4": {
    "@layer utilities": {
      right: "calc(var(--spacing) * 4)",
    },
  },
  "ring-0": {
    "@layer utilities": {
      "--tw-ring-shadow":
        "var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "ring-offset-background": {
    "@layer utilities": {
      "--tw-ring-offset-color": "var(--background)",
    },
  },
  "ring-sidebar-ring": {
    "@layer utilities": {
      "--tw-ring-color": "var(--sidebar-ring)",
    },
  },
  "rotate-180": {
    "@layer utilities": {
      rotate: "180deg",
    },
  },
  "rotate-45": {
    "@layer utilities": {
      rotate: "45deg",
    },
  },
  rounded: {
    "@layer utilities": {
      borderRadius: "0.25rem",
    },
  },
  "rounded-[2px]": {
    "@layer utilities": {
      borderRadius: "2px",
    },
  },
  "rounded-[4px]": {
    "@layer utilities": {
      borderRadius: "4px",
    },
  },
  "rounded-[inherit]": {
    "@layer utilities": {
      borderRadius: "inherit",
    },
  },
  "rounded-full": {
    "@layer utilities": {
      borderRadius: "calc(infinity * 1px)",
    },
  },
  "rounded-lg": {
    "@layer utilities": {
      borderRadius: "var(--radius)",
    },
  },
  "rounded-md": {
    "@layer utilities": {
      borderRadius: "calc(var(--radius) - 2px)",
    },
  },
  "rounded-none": {
    "@layer utilities": {
      borderRadius: "0",
    },
  },
  "rounded-sm": {
    "@layer utilities": {
      borderRadius: "calc(var(--radius) - 4px)",
    },
  },
  "rounded-t-lg": {
    "@layer utilities": {
      borderTopLeftRadius: "var(--radius)",
      borderTopRightRadius: "var(--radius)",
    },
  },
  "rounded-xs": {
    "@layer utilities": {
      borderRadius: "var(--radius-xs)",
    },
  },
  "row-span-2": {
    "@layer utilities": {
      gridRow: "span 2 / span 2",
    },
  },
  "row-start-1": {
    "@layer utilities": {
      gridRowStart: "1",
    },
  },
  "scale-100": {
    "@layer utilities": {
      "--tw-scale-x": "100%",
      "--tw-scale-y": "100%",
      "--tw-scale-z": "100%",
      scale: "var(--tw-scale-x) var(--tw-scale-y)",
    },
  },
  "scale-95": {
    "@layer utilities": {
      "--tw-scale-x": "95%",
      "--tw-scale-y": "95%",
      "--tw-scale-z": "95%",
      scale: "var(--tw-scale-x) var(--tw-scale-y)",
    },
  },
  "scroll-my-1": {
    "@layer utilities": {
      scrollMarginBlock: "calc(var(--spacing) * 1)",
    },
  },
  "select-none": {
    "@layer utilities": {
      WebkitUserSelect: "none",
      userSelect: "none",
    },
  },
  "selection:bg-primary": {
    "@layer utilities": {
      backgroundColor: "var(--primary)",
    },
  },
  "selection:text-primary-foreground": {
    "@layer utilities": {
      color: "var(--primary-foreground)",
    },
  },
  "self-start": {
    "@layer utilities": {
      alignSelf: "flex-start",
    },
  },
  "shadow-[0_0_0_1px_hsl(var(--sidebar-border))]": {
    "@layer utilities": {
      "--tw-shadow": "0 0 0 1px var(--tw-shadow-color, hsl(var(--sidebar-border)))",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-2xl": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-2xl)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-lg": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-lg)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-md": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-md)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-none": {
    "@layer utilities": {
      "--tw-shadow": "0 0 #0000",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-sm": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-sm)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-xl": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-xl)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  "shadow-xs": {
    "@layer utilities": {
      "--tw-shadow": "var(--shadow-xs)",
      boxShadow:
        "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
    },
  },
  shrink: {
    "@layer utilities": {
      flexShrink: "1",
    },
  },
  "shrink-0": {
    "@layer utilities": {
      flexShrink: "0",
    },
  },
  "size-2": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 2)",
      height: "calc(var(--spacing) * 2)",
    },
  },
  "size-2.5": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 2.5)",
      height: "calc(var(--spacing) * 2.5)",
    },
  },
  "size-3.5": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 3.5)",
      height: "calc(var(--spacing) * 3.5)",
    },
  },
  "size-4": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 4)",
      height: "calc(var(--spacing) * 4)",
    },
  },
  "size-7": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 7)",
      height: "calc(var(--spacing) * 7)",
    },
  },
  "size-9": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 9)",
      height: "calc(var(--spacing) * 9)",
    },
  },
  "size-full": {
    "@layer utilities": {
      width: "100%",
      height: "100%",
    },
  },
  "sm:block": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        display: "block",
      },
    },
  },
  "sm:col-span-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gridColumn: "span 2 / span 2",
      },
    },
  },
  "sm:col-span-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gridColumn: "span 3 / span 3",
      },
    },
  },
  "sm:flex": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        display: "flex",
      },
    },
  },
  "sm:flex-row": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        flexDirection: "row",
      },
    },
  },
  "sm:gap-0": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gap: "calc(var(--spacing) * 0)",
      },
    },
  },
  "sm:gap-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gap: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:gap-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gap: "calc(var(--spacing) * 3)",
      },
    },
  },
  "sm:gap-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gap: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:gap-6": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gap: "calc(var(--spacing) * 6)",
      },
    },
  },
  "sm:gap-x-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        columnGap: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:grid-cols-1": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      },
    },
  },
  "sm:grid-cols-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      },
    },
  },
  "sm:grid-cols-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      },
    },
  },
  "sm:grid-cols-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      },
    },
  },
  "sm:h-10": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 10)",
      },
    },
  },
  "sm:h-11": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 11)",
      },
    },
  },
  "sm:h-12": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 12)",
      },
    },
  },
  "sm:h-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:h-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:h-5": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 5)",
      },
    },
  },
  "sm:h-7": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        height: "calc(var(--spacing) * 7)",
      },
    },
  },
  "sm:hidden": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        display: "none",
      },
    },
  },
  "sm:hover:scale-[1.02]": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "@media (hover: hover)": {
          scale: "1.02",
        },
      },
    },
  },
  "sm:hover:shadow-lg": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "@media (hover: hover)": {
          "--tw-shadow": "var(--shadow-lg)",
          boxShadow:
            "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
        },
      },
    },
  },
  "sm:inline": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        display: "inline",
      },
    },
  },
  "sm:items-center": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        alignItems: "center",
      },
    },
  },
  "sm:justify-between": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        justifyContent: "space-between",
      },
    },
  },
  "sm:justify-end": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        justifyContent: "flex-end",
      },
    },
  },
  "sm:left-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        left: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:line-clamp-1": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        overflow: "hidden",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "1",
      },
    },
  },
  "sm:max-h-24": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxHeight: "calc(var(--spacing) * 24)",
      },
    },
  },
  "sm:max-h-32": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxHeight: "calc(var(--spacing) * 32)",
      },
    },
  },
  "sm:max-h-40": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxHeight: "calc(var(--spacing) * 40)",
      },
    },
  },
  "sm:max-w-[80%]": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxWidth: "80%",
      },
    },
  },
  "sm:max-w-lg": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxWidth: "var(--container-lg)",
      },
    },
  },
  "sm:max-w-md": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxWidth: "var(--container-md)",
      },
    },
  },
  "sm:max-w-none": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxWidth: "none",
      },
    },
  },
  "sm:max-w-sm": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxWidth: "var(--container-sm)",
      },
    },
  },
  "sm:max-w-xs": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        maxWidth: "var(--container-xs)",
      },
    },
  },
  "sm:mb-0": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginBottom: "calc(var(--spacing) * 0)",
      },
    },
  },
  "sm:mb-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginBottom: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:mb-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginBottom: "calc(var(--spacing) * 3)",
      },
    },
  },
  "sm:mb-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginBottom: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:min-h-[120px]": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        minHeight: "120px",
      },
    },
  },
  "sm:min-h-[3.5rem]": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        minHeight: "3.5rem",
      },
    },
  },
  "sm:min-h-[3rem]": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        minHeight: "3rem",
      },
    },
  },
  "sm:min-h-auto": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        minHeight: "auto",
      },
    },
  },
  "sm:min-w-[200px]": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        minWidth: "200px",
      },
    },
  },
  "sm:min-w-auto": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        minWidth: "auto",
      },
    },
  },
  "sm:ml-1": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginLeft: "calc(var(--spacing) * 1)",
      },
    },
  },
  "sm:ml-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginLeft: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:ml-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginLeft: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:ml-8": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginLeft: "calc(var(--spacing) * 8)",
      },
    },
  },
  "sm:mr-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginRight: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:mr-8": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginRight: "calc(var(--spacing) * 8)",
      },
    },
  },
  "sm:mt-0": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginTop: "calc(var(--spacing) * 0)",
      },
    },
  },
  "sm:mt-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginTop: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:mx-auto": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        marginInline: "auto",
      },
    },
  },
  "sm:p-10": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        padding: "calc(var(--spacing) * 10)",
      },
    },
  },
  "sm:p-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        padding: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:p-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        padding: "calc(var(--spacing) * 3)",
      },
    },
  },
  "sm:p-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        padding: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:p-6": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        padding: "calc(var(--spacing) * 6)",
      },
    },
  },
  "sm:pb-16": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBottom: "calc(var(--spacing) * 16)",
      },
    },
  },
  "sm:pb-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBottom: "calc(var(--spacing) * 3)",
      },
    },
  },
  "sm:pb-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBottom: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:pb-6": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBottom: "calc(var(--spacing) * 6)",
      },
    },
  },
  "sm:pt-24": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingTop: "calc(var(--spacing) * 24)",
      },
    },
  },
  "sm:pt-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingTop: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:pt-6": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingTop: "calc(var(--spacing) * 6)",
      },
    },
  },
  "sm:px-0": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingInline: "calc(var(--spacing) * 0)",
      },
    },
  },
  "sm:px-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingInline: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:px-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingInline: "calc(var(--spacing) * 3)",
      },
    },
  },
  "sm:px-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingInline: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:px-6": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingInline: "calc(var(--spacing) * 6)",
      },
    },
  },
  "sm:py-16": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBlock: "calc(var(--spacing) * 16)",
      },
    },
  },
  "sm:py-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBlock: "calc(var(--spacing) * 3)",
      },
    },
  },
  "sm:py-8": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        paddingBlock: "calc(var(--spacing) * 8)",
      },
    },
  },
  "sm:right-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        right: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:space-x-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-x-reverse": "0",
        marginInlineStart: "calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse))",
        marginInlineEnd: "calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))",
      },
    },
  },
  "sm:space-y-0": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-y-reverse": "0",
        marginBlockStart: "calc(calc(var(--spacing) * 0) * var(--tw-space-y-reverse))",
        marginBlockEnd: "calc(calc(var(--spacing) * 0) * calc(1 - var(--tw-space-y-reverse)))",
      },
    },
  },
  "sm:space-y-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-y-reverse": "0",
        marginBlockStart: "calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse))",
        marginBlockEnd: "calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))",
      },
    },
  },
  "sm:space-y-3": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-y-reverse": "0",
        marginBlockStart: "calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse))",
        marginBlockEnd: "calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))",
      },
    },
  },
  "sm:space-y-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-y-reverse": "0",
        marginBlockStart: "calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse))",
        marginBlockEnd: "calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))",
      },
    },
  },
  "sm:space-y-6": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-y-reverse": "0",
        marginBlockStart: "calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse))",
        marginBlockEnd: "calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))",
      },
    },
  },
  "sm:space-y-8": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        "--tw-space-y-reverse": "0",
        marginBlockStart: "calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse))",
        marginBlockEnd: "calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))",
      },
    },
  },
  "sm:text-2xl": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-2xl)",
        lineHeight: "var(--tw-leading, var(--text-2xl--line-height))",
      },
    },
  },
  "sm:text-3xl": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-3xl)",
        lineHeight: "var(--tw-leading, var(--text-3xl--line-height))",
      },
    },
  },
  "sm:text-4xl": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-4xl)",
        lineHeight: "var(--tw-leading, var(--text-4xl--line-height))",
      },
    },
  },
  "sm:text-base": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-base)",
        lineHeight: "var(--tw-leading, var(--text-base--line-height))",
      },
    },
  },
  "sm:text-left": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        textAlign: "left",
      },
    },
  },
  "sm:text-lg": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-lg)",
        lineHeight: "var(--tw-leading, var(--text-lg--line-height))",
      },
    },
  },
  "sm:text-sm": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-sm)",
        lineHeight: "var(--tw-leading, var(--text-sm--line-height))",
      },
    },
  },
  "sm:text-xl": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        fontSize: "var(--text-xl)",
        lineHeight: "var(--tw-leading, var(--text-xl--line-height))",
      },
    },
  },
  "sm:top-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        top: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:w-10": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 10)",
      },
    },
  },
  "sm:w-12": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 12)",
      },
    },
  },
  "sm:w-2": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 2)",
      },
    },
  },
  "sm:w-4": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 4)",
      },
    },
  },
  "sm:w-5": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 5)",
      },
    },
  },
  "sm:w-7": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 7)",
      },
    },
  },
  "sm:w-80": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "calc(var(--spacing) * 80)",
      },
    },
  },
  "sm:w-auto": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "auto",
      },
    },
  },
  "sm:w-full": {
    "@layer utilities": {
      "@media (width >= 40rem)": {
        width: "100%",
      },
    },
  },
  "space-x-1": {
    "@layer utilities": {
      "--tw-space-x-reverse": "0",
      marginInlineStart: "calc(calc(var(--spacing) * 1) * var(--tw-space-x-reverse))",
      marginInlineEnd: "calc(calc(var(--spacing) * 1) * calc(1 - var(--tw-space-x-reverse)))",
    },
  },
  "space-x-1.5": {
    "@layer utilities": {
      "--tw-space-x-reverse": "0",
      marginInlineStart: "calc(calc(var(--spacing) * 1.5) * var(--tw-space-x-reverse))",
      marginInlineEnd: "calc(calc(var(--spacing) * 1.5) * calc(1 - var(--tw-space-x-reverse)))",
    },
  },
  "space-x-2": {
    "@layer utilities": {
      "--tw-space-x-reverse": "0",
      marginInlineStart: "calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse))",
      marginInlineEnd: "calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))",
    },
  },
  "space-x-3": {
    "@layer utilities": {
      "--tw-space-x-reverse": "0",
      marginInlineStart: "calc(calc(var(--spacing) * 3) * var(--tw-space-x-reverse))",
      marginInlineEnd: "calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-x-reverse)))",
    },
  },
  "space-x-4": {
    "@layer utilities": {
      "--tw-space-x-reverse": "0",
      marginInlineStart: "calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse))",
      marginInlineEnd: "calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))",
    },
  },
  "space-y-0": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 0) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 0) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-0.5": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 0.5) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 0.5) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-1": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 1) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 1) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-1.5": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 1.5) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 1.5) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-2": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-3": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-4": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "space-y-6": {
    "@layer utilities": {
      "--tw-space-y-reverse": "0",
      marginBlockStart: "calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse))",
      marginBlockEnd: "calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))",
    },
  },
  "sr-only": {
    "@layer utilities": {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      borderWidth: "0",
    },
  },
  start: {
    "@layer utilities": {
      insetInlineStart: "var(--spacing)",
    },
  },
  static: {
    "@layer utilities": {
      position: "static",
    },
  },
  "tabular-nums": {
    "@layer utilities": {
      "--tw-numeric-spacing": "tabular-nums",
      fontVariantNumeric:
        "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
    },
  },
  "text-2xl": {
    "@layer utilities": {
      fontSize: "var(--text-2xl)",
      lineHeight: "var(--tw-leading, var(--text-2xl--line-height))",
    },
  },
  "text-3xl": {
    "@layer utilities": {
      fontSize: "var(--text-3xl)",
      lineHeight: "var(--tw-leading, var(--text-3xl--line-height))",
    },
  },
  "text-balance": {
    "@layer utilities": {
      textWrap: "balance",
    },
  },
  "text-base": {
    "@layer utilities": {
      fontSize: "var(--text-base)",
      lineHeight: "var(--tw-leading, var(--text-base--line-height))",
    },
  },
  "text-blue-500": {
    "@layer utilities": {
      color: "var(--color-blue-500)",
    },
  },
  "text-blue-600": {
    "@layer utilities": {
      color: "var(--color-blue-600)",
    },
  },
  "text-blue-700": {
    "@layer utilities": {
      color: "var(--color-blue-700)",
    },
  },
  "text-blue-800": {
    "@layer utilities": {
      color: "var(--color-blue-800)",
    },
  },
  "text-card-foreground": {
    "@layer utilities": {
      color: "var(--card-foreground)",
    },
  },
  "text-center": {
    "@layer utilities": {
      textAlign: "center",
    },
  },
  "text-current": {
    "@layer utilities": {
      color: "currentcolor",
    },
  },
  "text-destructive": {
    "@layer utilities": {
      color: "var(--destructive)",
    },
  },
  "text-emerald-600": {
    "@layer utilities": {
      color: "var(--color-emerald-600)",
    },
  },
  "text-foreground": {
    "@layer utilities": {
      color: "var(--foreground)",
    },
  },
  "text-gray-600": {
    "@layer utilities": {
      color: "var(--color-gray-600)",
    },
  },
  "text-gray-700": {
    "@layer utilities": {
      color: "var(--color-gray-700)",
    },
  },
  "text-gray-800": {
    "@layer utilities": {
      color: "var(--color-gray-800)",
    },
  },
  "text-green-500": {
    "@layer utilities": {
      color: "var(--color-green-500)",
    },
  },
  "text-green-800": {
    "@layer utilities": {
      color: "var(--color-green-800)",
    },
  },
  "text-left": {
    "@layer utilities": {
      textAlign: "left",
    },
  },
  "text-lg": {
    "@layer utilities": {
      fontSize: "var(--text-lg)",
      lineHeight: "var(--tw-leading, var(--text-lg--line-height))",
    },
  },
  "text-muted-foreground": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
    },
  },
  "text-muted-foreground/60": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
      "@supports (color: color-mix(in lab, red, red))": {
        color: "color-mix(in oklab, var(--muted-foreground) 60%, transparent)",
      },
    },
  },
  "text-muted-foreground/70": {
    "@layer utilities": {
      color: "var(--muted-foreground)",
      "@supports (color: color-mix(in lab, red, red))": {
        color: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
      },
    },
  },
  "text-neutral-50": {
    "@layer utilities": {
      color: "var(--color-neutral-50)",
    },
  },
  "text-orange-500": {
    "@layer utilities": {
      color: "var(--color-orange-500)",
    },
  },
  "text-orange-600": {
    "@layer utilities": {
      color: "var(--color-orange-600)",
    },
  },
  "text-popover-foreground": {
    "@layer utilities": {
      color: "var(--popover-foreground)",
    },
  },
  "text-primary": {
    "@layer utilities": {
      color: "var(--primary)",
    },
  },
  "text-primary-foreground": {
    "@layer utilities": {
      color: "var(--primary-foreground)",
    },
  },
  "text-primary-foreground/70": {
    "@layer utilities": {
      color: "var(--primary-foreground)",
      "@supports (color: color-mix(in lab, red, red))": {
        color: "color-mix(in oklab, var(--primary-foreground) 70%, transparent)",
      },
    },
  },
  "text-purple-500": {
    "@layer utilities": {
      color: "var(--color-purple-500)",
    },
  },
  "text-purple-600": {
    "@layer utilities": {
      color: "var(--color-purple-600)",
    },
  },
  "text-purple-700": {
    "@layer utilities": {
      color: "var(--color-purple-700)",
    },
  },
  "text-red-500": {
    "@layer utilities": {
      color: "var(--color-red-500)",
    },
  },
  "text-right": {
    "@layer utilities": {
      textAlign: "right",
    },
  },
  "text-rose-800": {
    "@layer utilities": {
      color: "var(--color-rose-800)",
    },
  },
  "text-secondary-foreground": {
    "@layer utilities": {
      color: "var(--secondary-foreground)",
    },
  },
  "text-sidebar-foreground": {
    "@layer utilities": {
      color: "var(--sidebar-foreground)",
    },
  },
  "text-sidebar-foreground/70": {
    "@layer utilities": {
      color: "var(--sidebar-foreground)",
      "@supports (color: color-mix(in lab, red, red))": {
        color: "color-mix(in oklab, var(--sidebar-foreground) 70%, transparent)",
      },
    },
  },
  "text-slate-600": {
    "@layer utilities": {
      color: "var(--color-slate-600)",
    },
  },
  "text-sm": {
    "@layer utilities": {
      fontSize: "var(--text-sm)",
      lineHeight: "var(--tw-leading, var(--text-sm--line-height))",
    },
  },
  "text-start": {
    "@layer utilities": {
      textAlign: "start",
    },
  },
  "text-transparent": {
    "@layer utilities": {
      color: "transparent",
    },
  },
  "text-white": {
    "@layer utilities": {
      color: "var(--color-white)",
    },
  },
  "text-xl": {
    "@layer utilities": {
      fontSize: "var(--text-xl)",
      lineHeight: "var(--tw-leading, var(--text-xl--line-height))",
    },
  },
  "text-xs": {
    "@layer utilities": {
      fontSize: "var(--text-xs)",
      lineHeight: "var(--tw-leading, var(--text-xs--line-height))",
    },
  },
  "text-yellow-500": {
    "@layer utilities": {
      color: "var(--color-yellow-500)",
    },
  },
  "text-yellow-600": {
    "@layer utilities": {
      color: "var(--color-yellow-600)",
    },
  },
  "text-yellow-800": {
    "@layer utilities": {
      color: "var(--color-yellow-800)",
    },
  },
  "text-zinc-100": {
    "@layer utilities": {
      color: "var(--color-zinc-100)",
    },
  },
  "to-muted/30": {
    "@layer utilities": {
      "--tw-gradient-to": "var(--muted)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-gradient-to": "color-mix(in oklab, var(--muted) 30%, transparent)",
      },
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "to-pink-500": {
    "@layer utilities": {
      "--tw-gradient-to": "var(--color-pink-500)",
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "to-purple-500/5": {
    "@layer utilities": {
      "--tw-gradient-to": "color-mix(in srgb, oklch(62.7% 0.265 303.9) 5%, transparent)",
      "@supports (color: color-mix(in lab, red, red))": {
        "--tw-gradient-to": "color-mix(in oklab, var(--color-purple-500) 5%, transparent)",
      },
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "to-purple-600": {
    "@layer utilities": {
      "--tw-gradient-to": "var(--color-purple-600)",
      "--tw-gradient-stops":
        "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    },
  },
  "top-[50%]": {
    "@layer utilities": {
      top: "50%",
    },
  },
  "top-0": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 0)",
    },
  },
  "top-1.5": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 1.5)",
    },
  },
  "top-1/2": {
    "@layer utilities": {
      top: "calc(1 / 2 * 100%)",
    },
  },
  "top-2": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 2)",
    },
  },
  "top-3.5": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 3.5)",
    },
  },
  "top-4": {
    "@layer utilities": {
      top: "calc(var(--spacing) * 4)",
    },
  },
  "touch-manipulation": {
    "@layer utilities": {
      touchAction: "manipulation",
    },
  },
  "touch-none": {
    "@layer utilities": {
      touchAction: "none",
    },
  },
  "tracking-tight": {
    "@layer utilities": {
      "--tw-tracking": "var(--tracking-tight)",
      letterSpacing: "var(--tracking-tight)",
    },
  },
  "tracking-widest": {
    "@layer utilities": {
      "--tw-tracking": "var(--tracking-widest)",
      letterSpacing: "var(--tracking-widest)",
    },
  },
  transform: {
    "@layer utilities": {
      transform:
        "var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)",
    },
  },
  transition: {
    "@layer utilities": {
      transitionProperty:
        "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-[color,box-shadow]": {
    "@layer utilities": {
      transitionProperty: "color,box-shadow",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-[left,right,width]": {
    "@layer utilities": {
      transitionProperty: "left,right,width",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-[margin,opacity]": {
    "@layer utilities": {
      transitionProperty: "margin,opacity",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-[width,height,padding]": {
    "@layer utilities": {
      transitionProperty: "width,height,padding",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-[width]": {
    "@layer utilities": {
      transitionProperty: "width",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-all": {
    "@layer utilities": {
      transitionProperty: "all",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-colors": {
    "@layer utilities": {
      transitionProperty:
        "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-none": {
    "@layer utilities": {
      transitionProperty: "none",
    },
  },
  "transition-opacity": {
    "@layer utilities": {
      transitionProperty: "opacity",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-shadow": {
    "@layer utilities": {
      transitionProperty: "box-shadow",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "transition-transform": {
    "@layer utilities": {
      transitionProperty: "transform, translate, scale, rotate",
      transitionTimingFunction: "var(--tw-ease, var(--default-transition-timing-function))",
      transitionDuration: "var(--tw-duration, var(--default-transition-duration))",
    },
  },
  "translate-x-[-50%]": {
    "@layer utilities": {
      "--tw-translate-x": "-50%",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "translate-x-px": {
    "@layer utilities": {
      "--tw-translate-x": "1px",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "translate-y-[-50%]": {
    "@layer utilities": {
      "--tw-translate-y": "-50%",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  "translate-y-[calc(-50%_-_2px)]": {
    "@layer utilities": {
      "--tw-translate-y": "calc(-50% - 2px)",
      translate: "var(--tw-translate-x) var(--tw-translate-y)",
    },
  },
  truncate: {
    "@layer utilities": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  underline: {
    "@layer utilities": {
      textDecorationLine: "underline",
    },
  },
  "underline-offset-4": {
    "@layer utilities": {
      textUnderlineOffset: "4px",
    },
  },
  uppercase: {
    "@layer utilities": {
      textTransform: "uppercase",
    },
  },
  "via-background": {
    "@layer utilities": {
      "--tw-gradient-via": "var(--background)",
      "--tw-gradient-via-stops":
        "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)",
      "--tw-gradient-stops": "var(--tw-gradient-via-stops)",
    },
  },
  "w-(--sidebar-width)": {
    "@layer utilities": {
      width: "var(--sidebar-width)",
    },
  },
  "w-[calc(100vw-2rem)]": {
    "@layer utilities": {
      width: "calc(100vw - 2rem)",
    },
  },
  "w-1.5": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 1.5)",
    },
  },
  "w-1/2": {
    "@layer utilities": {
      width: "calc(1 / 2 * 100%)",
    },
  },
  "w-1/4": {
    "@layer utilities": {
      width: "calc(1 / 4 * 100%)",
    },
  },
  "w-10": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 10)",
    },
  },
  "w-12": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 12)",
    },
  },
  "w-2": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 2)",
    },
  },
  "w-2.5": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 2.5)",
    },
  },
  "w-3": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 3)",
    },
  },
  "w-3/4": {
    "@layer utilities": {
      width: "calc(3 / 4 * 100%)",
    },
  },
  "w-4": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 4)",
    },
  },
  "w-5": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 5)",
    },
  },
  "w-56": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 56)",
    },
  },
  "w-6": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 6)",
    },
  },
  "w-64": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 64)",
    },
  },
  "w-72": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 72)",
    },
  },
  "w-8": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 8)",
    },
  },
  "w-80": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 80)",
    },
  },
  "w-9": {
    "@layer utilities": {
      width: "calc(var(--spacing) * 9)",
    },
  },
  "w-auto": {
    "@layer utilities": {
      width: "auto",
    },
  },
  "w-fit": {
    "@layer utilities": {
      width: "fit-content",
    },
  },
  "w-full": {
    "@layer utilities": {
      width: "100%",
    },
  },
  "whitespace-nowrap": {
    "@layer utilities": {
      whiteSpace: "nowrap",
    },
  },
  "whitespace-pre-wrap": {
    "@layer utilities": {
      whiteSpace: "pre-wrap",
    },
  },
  "z-10": {
    "@layer utilities": {
      zIndex: "10",
    },
  },
  "z-20": {
    "@layer utilities": {
      zIndex: "20",
    },
  },
  "z-50": {
    "@layer utilities": {
      zIndex: "50",
    },
  },
  "zoom-in-95": {
    "@layer utilities": {
      "--tw-enter-scale": ".95",
    },
  },
});

export const supportedUtilities = new Set([
  "*:[span]:last:flex",
  "*:[span]:last:gap-2",
  "*:[span]:last:items-center",
  "*:data-[slot=alert-description]:text-destructive/90",
  "*:data-[slot=select-value]:flex",
  "*:data-[slot=select-value]:gap-2",
  "*:data-[slot=select-value]:items-center",
  "*:data-[slot=select-value]:line-clamp-1",
  "-mx-1",
  "-space-x-2",
  "-translate-x-1/2",
  "-translate-x-px",
  "-translate-y-1/2",
  "@container/card-header",
  "[&>button]:hidden",
  "[&>span:last-child]:truncate",
  "[&>svg]:pointer-events-none",
  "[&>svg]:shrink-0",
  "[&>svg]:size-3",
  "[&>svg]:size-4",
  "[&>svg]:text-current",
  "[&>svg]:text-sidebar-accent-foreground",
  "[&>svg]:translate-y-0.5",
  "[&_input]:hidden",
  "[&_p]:leading-relaxed",
  "[&_svg:not([class*='size-'])]:size-4",
  "[&_svg:not([class*='text-'])]:text-muted-foreground",
  "[&_svg]:pointer-events-none",
  "[&_svg]:shrink-0",
  "[.border-b]:pb-6",
  "[.border-t]:pt-6",
  "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
  "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize",
  "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
  "[[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
  "[a&]:hover:bg-accent",
  "[a&]:hover:bg-destructive/90",
  "[a&]:hover:bg-primary/90",
  "[a&]:hover:bg-secondary/90",
  "[a&]:hover:text-accent-foreground",
  "[animation-delay:-0.15s]",
  "[animation-delay:-0.3s]",
  "absolute",
  "active:bg-sidebar-accent",
  "active:scale-[0.98]",
  "active:text-sidebar-accent-foreground",
  "after:-inset-2",
  "after:absolute",
  "after:inset-y-0",
  "after:left-1/2",
  "after:w-[2px]",
  "animate-bounce",
  "animate-in",
  "animate-pulse",
  "animate-spin",
  "aria-disabled:opacity-50",
  "aria-disabled:pointer-events-none",
  "aria-invalid:border-destructive",
  "aria-invalid:ring-destructive/20",
  "aspect-square",
  "auto-rows-min",
  "backdrop-blur",
  "backdrop-blur-sm",
  "bg-accent",
  "bg-background",
  "bg-background/50",
  "bg-background/80",
  "bg-background/95",
  "bg-black/20",
  "bg-black/50",
  "bg-black/80",
  "bg-blue-100",
  "bg-blue-50",
  "bg-blue-50/50",
  "bg-blue-500",
  "bg-border",
  "bg-card",
  "bg-clip-text",
  "bg-current",
  "bg-destructive",
  "bg-destructive/10",
  "bg-destructive/20",
  "bg-emerald-50",
  "bg-gradient-to-br",
  "bg-gradient-to-r",
  "bg-gray-100",
  "bg-gray-200",
  "bg-green-50",
  "bg-muted",
  "bg-muted/30",
  "bg-muted/50",
  "bg-orange-50",
  "bg-popover",
  "bg-primary",
  "bg-primary/10",
  "bg-primary/20",
  "bg-primary/60",
  "bg-purple-100",
  "bg-purple-50",
  "bg-purple-50/50",
  "bg-red-500",
  "bg-secondary",
  "bg-sidebar",
  "bg-sidebar-border",
  "bg-slate-50",
  "bg-transparent",
  "bg-yellow-100",
  "bg-zinc-900",
  "block",
  "border",
  "border-2",
  "border-b",
  "border-b-2",
  "border-background",
  "border-blue-200",
  "border-border",
  "border-border/50",
  "border-dashed",
  "border-destructive",
  "border-destructive/20",
  "border-destructive/50",
  "border-emerald-200",
  "border-gray-300",
  "border-green-200",
  "border-input",
  "border-l",
  "border-l-transparent",
  "border-muted",
  "border-muted-foreground/20",
  "border-none",
  "border-orange-200",
  "border-primary",
  "border-primary-foreground/20",
  "border-primary/10",
  "border-primary/20",
  "border-purple-200",
  "border-purple-500",
  "border-r",
  "border-sidebar-border",
  "border-slate-200",
  "border-solid",
  "border-t",
  "border-t-transparent",
  "border-transparent",
  "bottom-0",
  "bottom-2",
  "break-all",
  "break-words",
  "capitalize",
  "col-start-2",
  "container",
  "cursor-default",
  "cursor-not-allowed",
  "cursor-pointer",
  "dark",
  "dark:aria-invalid:ring-destructive/40",
  "dark:bg-blue-900",
  "dark:bg-blue-900/20",
  "dark:bg-blue-950/20",
  "dark:bg-blue-950/80",
  "dark:bg-destructive/60",
  "dark:bg-emerald-950/80",
  "dark:bg-gray-800",
  "dark:bg-gray-900",
  "dark:bg-gray-900/20",
  "dark:bg-input/30",
  "dark:bg-neutral-800",
  "dark:bg-orange-950/80",
  "dark:bg-purple-900",
  "dark:bg-purple-950/20",
  "dark:bg-purple-950/50",
  "dark:bg-purple-950/80",
  "dark:bg-slate-950/80",
  "dark:bg-yellow-900",
  "dark:bg-yellow-900/20",
  "dark:bg-zinc-100",
  "dark:border-blue-800",
  "dark:border-emerald-800",
  "dark:border-input",
  "dark:border-orange-800",
  "dark:border-purple-800",
  "dark:border-slate-800",
  "dark:data-[state=checked]:bg-primary",
  "dark:data-[state=checked]:bg-primary-foreground",
  "dark:data-[state=unchecked]:bg-foreground",
  "dark:data-[state=unchecked]:bg-input/80",
  "dark:data-[variant=destructive]:focus:bg-destructive/20",
  "dark:focus-visible:ring-destructive/40",
  "dark:hover:bg-accent/50",
  "dark:hover:bg-input/50",
  "dark:hover:bg-purple-950/70",
  "dark:text-blue-200",
  "dark:text-blue-300",
  "dark:text-blue-400",
  "dark:text-emerald-400",
  "dark:text-gray-300",
  "dark:text-orange-400",
  "dark:text-purple-300",
  "dark:text-purple-400",
  "dark:text-slate-400",
  "dark:text-yellow-200",
  "dark:text-yellow-300",
  "dark:text-zinc-900",
  "data-[active=true]:bg-sidebar-accent",
  "data-[active=true]:font-medium",
  "data-[active=true]:text-sidebar-accent-foreground",
  "data-[disabled]:opacity-50",
  "data-[disabled]:pointer-events-none",
  "data-[error=true]:text-destructive",
  "data-[inset]:pl-8",
  "data-[orientation=horizontal]:h-px",
  "data-[orientation=horizontal]:w-full",
  "data-[orientation=vertical]:h-full",
  "data-[orientation=vertical]:w-px",
  "data-[placeholder]:text-muted-foreground",
  "data-[side=bottom]:slide-in-from-top-2",
  "data-[side=bottom]:translate-y-1",
  "data-[side=left]:-translate-x-1",
  "data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2",
  "data-[side=right]:translate-x-1",
  "data-[side=top]:-translate-y-1",
  "data-[side=top]:slide-in-from-bottom-2",
  "data-[size=default]:h-9",
  "data-[size=sm]:h-8",
  "data-[state=checked]:bg-primary",
  "data-[state=checked]:bg-purple-500",
  "data-[state=checked]:border-primary",
  "data-[state=checked]:text-primary-foreground",
  "data-[state=checked]:translate-x-[calc(100%-2px)]",
  "data-[state=closed]:animate-out",
  "data-[state=closed]:duration-300",
  "data-[state=closed]:fade-out-0",
  "data-[state=closed]:slide-out-to-bottom",
  "data-[state=closed]:slide-out-to-left",
  "data-[state=closed]:slide-out-to-right",
  "data-[state=closed]:slide-out-to-top",
  "data-[state=closed]:zoom-out-95",
  "data-[state=open]:animate-in",
  "data-[state=open]:bg-accent",
  "data-[state=open]:bg-secondary",
  "data-[state=open]:duration-500",
  "data-[state=open]:fade-in-0",
  "data-[state=open]:hover:bg-sidebar-accent",
  "data-[state=open]:hover:text-sidebar-accent-foreground",
  "data-[state=open]:opacity-100",
  "data-[state=open]:slide-in-from-bottom",
  "data-[state=open]:slide-in-from-left",
  "data-[state=open]:slide-in-from-right",
  "data-[state=open]:slide-in-from-top",
  "data-[state=open]:text-accent-foreground",
  "data-[state=open]:text-muted-foreground",
  "data-[state=open]:zoom-in-95",
  "data-[state=unchecked]:bg-input",
  "data-[state=unchecked]:translate-x-0",
  "data-[variant=destructive]:*:[svg]:!text-destructive",
  "data-[variant=destructive]:focus:bg-destructive/10",
  "data-[variant=destructive]:focus:text-destructive",
  "data-[variant=destructive]:text-destructive",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "disabled:opacity-60",
  "disabled:pointer-events-none",
  "disabled:transform-none",
  "drop-shadow-md",
  "duration-100",
  "duration-200",
  "duration-300",
  "ease-in-out",
  "ease-linear",
  "ease-out",
  "end",
  "fade-in-0",
  "field-sizing-content",
  "file:bg-transparent",
  "file:border-0",
  "file:font-medium",
  "file:h-7",
  "file:inline-flex",
  "file:text-foreground",
  "file:text-sm",
  "fill-current",
  "fill-primary",
  "first:mt-4",
  "fixed",
  "flex",
  "flex-1",
  "flex-auto",
  "flex-col",
  "flex-col-reverse",
  "flex-row",
  "flex-shrink-0",
  "flex-wrap",
  "focus-visible:border-ring",
  "focus-visible:outline-1",
  "focus-visible:ring-0",
  "focus-visible:ring-2",
  "focus-visible:ring-[3px]",
  "focus-visible:ring-destructive/20",
  "focus-visible:ring-ring/50",
  "focus:bg-accent",
  "focus:border-primary/40",
  "focus:outline-hidden",
  "focus:ring-2",
  "focus:ring-offset-2",
  "focus:ring-ring",
  "focus:text-accent-foreground",
  "focus:text-destructive",
  "font-bold",
  "font-medium",
  "font-mono",
  "font-semibold",
  "from-background",
  "from-blue-500",
  "from-primary/5",
  "from-purple-500",
  "gap-1",
  "gap-1.5",
  "gap-2",
  "gap-3",
  "gap-4",
  "gap-6",
  "gap-x-2",
  "gap-x-3",
  "gap-x-4",
  "gap-y-0.5",
  "gap-y-1",
  "gap-y-2",
  "grid",
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-[0_1fr]",
  "grid-rows-[auto_auto]",
  "group-data-[collapsible=icon]:-mt-8",
  "group-data-[collapsible=icon]:hidden",
  "group-data-[collapsible=icon]:opacity-0",
  "group-data-[collapsible=icon]:overflow-hidden",
  "group-data-[collapsible=icon]:p-0!",
  "group-data-[collapsible=icon]:p-2!",
  "group-data-[collapsible=icon]:size-8!",
  "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
  "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
  "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
  "group-data-[collapsible=offcanvas]:after:left-full",
  "group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
  "group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
  "group-data-[collapsible=offcanvas]:translate-x-0",
  "group-data-[collapsible=offcanvas]:w-0",
  "group-data-[disabled=true]:opacity-50",
  "group-data-[disabled=true]:pointer-events-none",
  "group-data-[side=left]:-right-4",
  "group-data-[side=left]:border-r",
  "group-data-[side=right]:border-l",
  "group-data-[side=right]:left-0",
  "group-data-[side=right]:rotate-180",
  "group-data-[variant=floating]:border",
  "group-data-[variant=floating]:border-sidebar-border",
  "group-data-[variant=floating]:rounded-lg",
  "group-data-[variant=floating]:shadow-sm",
  "group-focus-within/menu-item:opacity-100",
  "group-has-data-[sidebar=menu-action]/menu-item:pr-8",
  "group-hover/menu-item:opacity-100",
  "grow",
  "h-1.5",
  "h-10",
  "h-12",
  "h-16",
  "h-2",
  "h-2.5",
  "h-3",
  "h-4",
  "h-5",
  "h-6",
  "h-7",
  "h-8",
  "h-9",
  "h-[1.15rem]",
  "h-[calc(100vh-73px)]",
  "h-[var(--radix-select-trigger-height)]",
  "h-auto",
  "h-full",
  "h-px",
  "h-screen",
  "h-svh",
  "has-[>svg]:gap-x-3",
  "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]",
  "has-[>svg]:px-2.5",
  "has-[>svg]:px-3",
  "has-[>svg]:px-4",
  "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
  "has-data-[variant=inset]:bg-sidebar",
  "hidden",
  "hover:after:bg-sidebar-border",
  "hover:bg-accent",
  "hover:bg-background",
  "hover:bg-background/20",
  "hover:bg-background/70",
  "hover:bg-destructive/90",
  "hover:bg-muted",
  "hover:bg-muted/50",
  "hover:bg-primary/80",
  "hover:bg-primary/90",
  "hover:bg-purple-100",
  "hover:bg-red-600",
  "hover:bg-secondary/80",
  "hover:bg-sidebar-accent",
  "hover:bg-transparent",
  "hover:border-primary/30",
  "hover:border-purple-300",
  "hover:from-blue-600",
  "hover:from-purple-600",
  "hover:group-data-[collapsible=offcanvas]:bg-sidebar",
  "hover:opacity-100",
  "hover:scale-105",
  "hover:scale-[1.02]",
  "hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
  "hover:shadow-xl",
  "hover:text-accent-foreground",
  "hover:text-foreground",
  "hover:text-primary/80",
  "hover:text-rose-700",
  "hover:text-sidebar-accent-foreground",
  "hover:to-pink-600",
  "hover:to-purple-700",
  "hover:underline",
  "in-data-[side=left]:cursor-w-resize",
  "in-data-[side=right]:cursor-e-resize",
  "inline-block",
  "inline-flex",
  "inset-0",
  "inset-x-0",
  "inset-y-0",
  "items-center",
  "items-start",
  "items-stretch",
  "justify-between",
  "justify-center",
  "justify-end",
  "justify-items-start",
  "justify-self-end",
  "justify-start",
  "last:mb-4",
  "leading-none",
  "leading-relaxed",
  "leading-tight",
  "left-0",
  "left-2",
  "left-4",
  "left-[50%]",
  "lg:grid-cols-2",
  "lg:grid-cols-3",
  "lg:grid-cols-6",
  "lg:grid-rows-2",
  "lg:p-8",
  "lg:pb-32",
  "lg:pt-32",
  "lg:px-6",
  "lg:px-8",
  "lg:py-20",
  "lg:text-2xl",
  "lg:text-4xl",
  "lg:text-base",
  "lg:text-xl",
  "line-clamp-1",
  "line-clamp-2",
  "list-disc",
  "m-2",
  "max-h-(--radix-dropdown-menu-content-available-height)",
  "max-h-(--radix-select-content-available-height)",
  "max-h-20",
  "max-h-24",
  "max-h-32",
  "max-h-[70vh]",
  "max-h-[90vh]",
  "max-h-full",
  "max-w-(--skeleton-width)",
  "max-w-2xl",
  "max-w-4xl",
  "max-w-5xl",
  "max-w-[120px]",
  "max-w-[140px]",
  "max-w-[320px]",
  "max-w-[425px]",
  "max-w-[85%]",
  "max-w-[calc(100%-2rem)]",
  "max-w-full",
  "max-w-md",
  "max-w-none",
  "max-w-sm",
  "mb-1",
  "mb-2",
  "mb-3",
  "mb-4",
  "mb-6",
  "mb-8",
  "md:after:hidden",
  "md:block",
  "md:flex",
  "md:grid-cols-1",
  "md:grid-cols-2",
  "md:max-w-[70%]",
  "md:opacity-0",
  "md:p-10",
  "md:peer-data-[variant=inset]:m-2",
  "md:peer-data-[variant=inset]:ml-0",
  "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
  "md:peer-data-[variant=inset]:rounded-xl",
  "md:peer-data-[variant=inset]:shadow-sm",
  "md:text-base",
  "md:text-sm",
  "min-h-0",
  "min-h-16",
  "min-h-4",
  "min-h-[100px]",
  "min-h-[2.5rem]",
  "min-h-[36px]",
  "min-h-[3rem]",
  "min-h-[40px]",
  "min-h-[44px]",
  "min-h-full",
  "min-h-screen",
  "min-h-svh",
  "min-w-0",
  "min-w-5",
  "min-w-[40px]",
  "min-w-[44px]",
  "min-w-[8rem]",
  "min-w-[var(--radix-select-trigger-width)]",
  "ml-0",
  "ml-1",
  "ml-1.5",
  "ml-2",
  "ml-4",
  "ml-auto",
  "mr-1",
  "mr-1.5",
  "mr-2",
  "mr-4",
  "mt-0.5",
  "mt-1",
  "mt-1.5",
  "mt-2",
  "mt-3",
  "mt-4",
  "mt-6",
  "mt-8",
  "mt-auto",
  "mx-1",
  "mx-2",
  "mx-3.5",
  "mx-4",
  "mx-auto",
  "my-1",
  "object-contain",
  "object-cover",
  "opacity-100",
  "opacity-50",
  "opacity-60",
  "opacity-70",
  "origin-(--radix-dropdown-menu-content-transform-origin)",
  "origin-(--radix-select-content-transform-origin)",
  "origin-(--radix-tooltip-content-transform-origin)",
  "outline",
  "outline-hidden",
  "outline-none",
  "overflow-auto",
  "overflow-hidden",
  "overflow-x-hidden",
  "overflow-y-auto",
  "p-0",
  "p-0.5",
  "p-1",
  "p-1.5",
  "p-2",
  "p-3",
  "p-4",
  "p-6",
  "p-px",
  "pb-2",
  "pb-3",
  "pb-4",
  "pb-8",
  "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
  "peer-data-[size=default]/menu-button:top-1.5",
  "peer-data-[size=lg]/menu-button:top-2.5",
  "peer-data-[size=sm]/menu-button:top-1",
  "peer-disabled:cursor-not-allowed",
  "peer-disabled:opacity-50",
  "peer-hover/menu-button:text-sidebar-accent-foreground",
  "pl-2",
  "pl-8",
  "placeholder:text-muted-foreground",
  "pointer-events-none",
  "pr-10",
  "pr-12",
  "pr-2",
  "pr-4",
  "pr-8",
  "pt-0",
  "pt-1",
  "pt-2",
  "pt-20",
  "pt-3",
  "pt-4",
  "pt-6",
  "px-1",
  "px-1.5",
  "px-2",
  "px-2.5",
  "px-3",
  "px-4",
  "px-6",
  "py-0.5",
  "py-1",
  "py-1.5",
  "py-12",
  "py-16",
  "py-2",
  "py-3",
  "py-4",
  "py-6",
  "py-8",
  "relative",
  "resize-none",
  "right-0",
  "right-1",
  "right-2",
  "right-3",
  "right-4",
  "ring-0",
  "ring-offset-background",
  "ring-sidebar-ring",
  "rotate-180",
  "rotate-45",
  "rounded",
  "rounded-[2px]",
  "rounded-[4px]",
  "rounded-[inherit]",
  "rounded-full",
  "rounded-lg",
  "rounded-md",
  "rounded-none",
  "rounded-sm",
  "rounded-t-lg",
  "rounded-xs",
  "row-span-2",
  "row-start-1",
  "scale-100",
  "scale-95",
  "scroll-my-1",
  "select-none",
  "selection:bg-primary",
  "selection:text-primary-foreground",
  "self-start",
  "shadow-2xl",
  "shadow-[0_0_0_1px_hsl(var(--sidebar-border))]",
  "shadow-lg",
  "shadow-md",
  "shadow-none",
  "shadow-sm",
  "shadow-xl",
  "shadow-xs",
  "shrink",
  "shrink-0",
  "size-2",
  "size-2.5",
  "size-3.5",
  "size-4",
  "size-7",
  "size-9",
  "size-full",
  "sm:block",
  "sm:col-span-2",
  "sm:col-span-3",
  "sm:flex",
  "sm:flex-row",
  "sm:gap-0",
  "sm:gap-2",
  "sm:gap-3",
  "sm:gap-4",
  "sm:gap-6",
  "sm:gap-x-4",
  "sm:grid-cols-1",
  "sm:grid-cols-2",
  "sm:grid-cols-3",
  "sm:grid-cols-4",
  "sm:h-10",
  "sm:h-11",
  "sm:h-12",
  "sm:h-2",
  "sm:h-4",
  "sm:h-5",
  "sm:h-7",
  "sm:hidden",
  "sm:hover:scale-[1.02]",
  "sm:hover:shadow-lg",
  "sm:inline",
  "sm:items-center",
  "sm:justify-between",
  "sm:justify-end",
  "sm:left-4",
  "sm:line-clamp-1",
  "sm:max-h-24",
  "sm:max-h-32",
  "sm:max-h-40",
  "sm:max-w-[80%]",
  "sm:max-w-lg",
  "sm:max-w-md",
  "sm:max-w-none",
  "sm:max-w-sm",
  "sm:max-w-xs",
  "sm:mb-0",
  "sm:mb-2",
  "sm:mb-3",
  "sm:mb-4",
  "sm:min-h-[120px]",
  "sm:min-h-[3.5rem]",
  "sm:min-h-[3rem]",
  "sm:min-h-auto",
  "sm:min-w-[200px]",
  "sm:min-w-auto",
  "sm:ml-1",
  "sm:ml-2",
  "sm:ml-4",
  "sm:ml-8",
  "sm:mr-2",
  "sm:mr-8",
  "sm:mt-0",
  "sm:mt-2",
  "sm:mx-auto",
  "sm:p-10",
  "sm:p-2",
  "sm:p-3",
  "sm:p-4",
  "sm:p-6",
  "sm:pb-16",
  "sm:pb-3",
  "sm:pb-4",
  "sm:pb-6",
  "sm:pt-24",
  "sm:pt-4",
  "sm:pt-6",
  "sm:px-0",
  "sm:px-2",
  "sm:px-3",
  "sm:px-4",
  "sm:px-6",
  "sm:py-16",
  "sm:py-3",
  "sm:py-8",
  "sm:right-4",
  "sm:space-x-2",
  "sm:space-y-0",
  "sm:space-y-2",
  "sm:space-y-3",
  "sm:space-y-4",
  "sm:space-y-6",
  "sm:space-y-8",
  "sm:text-2xl",
  "sm:text-3xl",
  "sm:text-4xl",
  "sm:text-base",
  "sm:text-left",
  "sm:text-lg",
  "sm:text-sm",
  "sm:text-xl",
  "sm:top-4",
  "sm:w-10",
  "sm:w-12",
  "sm:w-2",
  "sm:w-4",
  "sm:w-5",
  "sm:w-7",
  "sm:w-80",
  "sm:w-auto",
  "sm:w-full",
  "space-x-1",
  "space-x-1.5",
  "space-x-2",
  "space-x-3",
  "space-x-4",
  "space-y-0",
  "space-y-0.5",
  "space-y-1",
  "space-y-1.5",
  "space-y-2",
  "space-y-3",
  "space-y-4",
  "space-y-6",
  "sr-only",
  "start",
  "static",
  "tabular-nums",
  "text-2xl",
  "text-3xl",
  "text-balance",
  "text-base",
  "text-blue-500",
  "text-blue-600",
  "text-blue-700",
  "text-blue-800",
  "text-card-foreground",
  "text-center",
  "text-current",
  "text-destructive",
  "text-emerald-600",
  "text-foreground",
  "text-gray-600",
  "text-gray-700",
  "text-gray-800",
  "text-green-500",
  "text-green-800",
  "text-left",
  "text-lg",
  "text-muted-foreground",
  "text-muted-foreground/60",
  "text-muted-foreground/70",
  "text-neutral-50",
  "text-orange-500",
  "text-orange-600",
  "text-popover-foreground",
  "text-primary",
  "text-primary-foreground",
  "text-primary-foreground/70",
  "text-purple-500",
  "text-purple-600",
  "text-purple-700",
  "text-red-500",
  "text-right",
  "text-rose-800",
  "text-secondary-foreground",
  "text-sidebar-foreground",
  "text-sidebar-foreground/70",
  "text-slate-600",
  "text-sm",
  "text-start",
  "text-transparent",
  "text-white",
  "text-xl",
  "text-xs",
  "text-yellow-500",
  "text-yellow-600",
  "text-yellow-800",
  "text-zinc-100",
  "to-muted/30",
  "to-pink-500",
  "to-purple-500/5",
  "to-purple-600",
  "top-0",
  "top-1.5",
  "top-1/2",
  "top-2",
  "top-3.5",
  "top-4",
  "top-[50%]",
  "touch-manipulation",
  "touch-none",
  "tracking-tight",
  "tracking-widest",
  "transform",
  "transition",
  "transition-[color,box-shadow]",
  "transition-[left,right,width]",
  "transition-[margin,opacity]",
  "transition-[width,height,padding]",
  "transition-[width]",
  "transition-all",
  "transition-colors",
  "transition-none",
  "transition-opacity",
  "transition-shadow",
  "transition-transform",
  "translate-x-[-50%]",
  "translate-x-px",
  "translate-y-[-50%]",
  "translate-y-[calc(-50%_-_2px)]",
  "truncate",
  "underline",
  "underline-offset-4",
  "uppercase",
  "via-background",
  "w-(--sidebar-width)",
  "w-1.5",
  "w-1/2",
  "w-1/4",
  "w-10",
  "w-12",
  "w-2",
  "w-2.5",
  "w-3",
  "w-3/4",
  "w-4",
  "w-5",
  "w-56",
  "w-6",
  "w-64",
  "w-72",
  "w-8",
  "w-80",
  "w-9",
  "w-[calc(100vw-2rem)]",
  "w-auto",
  "w-fit",
  "w-full",
  "whitespace-nowrap",
  "whitespace-pre-wrap",
  "z-10",
  "z-20",
  "z-50",
  "zoom-in-95",
]);
