import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Copy, 
  FileText,
  Settings,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Quiz, QuizQuestion } from '@/types/content';
import { toast } from 'sonner';

interface QuizEditorProps {
  onQuizCreate: (quiz: Quiz) => void;
  existingQuiz?: Quiz;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ onQuizCreate, existingQuiz }) => {
  const [quiz, setQuiz] = useState<Quiz>(existingQuiz || {
    id: '',
    title: '',
    description: '',
    questions: [],
    settings: {
      time_limit: undefined,
      shuffle_questions: false,
      shuffle_options: false,
      show_correct_answers: true,
      allow_review: true,
      max_attempts: 3
    },
    created_at: '',
    updated_at: ''
  });

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

  const handleAddQuestion = (type: 'multiple_choice' | 'short_answer' | 'true_false') => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      type,
      question: '',
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
      correct_answer: type === 'multiple_choice' ? '' : type === 'true_false' ? 'true' : '',
      explanation: '',
      points: 1,
      order: quiz.questions.length
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setActiveQuestionIndex(quiz.questions.length);
    toast.success('Question added');
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    
    if (activeQuestionIndex !== null && activeQuestionIndex >= quiz.questions.length - 1) {
      setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
    }
    
    toast.success('Question deleted');
  };

  const handleDuplicateQuestion = (questionId: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const duplicatedQuestion: QuizQuestion = {
      ...question,
      id: `question-${Date.now()}`,
      order: quiz.questions.length
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, duplicatedQuestion]
    }));

    toast.success('Question duplicated');
  };

  const handleSaveQuiz = () => {
    if (!quiz.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (quiz.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const quizToSave = {
      ...quiz,
      id: quiz.id || `quiz-${Date.now()}`,
      updated_at: new Date().toISOString()
    };

    onQuizCreate(quizToSave);
    toast.success('Quiz saved successfully');
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'A';
      case 'short_answer': return 'T';
      case 'true_false': return 'T/F';
      default: return '?';
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800';
      case 'short_answer': return 'bg-green-100 text-green-800';
      case 'true_false': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Quiz Editor</h2>
          <p className="text-sm text-muted-foreground">
            Create and edit quiz questions for your course
          </p>
        </div>
        <Button onClick={handleSaveQuiz}>
          <Save className="h-4 w-4 mr-2" />
          Save Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Quiz Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quiz-title">Title</Label>
                <Input
                  id="quiz-title"
                  value={quiz.title}
                  onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <Label htmlFor="quiz-description">Description</Label>
                <Textarea
                  id="quiz-description"
                  value={quiz.description}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    value={quiz.settings.time_limit || ''}
                    onChange={(e) => setQuiz(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        time_limit: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    }))}
                    placeholder="No limit"
                  />
                </div>

                <div>
                  <Label htmlFor="max-attempts">Max Attempts</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    value={quiz.settings.max_attempts}
                    onChange={(e) => setQuiz(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        max_attempts: parseInt(e.target.value) || 1
                      }
                    }))}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shuffle-questions"
                      checked={quiz.settings.shuffle_questions}
                      onCheckedChange={(checked) => setQuiz(prev => ({
                        ...prev,
                        settings: { ...prev.settings, shuffle_questions: !!checked }
                      }))}
                    />
                    <Label htmlFor="shuffle-questions">Shuffle Questions</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shuffle-options"
                      checked={quiz.settings.shuffle_options}
                      onCheckedChange={(checked) => setQuiz(prev => ({
                        ...prev,
                        settings: { ...prev.settings, shuffle_options: !!checked }
                      }))}
                    />
                    <Label htmlFor="shuffle-options">Shuffle Options</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-correct-answers"
                      checked={quiz.settings.show_correct_answers}
                      onCheckedChange={(checked) => setQuiz(prev => ({
                        ...prev,
                        settings: { ...prev.settings, show_correct_answers: !!checked }
                      }))}
                    />
                    <Label htmlFor="show-correct-answers">Show Correct Answers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow-review"
                      checked={quiz.settings.allow_review}
                      onCheckedChange={(checked) => setQuiz(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allow_review: !!checked }
                      }))}
                    />
                    <Label htmlFor="allow-review">Allow Review</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Questions ({quiz.questions.length})</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddQuestion('multiple_choice')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Multiple Choice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddQuestion('short_answer')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Short Answer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddQuestion('true_false')}
              >
                <Plus className="h-4 w-4 mr-2" />
                True/False
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {quiz.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      activeQuestionIndex === index 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveQuestionIndex(index)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getQuestionTypeColor(question.type)}`}>
                            {getQuestionTypeIcon(question.type)}
                          </div>
                          <div>
                            <CardTitle className="text-sm">
                              Question {index + 1}
                              {question.question && (
                                <span className="text-muted-foreground ml-2">
                                  - {question.question.substring(0, 50)}...
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {question.type.replace('_', ' ').toUpperCase()} • {question.points} point{question.points !== 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateQuestion(question.id);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {activeQuestionIndex === index && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Question Text */}
                          <div>
                            <Label htmlFor={`question-${question.id}`}>Question</Label>
                            <Textarea
                              id={`question-${question.id}`}
                              value={question.question}
                              onChange={(e) => handleUpdateQuestion(question.id, { question: e.target.value })}
                              placeholder="Enter your question..."
                              rows={2}
                            />
                          </div>

                          {/* Question Type Specific Fields */}
                          {question.type === 'multiple_choice' && (
                            <div className="space-y-3">
                              <Label>Options</Label>
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <RadioGroup
                                    value={question.correct_answer as string}
                                    onValueChange={(value) => handleUpdateQuestion(question.id, { correct_answer: value })}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                                      <Input
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...(question.options || [])];
                                          newOptions[optionIndex] = e.target.value;
                                          handleUpdateQuestion(question.id, { options: newOptions });
                                        }}
                                        placeholder={`Option ${optionIndex + 1}`}
                                      />
                                    </div>
                                  </RadioGroup>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'true_false' && (
                            <div>
                              <Label>Correct Answer</Label>
                              <RadioGroup
                                value={question.correct_answer as string}
                                onValueChange={(value) => handleUpdateQuestion(question.id, { correct_answer: value })}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="true" id={`${question.id}-true`} />
                                  <Label htmlFor={`${question.id}-true`}>True</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="false" id={`${question.id}-false`} />
                                  <Label htmlFor={`${question.id}-false`}>False</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}

                          {question.type === 'short_answer' && (
                            <div>
                              <Label htmlFor={`answer-${question.id}`}>Correct Answer</Label>
                              <Input
                                id={`answer-${question.id}`}
                                value={question.correct_answer as string}
                                onChange={(e) => handleUpdateQuestion(question.id, { correct_answer: e.target.value })}
                                placeholder="Enter the correct answer..."
                              />
                            </div>
                          )}

                          {/* Points and Explanation */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`points-${question.id}`}>Points</Label>
                              <Input
                                id={`points-${question.id}`}
                                type="number"
                                value={question.points}
                                onChange={(e) => handleUpdateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                                min="1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`explanation-${question.id}`}>Explanation (Optional)</Label>
                            <Textarea
                              id={`explanation-${question.id}`}
                              value={question.explanation || ''}
                              onChange={(e) => handleUpdateQuestion(question.id, { explanation: e.target.value })}
                              placeholder="Explain why this is the correct answer..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {quiz.questions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No questions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first question to get started
                </p>
                <div className="flex justify-center space-x-2">
                  <Button onClick={() => handleAddQuestion('multiple_choice')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Multiple Choice
                  </Button>
                  <Button variant="outline" onClick={() => handleAddQuestion('short_answer')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Short Answer
                  </Button>
                  <Button variant="outline" onClick={() => handleAddQuestion('true_false')}>
                    <Plus className="h-4 w-4 mr-2" />
                    True/False
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
