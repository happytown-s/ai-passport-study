const BOOKMARKS_KEY = 'aipassport_bookmarks';

export function getBookmarks(): number[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(questionId: number): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(questionId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.push(questionId);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return idx < 0;
}

export function isBookmarked(questionId: number): boolean {
  return getBookmarks().includes(questionId);
}
