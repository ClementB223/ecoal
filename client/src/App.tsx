import { useState, useMemo } from "react";
import { FossilCard, Fossil } from "./components/FossilCard";
import { FilterSidebar } from "./components/FilterSidebar";
import { Shell } from "lucide-react";

// Mock fossil data
const fossils: Fossil[] = [
  {
    id: "1",
    name: "Tyrannosaurus Rex Bone",
    scientificName: "Tyrannosaurus rex",
    geologicalArea: "North America",
    dateFound: "1998",
    size: "145 cm",
    sizeInCm: 145,
    era: "Mesozoic",
    period: "Late Cretaceous",
    type: "Dinosaur",
    image: "https://images.unsplash.com/photo-1651980802497-2ad4b4adbb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBkaW5vc2F1ciUyMGJvbmV8ZW58MXx8fHwxNzczMDYyNTcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Massive femur bone from one of the largest carnivorous dinosaurs to ever exist, showing remarkable preservation.",
  },
  {
    id: "2",
    name: "Ammonite Spiral",
    scientificName: "Dactylioceras commune",
    geologicalArea: "Europe",
    dateFound: "2005",
    size: "12 cm",
    sizeInCm: 12,
    era: "Mesozoic",
    period: "Jurassic",
    type: "Cephalopod",
    image: "https://images.unsplash.com/photo-1631631648709-63b2c999cb82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbW1vbml0ZSUyMGZvc3NpbCUyMHNwaXJhbHxlbnwxfHx8fDE3NzMwNjI1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Beautiful spiral shell fossil displaying intricate chambers, an extinct marine cephalopod from ancient seas.",
  },
  {
    id: "3",
    name: "Trilobite",
    scientificName: "Calymene blumenbachii",
    geologicalArea: "Asia",
    dateFound: "2012",
    size: "8 cm",
    sizeInCm: 8,
    era: "Paleozoic",
    period: "Silurian",
    type: "Arthropod",
    image: "https://images.unsplash.com/photo-1622417934900-ae335a0a0726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlsb2JpdGUlMjBmb3NzaWwlMjBhbmNpZW50fGVufDF8fHx8MTc3MzA2MjU3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Exceptionally preserved trilobite showing detailed segmentation, from one of Earth's most successful ancient arthropods.",
  },
  {
    id: "4",
    name: "Fern Leaf Impression",
    scientificName: "Neuropteris flexuosa",
    geologicalArea: "North America",
    dateFound: "2015",
    size: "25 cm",
    sizeInCm: 25,
    era: "Paleozoic",
    period: "Carboniferous",
    type: "Plant",
    image: "https://images.unsplash.com/photo-1672153902713-28e0a02acdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJuJTIwbGVhZiUyMGZvc3NpbHxlbnwxfHx8fDE3NzMwNjI1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Delicate fern fossil from the coal forests, showcasing intricate leaf venation patterns preserved in stone.",
  },
  {
    id: "5",
    name: "Ancient Fish Skeleton",
    scientificName: "Knightia eocaena",
    geologicalArea: "North America",
    dateFound: "2008",
    size: "18 cm",
    sizeInCm: 18,
    era: "Cenozoic",
    period: "Eocene",
    type: "Fish",
    image: "https://images.unsplash.com/photo-1711076098518-0b3b8cb3b058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBmaXNoJTIwc2tlbGV0b258ZW58MXx8fHwxNzczMDYyNTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Complete fish fossil from ancient lake deposits, showing remarkable detail including fins and scales.",
  },
  {
    id: "6",
    name: "Mammoth Tusk Fragment",
    scientificName: "Mammuthus primigenius",
    geologicalArea: "Europe",
    dateFound: "2001",
    size: "85 cm",
    sizeInCm: 85,
    era: "Cenozoic",
    period: "Pleistocene",
    type: "Mammal",
    image: "https://images.unsplash.com/photo-1765969933968-b30694385e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW1tb3RoJTIwZm9zc2lsJTIwdHVza3xlbnwxfHx8fDE3NzMwNjI1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Impressive woolly mammoth tusk showing growth rings and excellent mineral preservation from the Ice Age.",
  },
  {
    id: "7",
    name: "Fossilized Shell",
    scientificName: "Pecten maximus",
    geologicalArea: "Africa",
    dateFound: "2018",
    size: "9 cm",
    sizeInCm: 9,
    era: "Cenozoic",
    period: "Miocene",
    type: "Mollusk",
    image: "https://images.unsplash.com/photo-1743769446654-0b479b4fa126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBzaGVsbCUyMGFuY2llbnR8ZW58MXx8fHwxNzczMDYyNTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Pristine scallop shell fossil with visible growth lines and original shell texture preserved in limestone.",
  },
  {
    id: "8",
    name: "Prehistoric Stone Fossil",
    scientificName: "Orthoceras regulare",
    geologicalArea: "Asia",
    dateFound: "2020",
    size: "32 cm",
    sizeInCm: 32,
    era: "Paleozoic",
    period: "Ordovician",
    type: "Cephalopod",
    image: "https://images.unsplash.com/photo-1759850426022-2c7ba6d03b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVoaXN0b3JpYyUyMGZvc3NpbCUyMHN0b25lfGVufDF8fHx8MTc3MzA2MjU3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Elongated straight-shelled nautiloid showing internal chamber structure, polished to reveal internal details.",
  },
  {
    id: "9",
    name: "Stegosaurus Plate",
    scientificName: "Stegosaurus stenops",
    geologicalArea: "North America",
    dateFound: "1992",
    size: "52 cm",
    sizeInCm: 52,
    era: "Mesozoic",
    period: "Late Jurassic",
    type: "Dinosaur",
    image: "https://images.unsplash.com/photo-1651980802497-2ad4b4adbb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBkaW5vc2F1ciUyMGJvbmV8ZW58MXx8fHwxNzczMDYyNTcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "One of the distinctive back plates from a Stegosaurus, showing the bone structure and vascular grooves.",
  },
  {
    id: "10",
    name: "Belemnite Rostrum",
    scientificName: "Belemnitella americana",
    geologicalArea: "Europe",
    dateFound: "2010",
    size: "7 cm",
    sizeInCm: 7,
    era: "Mesozoic",
    period: "Cretaceous",
    type: "Cephalopod",
    image: "https://images.unsplash.com/photo-1631631648709-63b2c999cb82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbW1vbml0ZSUyMGZvc3NpbCUyMHNwaXJhbHxlbnwxfHx8fDE3NzMwNjI1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Bullet-shaped internal shell from an extinct squid-like creature, often called 'thunderstones' in folklore.",
  },
  {
    id: "11",
    name: "Crinoid Stem",
    scientificName: "Pentacrinites fossilis",
    geologicalArea: "Africa",
    dateFound: "2014",
    size: "15 cm",
    sizeInCm: 15,
    era: "Mesozoic",
    period: "Jurassic",
    type: "Echinoderm",
    image: "https://images.unsplash.com/photo-1622417934900-ae335a0a0726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlsb2JpdGUlMjBmb3NzaWwlMjBhbmNpZW50fGVufDF8fHx8MTc3MzA2MjU3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Segmented stem from a sea lily, showing the distinctive stacked disc-like structure of this ancient animal.",
  },
  {
    id: "12",
    name: "Saber-Toothed Cat Canine",
    scientificName: "Smilodon fatalis",
    geologicalArea: "South America",
    dateFound: "2003",
    size: "22 cm",
    sizeInCm: 22,
    era: "Cenozoic",
    period: "Pleistocene",
    type: "Mammal",
    image: "https://images.unsplash.com/photo-1765969933968-b30694385e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW1tb3RoJTIwZm9zc2lsJTIwdHVza3xlbnwxfHx8fDE3NzMwNjI1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Iconic elongated canine tooth from the famous ice age predator, showing wear patterns from hunting.",
  },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: 1800, end: 2026 });
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 200]);

  const availableAreas = useMemo(() => {
    const areas = new Set(fossils.map((f) => f.geologicalArea));
    return Array.from(areas).sort();
  }, []);

  const maxSize = useMemo(() => {
    return Math.max(...fossils.map((f) => f.sizeInCm));
  }, []);

  const filteredFossils = useMemo(() => {
    return fossils.filter((fossil) => {
      const matchesSearch =
        searchTerm === "" ||
        fossil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fossil.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea =
        selectedAreas.length === 0 ||
        selectedAreas.includes(fossil.geologicalArea);

      const fossilYear = parseInt(fossil.dateFound);
      const matchesDate =
        fossilYear >= dateRange.start && fossilYear <= dateRange.end;

      const matchesSize =
        fossil.sizeInCm >= sizeRange[0] && fossil.sizeInCm <= sizeRange[1];

      return matchesSearch && matchesArea && matchesDate && matchesSize;
    });
  }, [searchTerm, selectedAreas, dateRange, sizeRange]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedAreas([]);
    setDateRange({ start: 1800, end: 2026 });
    setSizeRange([0, maxSize]);
  };

  return (
    <div className="flex h-screen bg-white">
      <FilterSidebar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedAreas={selectedAreas}
        onAreasChange={setSelectedAreas}
        availableAreas={availableAreas}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        sizeRange={sizeRange}
        onSizeRangeChange={setSizeRange}
        maxSize={maxSize}
        onReset={handleReset}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Shell className="w-8 h-8 text-amber-700" />
            <h1 className="text-3xl font-bold">Remarkable Fossils</h1>
          </div>
          <p className="text-neutral-600">
            Explore our extraordinary collection of prehistoric treasures from around the world
          </p>
          <div className="mt-3 text-sm text-neutral-500">
            Showing {filteredFossils.length} of {fossils.length} fossils
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          {filteredFossils.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFossils.map((fossil) => (
                <FossilCard key={fossil.id} fossil={fossil} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Shell className="w-16 h-16 text-neutral-300 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                No fossils found
              </h3>
              <p className="text-neutral-500 mb-4">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
