import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, RotateCcw, Download, Share, ExternalLink, Play } from 'lucide-react';
import { mockQuizResult, mockRetakeOptions } from '@/data/mockQuizResults';
import type { QuizResult } from '@/types/content';

const QuizCertificatePage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string; attemptId: string }>();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retakeOptions] = useState(mockRetakeOptions);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(mockQuizResult);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <div className="h-8 bg-muted animate-pulse rounded mx-auto w-64 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded mx-auto w-96" />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="h-96 bg-muted animate-pulse rounded" />
              <div className="h-96 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Quiz Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The quiz result you're looking for could not be found.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round(result.percentage);
  const isPassed = result.passed;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Results</h1>
            <p className="text-muted-foreground">
              Review your performance and access your certificate
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isPassed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  Score Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {result.score} / {result.max_score}
                  </div>
                  <div className="text-2xl font-semibold text-muted-foreground mb-4">
                    {percentage}%
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full max-w-md mx-auto">
                    <Progress 
                      value={percentage} 
                      className="h-3 mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Pass/Fail Status */}
                <div className="flex justify-center">
                  <Badge 
                    variant={isPassed ? "default" : "destructive"}
                    className={`px-4 py-2 text-sm font-medium ${
                      isPassed 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {isPassed ? "PASSED" : "FAILED"}
                  </Badge>
                </div>

                {/* Attempts Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Time Taken</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RotateCcw className="h-4 w-4" />
                      <span className="text-sm">Attempts Used</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {result.attempts_used} / {result.max_attempts}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Attempts Remaining
                    </div>
                    <div className={`text-lg font-semibold ${
                      result.attempts_remaining > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {result.attempts_remaining}
                    </div>
                  </div>
                </div>

                {/* Certificate Eligibility */}
                {result.certificate_eligible && (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">
                      Congratulations! You're eligible for a certificate.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificate Card */}
            {result.certificate_eligible && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Course Completion Certificate
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Issued on {new Date(result.completed_at).toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => {
                          // Simulate download
                          const link = document.createElement('a');
                          link.href = '#';
                          link.download = 'certificate.pdf';
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          // Simulate share
                          if (navigator.share) {
                            navigator.share({
                              title: 'My Certificate',
                              text: 'Check out my course completion certificate!',
                              url: window.location.href
                            });
                          } else {
                            // Fallback to clipboard
                            navigator.clipboard.writeText(window.location.href);
                            alert('Certificate link copied to clipboard!');
                          }
                        }}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share Certificate
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      className="text-sm"
                      onClick={() => {
                        // Simulate verification
                        window.open(`/certificate/verify/${result.certificate_id}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verify Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Question Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-foreground">
                        Question {index + 1}
                      </h4>
                      <Badge variant={question.is_correct ? "default" : "destructive"}>
                        {question.points_earned} / {question.max_points} pts
                      </Badge>
                    </div>
                    
                    <p className="text-foreground mb-4">{question.question}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Your Answer:</span>
                        <p className={`mt-1 p-2 rounded ${
                          question.is_correct 
                            ? "bg-green-50 text-green-800 border border-green-200" 
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}>
                          {Array.isArray(question.user_answer) 
                            ? question.user_answer.join(", ") 
                            : question.user_answer}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Correct Answer:</span>
                        <p className="mt-1 p-2 bg-green-50 text-green-800 border border-green-200 rounded">
                          {Array.isArray(question.correct_answer) 
                            ? question.correct_answer.join(", ") 
                            : question.correct_answer}
                        </p>
                      </div>
                      
                      {question.explanation && (
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Explanation:</span>
                          <p className="mt-1 p-2 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                      
                      {question.remediation_clip_id && (
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Navigate to clip viewer
                              window.location.href = `/clip/${question.remediation_clip_id}`;
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Watch Remediation Clip
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Retake Options */}
          {retakeOptions.allowed && result.attempts_remaining > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Retake Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    You have {result.attempts_remaining} attempts remaining.
                  </p>
                  <Button 
                    className="px-8"
                    onClick={() => {
                      // Navigate to quiz retake
                      window.location.href = `/quiz/${quizId}`;
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCertificatePage;
