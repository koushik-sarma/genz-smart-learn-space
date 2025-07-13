import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SocialChapterNotes } from '@/types/social';

interface SummaryTabProps {
  notes: SocialChapterNotes | null;
}

export default function SocialSummaryTab({ notes }: SummaryTabProps) {
  if (!notes) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-center py-12">
        <CardContent>
          <div className="text-white text-lg mb-2">No notes available</div>
          <div className="text-gray-300">
            Notes for this chapter will be available soon.
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPointsList = (content: string) => {
    return content.split(/[;.]/).filter(point => point.trim()).map((point, index) => (
      <div key={index} className="flex items-start gap-2">
        <span className="text-purple-300 mt-1">•</span>
        <span>{point.trim()}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Chapter Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            {renderPointsList(notes.chapter_summary)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            {renderPointsList(notes.chapter_takeaways)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Key Discussion Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            {renderPointsList(notes.chapter_discussion_points)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Important Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-3">
            {notes.chapter_important_dates.split(/[;.]/).filter(date => date.trim()).map((date, index) => (
              <div key={index} className="bg-slate-800/50 p-3 rounded-md border border-white/10">
                <span className="text-purple-300 font-semibold">{date.trim()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Recall</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            {renderPointsList(notes.chapter_quick_recall)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Important Maps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-300 space-y-2">
            {renderPointsList(notes.chapter_map_points)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}