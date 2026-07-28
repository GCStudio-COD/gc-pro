import { Search, Filter, SortAsc, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BoardToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: string
  onSortChange: (option: string) => void
  filterStatus: string
  onFilterChange: (status: string) => void
}

const statusColors: Record<string, string> = {
  "To Do": "bg-slate-500",
  "In Progress": "bg-orange-500",
  "Review": "bg-purple-500",
  "Approved": "bg-blue-500",
  "Done": "bg-green-500",
}

export function BoardToolbar({ 
  searchQuery, onSearchChange, 
  sortOption, onSortChange, 
  filterStatus, onFilterChange 
}: BoardToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search across all fields..." 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              {(!filterStatus || filterStatus === "all") ? "Filter" : `Status: ${filterStatus}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onSelect={() => onFilterChange("all")} className="flex items-center justify-between">
              All Tasks {filterStatus === "all" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {Object.entries(statusColors).map(([s, color]) => (
              <DropdownMenuItem key={s} onSelect={() => onFilterChange(s)} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  {s}
                </div>
                {filterStatus === s && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <SortAsc className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onSelect={() => onSortChange("default")} className="flex items-center justify-between">
              Default Order {sortOption === "default" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("name-asc")} className="flex items-center justify-between">
              Name (A-Z) {sortOption === "name-asc" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("name-desc")} className="flex items-center justify-between">
              Name (Z-A) {sortOption === "name-desc" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("date-asc")} className="flex items-center justify-between">
              Date (Oldest First) {sortOption === "date-asc" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("date-desc")} className="flex items-center justify-between">
              Date (Newest First) {sortOption === "date-desc" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
