import { useQuiz } from './hooks/useQuiz';
import QuizDashboard from './components/QuizDashboard';
import QuizPlaying from './components/QuizPlaying';
import QuizResults from './components/QuizResults';

export default function Quiz() {
  const { quizState, quizzes, questions, results, isLoading, startQuiz, submitQuiz, resetQuiz } = useQuiz();

  return (
    <div className="w-full flex-1">
      {quizState === 'dashboard' && (
        <QuizDashboard quizzes={quizzes} isLoading={isLoading} onStart={startQuiz} />
      )}

      {quizState === 'playing' && (
        <QuizPlaying questions={questions} isLoading={isLoading} onFinish={submitQuiz} />
      )}

      {quizState === 'results' && (
        <QuizResults results={results} onRetry={resetQuiz} />
      )}
    </div>
  );
}