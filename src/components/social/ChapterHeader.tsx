import { BookOpen } from 'lucide-react';
import type { SocialChapter } from '@/types/social';

interface ChapterHeaderProps {
  chapter: SocialChapter;
}

export default function SocialChapterHeader({ chapter }: ChapterHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
        <BookOpen className="h-8 w-8 text-white" />
      </div>
      <div className="text-white">
        <div className="text-sm text-purple-300">Chapter {chapter.social_chapter_id}</div>
        <h1 className="text-3xl font-bold">{chapter.chapter}</h1>
        <p className="text-gray-300">{chapter.chapter_description}</p>
        {chapter.part && (
          <div className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full inline-block mt-1">
            Part: {chapter.part}
          </div>
        )}
      </div>
    </div>
  );
}