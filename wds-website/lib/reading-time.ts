export function calculateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // average 200 WPM
  return minutes;
}
