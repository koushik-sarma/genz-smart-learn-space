import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf } from 'lucide-react';
import { BiologyChapter } from '@/types/biology';

interface ChapterHeaderProps {
  chapter: BiologyChapter;
}

export default function ChapterHeader({ chapter }: ChapterHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/biology')}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Biology
      </Button>
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
          <Leaf className="h-8 w-8 text-white" />
        </div>
        <div className="text-white">
          <div className="text-sm text-green-300">Chapter {chapter.biology_chapter_id}</div>
          <h1 className="text-3xl font-bold">{chapter.chapter}</h1>
          <p className="text-gray-300">{chapter.chapter_description}</p>
        </div>
      </div>
    </div>
  );
}