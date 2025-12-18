import { useState, useEffect } from 'react';
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
import { useFenroSizeGuide } from '@/hooks/useFenroSizeGuide';

interface SizeGuideProps {
  sizeGuideId: string | null;
  productName?: string;
}

const SizeGuide = ({ sizeGuideId, productName }: SizeGuideProps) => {
  const [open, setOpen] = useState(false);
  const { sizeGuide, loading } = useFenroSizeGuide(sizeGuideId);

  if (!sizeGuideId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Ruler className="h-3 w-3 mr-1" />
          Storleksguide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Storleksguide{productName ? ` - ${productName}` : ''}</DialogTitle>
          <DialogDescription>
            {sizeGuide?.name || 'Storleksguide'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <p className="text-muted-foreground">Laddar storleksguide...</p>
          ) : sizeGuide ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      {sizeGuide.rows && sizeGuide.rows[0] && sizeGuide.rows[0].map((cell, index) => (
                        <th
                          key={index}
                          className={`text-left p-2 ${cell.bold ? 'font-semibold' : ''}`}
                        >
                          {cell.value}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.rows && sizeGuide.rows.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`p-2 ${cell.bold ? 'font-medium' : ''}`}
                          >
                            {cell.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2">Enhet: {sizeGuide.unit === 'metric' ? 'Metric (cm)' : 'Imperial (inches)'}</h4>
                <p className="text-sm text-muted-foreground">
                  Storlekar kan variera mellan olika märken och modeller. Vid osäkerhet, välj en storlek större.
                </p>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Storleksguide kunde inte laddas.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
