import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BiologyChapter } from '@/types/biology';

interface SimulationTabProps {
  chapter: BiologyChapter;
}

export default function SimulationTab({ chapter }: SimulationTabProps) {
  const getSimulationFile = (chapterName: string): string | null => {
    const simulationMap: { [key: string]: string } = {
      'Nutrition': 'nutrition.html',
      'Respiration': 'respiration.html',
      'Coordination': 'respiration.html',
      'Circulation': 'circulation-excretion.html',
      'Excretion': 'circulation-excretion.html',
      'Chapter 6': 'heridity.html',
      'Chapter 8': 'heridity.html',
      'Chapter 9': 'heridity.html',
      'Chapter 10': 'heridity.html',
      'Heredity': 'heridity.html'
    };

    // Check for exact match first
    if (simulationMap[chapterName]) {
      return simulationMap[chapterName];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(simulationMap)) {
      if (chapterName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(chapterName.toLowerCase())) {
        return value;
      }
    }

    return null;
  };

  const simulationFile = getSimulationFile(chapter.chapter);

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Interactive Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        {simulationFile ? (
          <div className="w-full h-[600px] rounded-lg overflow-hidden">
            <iframe
              src={`/${simulationFile}`}
              className="w-full h-full border-0"
              title={`${chapter.chapter} Simulation`}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white text-lg mb-2">Simulation Coming Soon</div>
            <div className="text-gray-300">
              Interactive simulations for "{chapter.chapter}" will be available soon.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}