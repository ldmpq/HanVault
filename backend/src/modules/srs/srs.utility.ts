/**
 * Thuật toán Spaced Repetition (SuperMemo-2 Nâng Cao - Có xử lý Late Review & Capping)
 * @param quality Đánh giá chất lượng nhớ (0-5)
 * @param prevInterval Số ngày chờ của lần ôn tập trước
 * @param prevRepetitions Số lần lặp lại thành công liên tiếp
 * @param prevEaseFactor Hệ số độ dễ của từ vựng
 * @param daysSinceLastReview Số ngày THỰC TẾ trôi qua kể từ lần học cuối (Xử lý Late Review)
 */
export const calculateSM2 = (
  quality: number,
  prevInterval: number,
  prevRepetitions: number,
  prevEaseFactor: number,
  daysSinceLastReview: number = prevInterval
): { interval: number; repetitions: number; easeFactor: number } => {
  let interval = prevInterval;
  let repetitions = prevRepetitions;
  let easeFactor = prevEaseFactor;

  // Nếu người dùng đánh giá >= 3 (Nhớ đúng)
  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1; // Học lại vào ngày mai
    } else if (repetitions === 1) {
      interval = 6; // Lần 2 cách 6 ngày
    } else {
      const effectiveInterval = Math.max(prevInterval, daysSinceLastReview);
      interval = Math.round(effectiveInterval * easeFactor); 
    }
    repetitions++;
  } 
  // Nếu người dùng đánh giá < 3 (Quên hoặc Sai)
  else {
    repetitions = 0; // Reset streak liên tiếp
    interval = 1;    // Bắt buộc học lại vào ngày mai
  }

  // Cập nhật hệ số Ease Factor (EF)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (easeFactor < 1.3) easeFactor = 1.3;
  if (easeFactor > 3.0) easeFactor = 3.0; // Trần EF tối đa là 3.0 để tránh tăng quá đà

  const MAX_INTERVAL = 3650; // Giới hạn tối đa 10 năm (Tránh lỗi tràn số)
  if (interval > MAX_INTERVAL) interval = MAX_INTERVAL;

  return { interval, repetitions, easeFactor };
};