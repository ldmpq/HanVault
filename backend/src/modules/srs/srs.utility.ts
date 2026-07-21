/**
 * Thuật toán Spaced Repetition (SuperMemo-2)
 * @param quality Đánh giá chất lượng nhớ (0-5)
 * @param prevInterval Số ngày chờ của lần ôn tập trước
 * @param prevRepetitions Số lần lặp lại thành công liên tiếp
 * @param prevEaseFactor Hệ số độ dễ của từ vựng
 */
export const calculateSM2 = (
  quality: number,
  prevInterval: number,
  prevRepetitions: number,
  prevEaseFactor: number
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
      interval = Math.round(interval * easeFactor); // Các lần sau nhân với hệ số
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
  
  // EF không bao giờ được phép tụt xuống dưới 1.3 (để tránh vòng lặp ôn tập vô tận)
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return { interval, repetitions, easeFactor };
};