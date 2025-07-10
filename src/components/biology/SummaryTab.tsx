import { Card, CardContent } from '@/components/ui/card';
import SummaryCard from '../chemistry/SummaryCard';
import { BiologyChapterNotes } from '@/types/biology';

interface SummaryTabProps {
  notes: BiologyChapterNotes | null;
}

export default function SummaryTab({ notes }: SummaryTabProps) {
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

  return (
    <div className="space-y-6">
      <SummaryCard 
        title="Chapter Summary" 
        content={notes.chapter_summary} 
      />

      <SummaryCard 
        title="Key Takeaways" 
        content={notes.chapter_takeaways} 
      />

      <SummaryCard 
        title="Key Discussion Points" 
        content={notes.chapter_discussion_points} 
      />

      <SummaryCard 
        title="Important Points to Remember" 
        content={notes.chapter_points_to_remember}
      />

      <SummaryCard 
        title="Quick Recall" 
        content={notes.chapter_quick_recall} 
      />

      <SummaryCard 
        title="Important Diagrams" 
        content={notes.chapter_important_diagrams} 
      />
    </div>
  );
}