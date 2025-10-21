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
  BookOpen,
  Target,
  Award,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            {quiz.title}
          </DialogTitle>
          {quiz.description && (
            <p className="text-muted-foreground mt-2">{quiz.description}</p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Quiz Header */}
          <motion.div 
            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                <RotateCcw className="h-4 w-4" />
                Attempt {currentAttempt} of {maxAttempts}
              </Badge>
              {timeLimit && (
                <Badge 
                  variant={quizState.timeRemaining < 60 ? "destructive" : "outline"}
                  className={`flex items-center gap-2 px-3 py-1 ${
                    quizState.timeRemaining < 60 ? 'animate-pulse' : ''
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {formatTime(quizState.timeRemaining)}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <div className="w-32">
                <Progress 
                  value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
                  className="h-3"
                />
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Quiz Results */}
          <AnimatePresence mode="wait">
            {quizState.showResults ? (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Enhanced Score Summary */}
                <Card className={`overflow-hidden ${
                  passed 
                    ? 'border-success/30 bg-gradient-to-br from-success/5 to-success/10' 
                    : 'border-error/30 bg-gradient-to-br from-error/5 to-error/10'
                }`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        passed ? 'bg-success/20' : 'bg-error/20'
                      }`}>
                        {passed ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : (
                          <XCircle className="h-6 w-6 text-error" />
                        )}
                      </div>
                      Quiz Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <motion.div 
                        className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        {quizState.score} / {quizState.maxScore}
                      </motion.div>
                      <motion.div 
                        className={`text-3xl font-semibold mb-4 ${getScoreColor(percentage)}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                      >
                        {percentage}%
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      >
                        <Badge 
                          variant={getScoreBadgeVariant(percentage)}
                          className={`text-lg px-6 py-2 ${
                            passed 
                              ? 'bg-success text-success-foreground' 
                              : 'bg-error text-error-foreground'
                          }`}
                        >
                          {passed ? (
                            <>
                              <Award className="h-4 w-4 mr-2" />
                              PASSED
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              FAILED
                            </>
                          )}
                        </Badge>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-card rounded-lg border"
                      >
                        <div className="text-3xl font-bold text-success mb-1">
                          {quizState.correctAnswers}
                        </div>
                        <div className="text-sm text-muted-foreground">Correct</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 bg-card rounded-lg border"
                      >
                        <div className="text-3xl font-bold text-error mb-1">
                          {quiz.questions.length - quizState.correctAnswers}
                        </div>
                        <div className="text-sm text-muted-foreground">Incorrect</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-4 bg-card rounded-lg border"
                      >
                        <div className="text-3xl font-bold text-primary mb-1">
                          {quiz.questions.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Question Review */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Question Review</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    {quiz.questions.map((question, index) => {
                      const userAnswer = quizState.answers[question.id];
                      const isCorrect = checkAnswer(question, userAnswer);
                      
                      return (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className={`overflow-hidden ${
                            isCorrect 
                              ? 'border-success/20 bg-success/5' 
                              : 'border-error/20 bg-error/5'
                          }`}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-semibold text-foreground text-lg">
                                  Question {index + 1}
                                </h4>
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    variant={isCorrect ? "default" : "destructive"}
                                    className={`px-3 py-1 ${
                                      isCorrect 
                                        ? 'bg-success text-success-foreground' 
                                        : 'bg-error text-error-foreground'
                                    }`}
                                  >
                                    {isCorrect ? question.points : 0} / {question.points} pts
                                  </Badge>
                                  {isCorrect ? (
                                    <CheckCircle className="h-5 w-5 text-success" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-error" />
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-foreground mb-6 text-lg leading-relaxed">{question.question}</p>
                              
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm font-semibold text-muted-foreground mb-2 block">Your Answer:</span>
                                  <div className={`p-3 rounded-lg border ${
                                    isCorrect 
                                      ? "bg-success/10 text-success border-success/30" 
                                      : "bg-error/10 text-error border-error/30"
                                  }`}>
                                    <p className="font-medium">
                                      {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || 'No answer provided'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-sm font-semibold text-muted-foreground mb-2 block">Correct Answer:</span>
                                  <div className="p-3 bg-success/10 text-success border border-success/30 rounded-lg">
                                    <p className="font-medium">
                                      {Array.isArray(question.correct_answer) 
                                        ? question.correct_answer.join(", ") 
                                        : question.correct_answer}
                                    </p>
                                  </div>
                                </div>
                                
                                {question.explanation && (
                                  <div>
                                    <span className="text-sm font-semibold text-muted-foreground mb-2 block">Explanation:</span>
                                    <div className="p-3 bg-info/10 text-info border border-info/30 rounded-lg">
                                      <p className="leading-relaxed">{question.explanation}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <motion.div 
                  className="flex items-center justify-between pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button variant="outline" onClick={onClose} size="lg">
                    Close
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    {!passed && currentAttempt < maxAttempts && onRetry && (
                      <Button onClick={onRetry} variant="outline" size="lg">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry Quiz
                      </Button>
                    )}
                    <Button onClick={onClose} size="lg" className="min-w-32">
                      {passed ? (
                        <>
                          <Award className="h-4 w-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>
                  </div>
                </motion.div>
            </motion.div>
            ) : (
              /* Enhanced Quiz Questions */
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{currentQuestionIndex + 1}</span>
                        </div>
                        <span className="text-xl">Question {currentQuestionIndex + 1}</span>
                      </div>
                      <Badge variant="outline" className="px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        {currentQuestion.points} points
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-xl text-foreground leading-relaxed">{currentQuestion.question}</p>
                  
                    {/* Enhanced Multiple Choice */}
                    {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                      <RadioGroup
                        value={quizState.answers[currentQuestion.id] as string}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        className="space-y-3"
                      >
                        {currentQuestion.options.map((option, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                            <Label 
                              htmlFor={`${currentQuestion.id}-${index}`} 
                              className="text-foreground cursor-pointer flex-1 text-lg"
                            >
                              {option}
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    )}

                    {/* Enhanced True/False */}
                    {currentQuestion.type === 'true_false' && (
                      <RadioGroup
                        value={quizState.answers[currentQuestion.id] as string}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        className="space-y-3"
                      >
                        <motion.div 
                          className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RadioGroupItem value="true" id={`${currentQuestion.id}-true`} />
                          <Label htmlFor={`${currentQuestion.id}-true`} className="text-foreground cursor-pointer flex-1 text-lg font-medium">
                            True
                          </Label>
                        </motion.div>
                        <motion.div 
                          className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RadioGroupItem value="false" id={`${currentQuestion.id}-false`} />
                          <Label htmlFor={`${currentQuestion.id}-false`} className="text-foreground cursor-pointer flex-1 text-lg font-medium">
                            False
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    )}

                    {/* Enhanced Short Answer */}
                    {currentQuestion.type === 'short_answer' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Your Answer:
                        </Label>
                        <Input
                          placeholder="Enter your answer..."
                          value={quizState.answers[currentQuestion.id] as string || ''}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="text-lg p-4"
                        />
                      </div>
                    )}
                </CardContent>
              </Card>

                  {/* Enhanced Navigation */}
                  <div className="flex items-center justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-3">
                      {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <Button 
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="px-8 min-w-40"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Submit Quiz
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          Next Question
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InlineQuizModal;
