import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={m.copy_change_color_theme()}
            title={m.copy_theme()}
          />
        }
      >
        {theme === "light" ? (
          <Sun key="light" size={ICON_SIZE} {...sx("text-muted-foreground")} />
        ) : theme === "dark" ? (
          <Moon key="dark" size={ICON_SIZE} {...sx("text-muted-foreground")} />
        ) : (
          <Laptop key="system" size={ICON_SIZE} {...sx("text-muted-foreground")} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={theme} onValueChange={(e) => setTheme(e)}>
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} {...sx("text-muted-foreground")} /> <span>{m.copy_light()}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} {...sx("text-muted-foreground")} /> <span>{m.copy_dark()}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} {...sx("text-muted-foreground")} />{" "}
            <span>{m.copy_system()}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
