import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw, 
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Quiz, QuizQuestion, QuizAnswer } from '@/types/content';

interface InlineQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  onSubmit: (answers: QuizAnswer[]) => void;
  onRetry?: () => void;
  maxAttempts: number;
  currentAttempt: number;
  timeLimit?: number; // in minutes
  className?: string;
}

interface QuizState {
  answers: Record<string, string | string[]>;
  timeRemaining: number;
  isSubmitted: boolean;
  showResults: boolean;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

const InlineQuizModal: React.FC<InlineQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onSubmit,
  onRetry,
  maxAttempts,
  currentAttempt,
  timeLimit,
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    answers: {},
    timeRemaining: timeLimit ? timeLimit * 60 : 0,
    isSubmitted: false,
    showResults: false,
    score: 0,
    maxScore: 0,
    correctAnswers: 0,
    totalQuestions: 0
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isOpen || !timeLimit || quizState.isSubmitted) return;

    const timer = setInterval(() => {
      setQuizState(prev => {
        if (prev.timeRemaining <= 1) {
          handleSubmit();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLimit, quizState.isSubmitted]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuizState({
        answers: {},
        timeRemaining: timeLimit ? timeLimit * 60 : 0,
        isSubmitted: false,
        showResults: false,
        score: 0,
        maxScore: 0,
        correctAnswers: 0,
        totalQuestions: quiz.questions.length
      });
      setCurrentQuestionIndex(0);
    }
  }, [isOpen, timeLimit, quiz.questions.length]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const handleSubmit = async () => {
    if (quizState.isSubmitted) return;

    setIsLoading(true);
    
    // Calculate score
    let score = 0;
    let correctAnswers = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    quiz.questions.forEach(question => {
      const userAnswer = quizState.answers[question.id];
      const isCorrect = checkAnswer(question, userAnswer);
      
      if (isCorrect) {
        score += question.points;
        correctAnswers++;
      }
    });

    setQuizState(prev => ({
      ...prev,
      isSubmitted: true,
      showResults: true,
      score,
      maxScore,
      correctAnswers
    }));

    // Create answers array for submission
    const answers: QuizAnswer[] = quiz.questions.map(question => ({
      question_id: question.id,
      answer: quizState.answers[question.id] || '',
      is_correct: checkAnswer(question, quizState.answers[question.id]),
      points_earned: checkAnswer(question, quizState.answers[question.id]) ? question.points : 0
    }));

    // Submit answers
    onSubmit(answers);
    setIsLoading(false);
  };

  const checkAnswer = (question: QuizQuestion, userAnswer: string | string[] | undefined): boolean => {
    if (!userAnswer) return false;

    if (Array.isArray(question.correct_answer)) {
      if (!Array.isArray(userAnswer)) return false;
      return question.correct_answer.every(answer => userAnswer.includes(answer)) &&
             userAnswer.every(answer => question.correct_answer.includes(answer));
    } else {
      return userAnswer === question.correct_answer;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const percentage = quizState.maxScore > 0 ? Math.round((quizState.score / quizState.maxScore) * 100) : 0;
  const passed = percentage >= 80; // Assuming 80% is passing

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {quiz.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                Attempt {currentAttempt} of {maxAttempts}
              </Badge>
              {timeLimit && (
                <Badge 
                  variant={quizState.timeRemaining < 60 ? "destructive" : "outline"}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {formatTime(quizState.timeRemaining)}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <Progress 
                value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
                className="w-24 h-2"
              />
            </div>
          </div>

          <Separator />

          {/* Quiz Results */}
          {quizState.showResults ? (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Score Summary */}
              <Card className={passed ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {passed ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <XCircle className="h-6 w-6 text-error" />
                    )}
                    Quiz Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                      {quizState.score} / {quizState.maxScore}
                    </div>
                    <div className={`text-2xl font-semibold mb-4 ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </div>
                    
                    <Badge 
                      variant={getScoreBadgeVariant(percentage)}
                      className="text-lg px-4 py-2"
                    >
                      {passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-foreground">
                        {quizState.correctAnswers}
                      </div>
                      <div className="text-sm text-muted-foreground">Correct Answers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-foreground">
                        {quiz.questions.length - quizState.correctAnswers}
                      </div>
                      <div className="text-sm text-muted-foreground">Incorrect Answers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Review */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = quizState.answers[question.id];
                  const isCorrect = checkAnswer(question, userAnswer);
                  
                  return (
                    <Card key={question.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-foreground">
                            Question {index + 1}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={isCorrect ? "default" : "destructive"}>
                              {isCorrect ? question.points : 0} / {question.points} pts
                            </Badge>
                            {isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-error" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-foreground mb-4">{question.question}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Your Answer:</span>
                            <p className={`mt-1 p-2 rounded ${
                              isCorrect 
                                ? "bg-success/10 text-success border border-success/20" 
                                : "bg-error/10 text-error border border-error/20"
                            }`}>
                              {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || 'No answer provided'}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Correct Answer:</span>
                            <p className="mt-1 p-2 bg-success/10 text-success border border-success/20 rounded">
                              {Array.isArray(question.correct_answer) 
                                ? question.correct_answer.join(", ") 
                                : question.correct_answer}
                            </p>
                          </div>
                          
                          {question.explanation && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Explanation:</span>
                              <p className="mt-1 p-2 bg-info/10 text-info border border-info/20 rounded">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                
                <div className="flex items-center gap-2">
                  {!passed && currentAttempt < maxAttempts && onRetry && (
                    <Button onClick={onRetry}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry Quiz
                    </Button>
                  )}
                  <Button onClick={onClose}>
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Quiz Questions */
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question {currentQuestionIndex + 1}</span>
                    <Badge variant="outline">
                      {currentQuestion.points} points
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-foreground">{currentQuestion.question}</p>
                  
                  {/* Multiple Choice */}
                  {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                    <RadioGroup
                      value={quizState.answers[currentQuestion.id] as string}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                          <Label htmlFor={`${currentQuestion.id}-${index}`} className="text-foreground">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {/* True/False */}
                  {currentQuestion.type === 'true_false' && (
                    <RadioGroup
                      value={quizState.answers[currentQuestion.id] as string}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${currentQuestion.id}-true`} />
                        <Label htmlFor={`${currentQuestion.id}-true`} className="text-foreground">
                          True
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${currentQuestion.id}-false`} />
                        <Label htmlFor={`${currentQuestion.id}-false`} className="text-foreground">
                          False
                        </Label>
                      </div>
                    </RadioGroup>
                  )}

                  {/* Short Answer */}
                  {currentQuestion.type === 'short_answer' && (
                    <Input
                      placeholder="Enter your answer..."
                      value={quizState.answers[currentQuestion.id] as string || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-8"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InlineQuizModal;
