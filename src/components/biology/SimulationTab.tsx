import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BiologyChapter } from '@/types/biology';

interface SimulationTabProps {
  chapter: BiologyChapter;
}

export default function SimulationTab({ chapter }: SimulationTabProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Interactive Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="text-white text-lg mb-2">Simulation Coming Soon</div>
          <div className="text-gray-300">
            Interactive simulations for "{chapter.chapter}" will be available soon.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}