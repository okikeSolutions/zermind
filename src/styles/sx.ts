import * as stylex from "@stylexjs/stylex";
import { supportedUtilities, utilityStyles } from "./generated-utilities.stylex";
import { isSafeStyleXUtility } from "./stylex-utility-policy";

type StyleInput = string | false | null | undefined;

export function sx(...inputs: StyleInput[]) {
  const utilities = inputs
    .filter((input): input is string => typeof input === "string")
    .flatMap((input) => input.trim().split(/\s+/))
    .filter(Boolean);
  const styleProps = stylex.props(
    utilities
      .filter((utility) => isSafeStyleXUtility(utility, supportedUtilities))
      .map((utility) => utilityStyles[utility as keyof typeof utilityStyles]),
  );
  const legacyClassName = utilities
    .filter((utility) => !isSafeStyleXUtility(utility, supportedUtilities))
    .join(" ");

  return {
    ...styleProps,
    className: [styleProps.className, legacyClassName].filter(Boolean).join(" ") || undefined,
  };
}
