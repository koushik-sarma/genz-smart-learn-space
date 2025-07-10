import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { Chapter } from '@/types/chemistry';

interface SimulationTabProps {
  chapter: Chapter;
}

export default function SimulationTab({ chapter }: SimulationTabProps) {
  const simulationMap: Record<string, string> = {
    'Chemical Reactions and Equations': 'chemical-equations.html',
    'Acids, Bases and Salts': 'acids-bases.html',
    'Structure of Atom': 'structure-of-atom.html',
    'Classification of Elements - The Periodic Table': 'periodic-table.html',
    'Chemical Bonding': 'molecule-builder.html',
    'Principle of Metallurgy': 'metallurgy.html'
  };

  const simulationFile = simulationMap[chapter.chapter];

  if (simulationFile) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
        <CardContent className="p-0">
          <iframe
            src={`/${simulationFile}`}
            className="w-full h-[600px] border-0"
            title={`${chapter.chapter} Simulation`}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
      <CardContent>
        <Zap className="h-16 w-16 text-purple-300 mx-auto mb-4" />
        <div className="text-white text-lg mb-2">Interactive Simulation</div>
        <div className="text-gray-300 mb-4">
          Simulation for {chapter.chapter} coming soon
        </div>
      </CardContent>
    </Card>
  );
}