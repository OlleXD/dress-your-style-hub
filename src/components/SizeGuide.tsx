import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ruler } from 'lucide-react';

interface SizeGuideProps {
  gender?: 'Kvinnor' | 'Herrar' | null;
  category?: string;
}

const SizeGuide = ({ gender, category }: SizeGuideProps) => {
  const [open, setOpen] = useState(false);

  // Size guide data based on gender
  const sizeGuides = {
    Herrar: {
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { label: 'Bröst (cm)', values: ['92-96', '96-100', '100-104', '104-108', '108-112'] },
        { label: 'Midja (cm)', values: ['78-82', '82-86', '86-90', '90-94', '94-98'] },
        { label: 'Höft (cm)', values: ['92-96', '96-100', '100-104', '104-108', '108-112'] },
        { label: 'Innerseam (cm)', values: ['76', '78', '80', '82', '84'] },
      ],
    },
    Kvinnor: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: [
        { label: 'Bröst (cm)', values: ['80-84', '84-88', '88-92', '92-96', '96-100'] },
        { label: 'Midja (cm)', values: ['64-68', '68-72', '72-76', '76-80', '80-84'] },
        { label: 'Höft (cm)', values: ['88-92', '92-96', '96-100', '100-104', '104-108'] },
        { label: 'Innerseam (cm)', values: ['74', '76', '78', '80', '82'] },
      ],
    },
  };

  const guide = gender && gender in sizeGuides 
    ? sizeGuides[gender as keyof typeof sizeGuides]
    : sizeGuides.Kvinnor; // Default to women's sizes

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Ruler className="h-3 w-3 mr-1" />
          Storleksguide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Storleksguide</DialogTitle>
          <DialogDescription>
            {gender && `${gender} - `}
            {category || 'Allmän'} storleksguide
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Storlek</th>
                  {guide.sizes.map((size) => (
                    <th key={size} className="text-center p-2 font-semibold">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.measurements.map((measurement, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{measurement.label}</td>
                    {measurement.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="text-center p-2 text-sm">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold mb-2">Så här mäter du:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Bröst:</strong> Mät runt bröstets bredaste del</li>
              <li>• <strong>Midja:</strong> Mät runt midjan, där byxorna sitter</li>
              <li>• <strong>Höft:</strong> Mät runt höfternas bredaste del</li>
              <li>• <strong>Innerseam:</strong> Mät från insidan av benet från ljumsken till foten</li>
            </ul>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>OBS: Storlekar kan variera mellan olika märken och modeller. Vid osäkerhet, välj en storlek större.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;





