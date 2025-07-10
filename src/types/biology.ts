export interface BiologyChapterNotes {
  biology_notes_id: number;
  chapter_summary: string;
  chapter_takeaways: string;
  chapter_discussion_points: string;
  chapter_points_to_remember: string;
  chapter_quick_recall: string;
  chapter_important_diagrams: string;
  chapter_id: number;
  board_id: number;
  subject_id: number;
}

export interface BiologyChapter {
  physic_biology_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}