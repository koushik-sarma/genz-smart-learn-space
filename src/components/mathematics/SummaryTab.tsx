import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MathematicsChapterNotes } from '@/types/mathematics';

interface SummaryTabProps {
  notes: MathematicsChapterNotes | null;
}

export function SummaryTab({ notes }: SummaryTabProps) {
  if (!notes) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardContent className="text-center py-12">
          <div className="text-white text-lg mb-2">No notes available</div>
          <div className="text-gray-300">
            Chapter notes will be available soon.
          </div>
        </CardContent>
      </Card>
    );
  }

  const sections = [
    {
      title: "Chapter Summary",
      content: notes.chapter_summary,
      icon: "📝"
    },
    {
      title: "Key Takeaways",
      content: notes.chapter_takeaways,
      icon: "🎯"
    },
    {
      title: "Key Discussion Points",
      content: notes.chapter_discussion_points,
      icon: "💬"
    },
    {
      title: "Formulae",
      content: notes.chapter_formulae,
      icon: "🧮"
    },
    {
      title: "Quick Recall",
      content: notes.chapter_quick_recall,
      icon: "⚡"
    },
    {
      title: "Important Diagrams",
      content: notes.chapter_important_diagrams,
      icon: "📊"
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">{section.icon}</span>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {section.content}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}