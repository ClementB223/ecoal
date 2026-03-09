import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Search, MapPin, Calendar, Ruler, Filter } from "lucide-react";
import { Button } from "./ui/button";

interface FilterSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAreas: string[];
  onAreasChange: (areas: string[]) => void;
  availableAreas: string[];
  dateRange: { start: number; end: number };
  onDateRangeChange: (range: { start: number; end: number }) => void;
  sizeRange: [number, number];
  onSizeRangeChange: (range: [number, number]) => void;
  maxSize: number;
  onReset: () => void;
}

export function FilterSidebar({
  searchTerm,
  onSearchChange,
  selectedAreas,
  onAreasChange,
  availableAreas,
  dateRange,
  onDateRangeChange,
  sizeRange,
  onSizeRangeChange,
  maxSize,
  onReset,
}: FilterSidebarProps) {
  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      onAreasChange(selectedAreas.filter((a) => a !== area));
    } else {
      onAreasChange([...selectedAreas, area]);
    }
  };

  return (
    <div className="w-80 border-r bg-neutral-50 p-6 flex flex-col h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Filters</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full"
        >
          Reset All Filters
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6">
          {/* Search by Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search by Name
            </Label>
            <Input
              type="text"
              placeholder="Search fossils..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white"
            />
          </div>

          <Separator />

          {/* Geological Area */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Geological Area
            </Label>
            <div className="space-y-2">
              {availableAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={selectedAreas.includes(area)}
                    onCheckedChange={() => handleAreaToggle(area)}
                  />
                  <label
                    htmlFor={area}
                    className="text-sm cursor-pointer select-none"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Found Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Found
            </Label>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={1800}
                  max={2026}
                  value={dateRange.start}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      start: Number(e.target.value),
                    })
                  }
                  className="w-20 bg-white"
                />
                <span className="text-sm text-neutral-500">to</span>
                <Input
                  type="number"
                  min={1800}
                  max={2026}
                  value={dateRange.end}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      end: Number(e.target.value),
                    })
                  }
                  className="w-20 bg-white"
                />
              </div>
              <p className="text-xs text-neutral-500">
                {dateRange.start} - {dateRange.end}
              </p>
            </div>
          </div>

          <Separator />

          {/* Size Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Size (cm)
            </Label>
            <div className="space-y-3 pt-2">
              <Slider
                min={0}
                max={maxSize}
                step={1}
                value={sizeRange}
                onValueChange={(value) => onSizeRangeChange(value as [number, number])}
                className="w-full"
              />
              <p className="text-sm text-neutral-600">
                {sizeRange[0]} cm - {sizeRange[1]} cm
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
