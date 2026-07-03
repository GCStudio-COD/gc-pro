"use client"

import { Input } from "./input"
import { SearchIcon } from "lucide-react"
import { ComponentProps, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface SearchProps extends ComponentProps<"input"> {}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className={cn("pl-8", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Search.displayName = "Search"
