import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Ruler } from "lucide-react";

export interface Fossil {
  id: string;
  name: string;
  scientificName: string;
  geologicalArea: string;
  dateFound: string;
  size: string;
  sizeInCm: number;
  era: string;
  period: string;
  type: string;
  image: string;
  description: string;
}

interface FossilCardProps {
  fossil: Fossil;
}

export function FossilCard({ fossil }: FossilCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={fossil.image}
          alt={fossil.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute top-3 right-3 bg-black/80 text-white border-0">
          {fossil.era}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{fossil.name}</h3>
            <p className="text-sm text-neutral-500 italic">{fossil.scientificName}</p>
          </div>
          
          <p className="text-sm text-neutral-600 line-clamp-2">{fossil.description}</p>
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <MapPin className="w-4 h-4" />
              <span>{fossil.geologicalArea}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Calendar className="w-4 h-4" />
              <span>Found: {fossil.dateFound}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Ruler className="w-4 h-4" />
              <span>{fossil.size}</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className="text-xs">{fossil.period}</Badge>
            <Badge variant="outline" className="text-xs">{fossil.type}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
