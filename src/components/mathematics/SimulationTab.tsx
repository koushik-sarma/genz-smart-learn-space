import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { MathematicsChapter } from '@/types/mathematics';

interface SimulationTabProps {
  chapter: MathematicsChapter;
}

export function SimulationTab({ chapter }: SimulationTabProps) {
  // Map chapter names to simulation files
  const getSimulationFile = (chapterName: string) => {
    const simulations: { [key: string]: string } = {
      'Real Numbers': 'real-numbers.html',
      'Polynomials': 'polynomial.html',
      'Pair of Linear Equations in Two Variables': 'linear-equations.html',
      'Quadratic Equations': 'quadratic.html',
      'Arithmetic Progressions': 'AP-GP.html',
      'Triangles': 'similar-triangles.html',
      'Coordinate Geometry': 'coordinate-geometry.html',
      'Introduction to Trigonometry': 'trigonometry.html',
      'Some Applications of Trigonometry': 'trigonometry.html',
      'Circles': 'tangents.html',
      'Areas Related to Circles': 'mensuration.html',
      'Surface Areas and Volumes': 'mensuration.html',
      'Statistics': 'Statistics.html',
      'Probability': 'probability.html',
      'Sets': 'venn-diagrams.html'
    };
    
    return simulations[chapterName] || null;
  };

  const simulationFile = getSimulationFile(chapter.chapter);

  return (
    <div className="space-y-6">
      {simulationFile ? (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="h-6 w-6" />
              {chapter.chapter} Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src={`/${simulationFile}`}
              className="w-full h-[600px] border-0 rounded-b-lg"
              title={`${chapter.chapter} Simulation`}
              style={{ minHeight: '600px' }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="h-6 w-6" />
              Interactive Mathematics Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-300 mb-6">
              Explore mathematical concepts through interactive simulations and visualizations.
            </div>
            
            <div className="text-center py-8">
              <Play className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <div className="text-white text-lg mb-2">Simulation Coming Soon</div>
              <div className="text-gray-300">
                Interactive simulation for {chapter.chapter} will be available soon.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">🎯 Learning Objectives</h4>
                <p className="text-gray-300 text-sm">
                  Understand mathematical concepts through visual and interactive learning
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">🔬 Hands-on Practice</h4>
                <p className="text-gray-300 text-sm">
                  Practice problems with real-time feedback and step-by-step solutions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}