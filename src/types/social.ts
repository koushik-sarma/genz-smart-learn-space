export interface SocialChapter {
  social_chapter_id: number;
  chapter: string;
  chapter_description: string;
  part: string | null;
  class: number;
  board_id: number;
  subject_id: number;
}

export interface SocialChapterNotes {
  social_notes_id: number;
  chapter_discussion_points: string;
  chapter_important_dates: string;
  chapter_map_points: string;
  chapter_quick_recall: string;
  chapter_summary: string;
  chapter_takeaways: string;
  chapter_id: number;
  board_id: number;
  subject_id: number;
  part: string | null;
}