export interface MathematicsChapterNotes {
  maths_notes_id: number;
  chapter_summary: string;
  chapter_takeaways: string;
  chapter_discussion_points: string;
  chapter_formulae: string;
  chapter_quick_recall: string;
  chapter_important_diagrams: string;
  chapter_id: number;
  board_id: number;
  subject_id: number;
}

export interface MathematicsChapter {
  math_chapter_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}