import { Search, Filter, SortAsc, Check, Paintbrush, Eye, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { statusStyles } from "./task-row"

interface BoardToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: string
  onSortChange: (option: string) => void
  filterStatus: string
  onFilterChange: (status: string) => void
}

export function BoardToolbar({ 
  searchQuery, onSearchChange, 
  sortOption, onSortChange, 
  filterStatus, onFilterChange 
}: BoardToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search..." 
          className="pl-9 h-9 bg-[#1c1e2d] border-slate-700/60 text-slate-200 placeholder:text-slate-500 rounded-lg" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Filter Button */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-9 rounded-lg border-slate-700/60 font-medium ${filterStatus && filterStatus !== "all" ? 'bg-[#0085ff] text-white hover:bg-[#0073ea] border-transparent' : 'bg-[#1c1e2d] text-slate-300 hover:text-white hover:bg-[#25283c]'}`}
            >
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              {(!filterStatus || filterStatus === "all") ? "Filter" : `Status: ${filterStatus}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] bg-[#242738] border-slate-700 text-slate-200">
            <DropdownMenuItem onSelect={() => onFilterChange("all")} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
              All Tasks {filterStatus === "all" && <Check className="h-4 w-4 text-[#0085ff]" />}
            </DropdownMenuItem>
            {Object.entries(statusStyles).filter(([s]) => s !== 'Complete').map(([s, style]) => (
              <DropdownMenuItem key={s} onSelect={() => onFilterChange(s)} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${style.bg}`} />
                  <span>{s}</span>
                </div>
                {filterStatus === s && <Check className="h-4 w-4 text-[#0085ff]" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 rounded-lg bg-[#1c1e2d] text-slate-300 hover:text-white hover:bg-[#25283c] border-slate-700/60 font-medium">
              <SortAsc className="mr-1.5 h-3.5 w-3.5" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] bg-[#242738] border-slate-700 text-slate-200">
            <DropdownMenuItem onSelect={() => onSortChange("default")} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
              Default Order {sortOption === "default" && <Check className="h-4 w-4 text-[#0085ff]" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("name-asc")} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
              Name (A-Z) {sortOption === "name-asc" && <Check className="h-4 w-4 text-[#0085ff]" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("name-desc")} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
              Name (Z-A) {sortOption === "name-desc" && <Check className="h-4 w-4 text-[#0085ff]" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("date-asc")} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
              Date (Oldest First) {sortOption === "date-asc" && <Check className="h-4 w-4 text-[#0085ff]" />}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange("date-desc")} className="flex items-center justify-between focus:bg-white/10 focus:text-white cursor-pointer">
              Date (Newest First) {sortOption === "date-desc" && <Check className="h-4 w-4 text-[#0085ff]" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
