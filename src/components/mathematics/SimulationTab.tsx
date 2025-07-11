import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play } from 'lucide-react';
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
      'Probability': 'probability.html'
    };
    
    return simulations[chapterName] || null;
  };

  const simulationFile = getSimulationFile(chapter.chapter);

  const handleOpenSimulation = () => {
    if (simulationFile) {
      window.open(`/${simulationFile}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="h-6 w-6" />
            Interactive Mathematics Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-300">
            Explore mathematical concepts through interactive simulations and visualizations.
          </div>
          
          {simulationFile ? (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-2">Available Simulation</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Interactive simulation for {chapter.chapter}
                </p>
                <Button 
                  onClick={handleOpenSimulation}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Simulation
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-white text-lg mb-2">Simulation Coming Soon</div>
              <div className="text-gray-300">
                Interactive simulation for {chapter.chapter} will be available soon.
              </div>
            </div>
          )}

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
    </div>
  );
}