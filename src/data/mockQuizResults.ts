import type { QuizResult } from '@/types/content';

export const mockQuizResult: QuizResult = {
  id: '1',
  quiz_id: 'quiz-1',
  user_id: 'user-1',
  course_id: 'course-1',
  attempt_id: 'attempt-1',
  score: 8,
  max_score: 10,
  percentage: 80,
  passed: true,
  attempts_used: 1,
  max_attempts: 3,
  attempts_remaining: 2,
  time_taken: 300, // 5 minutes
  completed_at: new Date().toISOString(),
  questions: [
    {
      id: '1',
      question: 'What is the correct procedure for starting the machine?',
      type: 'multiple_choice',
      user_answer: 'Press the green button',
      correct_answer: 'Press the green button',
      is_correct: true,
      points_earned: 2,
      max_points: 2,
      explanation: 'The green button is the correct way to start the machine safely.',
      remediation_clip_id: 'clip-1'
    },
    {
      id: '2',
      question: 'What safety equipment should be worn?',
      type: 'multiple_choice',
      user_answer: 'Safety glasses only',
      correct_answer: 'Safety glasses and hard hat',
      is_correct: false,
      points_earned: 0,
      max_points: 2,
      explanation: 'Both safety glasses and hard hat are required for this operation.',
      remediation_clip_id: 'clip-2'
    },
    {
      id: '3',
      question: 'How often should the machine be inspected?',
      type: 'multiple_choice',
      user_answer: 'Daily',
      correct_answer: 'Daily',
      is_correct: true,
      points_earned: 2,
      max_points: 2,
      explanation: 'Daily inspection ensures the machine is in proper working condition.',
      remediation_clip_id: 'clip-3'
    },
    {
      id: '4',
      question: 'What should you do if you notice unusual vibrations?',
      type: 'multiple_choice',
      user_answer: 'Continue operating',
      correct_answer: 'Stop immediately and report',
      is_correct: false,
      points_earned: 0,
      max_points: 2,
      explanation: 'Unusual vibrations can indicate a serious problem. Stop immediately and report to maintenance.',
      remediation_clip_id: 'clip-4'
    },
    {
      id: '5',
      question: 'What is the maximum operating temperature?',
      type: 'multiple_choice',
      user_answer: '150°C',
      correct_answer: '150°C',
      is_correct: true,
      points_earned: 2,
      max_points: 2,
      explanation: 'The machine should not exceed 150°C during normal operation.',
      remediation_clip_id: 'clip-5'
    }
  ],
  certificate_eligible: true,
  certificate_id: 'cert-1'
};

export const mockRetakeOptions = {
  allowed: true,
  available_at: new Date().toISOString(),
  cooldown_hours: 0,
  max_attempts: 3,
  attempts_used: 1,
  next_attempt_allowed: true,
  reason: undefined
};