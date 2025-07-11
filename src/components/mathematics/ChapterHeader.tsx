import { Calculator } from 'lucide-react';
import { MathematicsChapter } from '@/types/mathematics';

interface ChapterHeaderProps {
  chapter: MathematicsChapter;
}

export function ChapterHeader({ chapter }: ChapterHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
        <Calculator className="h-10 w-10 text-white" />
      </div>
      <div className="text-white">
        <h1 className="text-4xl font-bold">{chapter.chapter}</h1>
        <p className="text-gray-300 text-lg mt-1">{chapter.chapter_description}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-purple-300">
          <span>Chapter {chapter.maths_chapter_id}</span>
          <span>Class {chapter.class}</span>
          {chapter.part && <span>Part: {chapter.part}</span>}
        </div>
      </div>
    </div>
  );
}