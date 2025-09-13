import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-ainstein-600 bg-ainstein-50 border-ainstein-200";
    case "medium":
      return "text-sunburst-600 bg-sunburst-50 border-sunburst-200";
    case "hard":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getScoreMessage(percentage: number): string {
  if (percentage >= 90) return "Outstanding! 🌟";
  if (percentage >= 80) return "Excellent work! 🎉";
  if (percentage >= 70) return "Great job! 👏";
  if (percentage >= 60) return "Good effort! 👍";
  if (percentage >= 50) return "Not bad! Keep practicing 💪";
  return "Keep learning! You'll get there 📚";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
