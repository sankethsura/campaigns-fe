"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium",
            "h-10 w-10 hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            "transition-colors"
          )}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={5}
        >
          <DropdownMenu.Item
            onClick={() => setTheme("light")}
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              "transition-colors"
            )}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setTheme("dark")}
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              "transition-colors"
            )}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setTheme("system")}
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              "transition-colors"
            )}
          >
            <span className="mr-2 h-4 w-4">💻</span>
            <span>System</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
