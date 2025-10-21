import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock
} from 'lucide-react';
import ProgressTracker from '@/components/learning-player/ProgressTracker';
import ClipPlayer from '@/components/learning-player/ClipPlayer';
import InlineQuizModal from '@/components/learning-player/InlineQuizModal';
import CompletionCertificate from '@/components/learning-player/CompletionCertificate';
import BackNextNavigation from '@/components/learning-player/BackNextNavigation';
import type { 
  LearningPlayerState,
  QuizAnswer,
  CertificateResult
} from '@/types/content';
import { mockLearningPlayerCourse } from '@/data/mockLearningPlayer';


const LearningPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [playerState, setPlayerState] = useState<LearningPlayerState>({
    course_id: id || '',
    user_id: 'user-1',
    current_module_index: 0,
    current_node_index: 0,
    completed_modules: [],
    completed_nodes: ['node-1'],
    is_quiz_modal_open: false,
    is_certificate_modal_open: false,
    overall_progress: 25,
    module_progress: { 'module-1': 50 },
    started_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString()
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes for demo
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuizAttempt, setCurrentQuizAttempt] = useState(1);

  // Mock query for course data
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['learning-player-course', id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockLearningPlayerCourse;
    }
  });

  const currentModule = course?.modules[playerState.current_module_index];
  const currentNode = currentModule?.nodes[playerState.current_node_index];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleNext = () => {
    if (currentModule && playerState.current_node_index < currentModule.nodes.length - 1) {
      setPlayerState(prev => ({
        ...prev,
        current_node_index: prev.current_node_index + 1,
        last_activity_at: new Date().toISOString()
      }));
    } else if (playerState.current_module_index < (course?.modules.length || 0) - 1) {
      setPlayerState(prev => ({
        ...prev,
        current_module_index: prev.current_module_index + 1,
        current_node_index: 0,
        last_activity_at: new Date().toISOString()
      }));
    }
  };

  const handlePrevious = () => {
    if (playerState.current_node_index > 0) {
      setPlayerState(prev => ({
        ...prev,
        current_node_index: prev.current_node_index - 1,
        last_activity_at: new Date().toISOString()
      }));
    } else if (playerState.current_module_index > 0) {
      setPlayerState(prev => ({
        ...prev,
        current_module_index: prev.current_module_index - 1,
        current_node_index: (course?.modules[prev.current_module_index - 1]?.nodes.length || 1) - 1,
        last_activity_at: new Date().toISOString()
      }));
    }
  };

  const handleNodeComplete = (nodeId: string) => {
    setPlayerState(prev => ({
      ...prev,
      completed_nodes: [...prev.completed_nodes, nodeId],
      last_activity_at: new Date().toISOString()
    }));
  };

  const handleQuizSubmit = (answers: QuizAnswer[]) => {
    // Handle quiz submission
    console.log('Quiz submitted:', answers);
    handleNodeComplete(currentNode?.id || '');
    setIsQuizModalOpen(false);
  };

  const handleQuizRetry = () => {
    setCurrentQuizAttempt(prev => prev + 1);
    setIsQuizModalOpen(true);
  };

  const handleCertificateDownload = () => {
    console.log('Certificate downloaded');
  };

  const handleCertificateShare = () => {
    console.log('Certificate shared');
  };

  const handleCertificateVerify = () => {
    window.open('/certificate/verify/123', '_blank');
  };

  const handleBookmark = () => {
    console.log('Clip bookmarked');
  };

  const handleShare = () => {
    console.log('Clip shared');
  };

  const handleDownload = () => {
    console.log('Clip downloaded');
  };

  const handleClipComplete = () => {
    if (currentNode) {
      handleNodeComplete(currentNode.id);
    }
  };

  // Mock certificate data
  const mockCertificate: CertificateResult = {
    id: 'cert-1',
    certificate_number: 'WB-2024-001234',
    user_name: 'John Doe',
    course_title: course?.title || 'Course Title',
    completion_date: new Date().toISOString(),
    score: 85,
    percentage: 85,
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    verification_url: '/certificate/verify/123',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pdf_url: '/api/certificates/123.pdf',
    share_url: '/certificate/share/123',
    organization_name: 'Winbro Training',
    template_id: 'template-1',
    custom_fields: {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded w-64" />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-muted animate-pulse rounded" />
                <div className="h-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-muted animate-pulse rounded" />
                <div className="h-48 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The course you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
              <p className="text-muted-foreground">by {course.author.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.estimated_duration} min
              </Badge>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              {currentNode && (
                <ClipPlayer
                  node={currentNode}
                  clip={currentNode.clip}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  playbackRate={playbackRate}
                  onPlayPause={handlePlayPause}
                  onSeek={handleSeek}
                  onVolumeChange={setVolume}
                  onPlaybackRateChange={setPlaybackRate}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onDownload={handleDownload}
                  onComplete={handleClipComplete}
                />
              )}

              {/* Navigation */}
              <BackNextNavigation
                currentModuleIndex={playerState.current_module_index}
                currentNodeIndex={playerState.current_node_index}
                currentNode={currentNode}
                nextNode={currentModule?.nodes[playerState.current_node_index + 1]}
                previousNode={currentModule?.nodes[playerState.current_node_index - 1]}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onRetry={() => {
                  if (currentNode?.type === 'quiz') {
                    setIsQuizModalOpen(true);
                  }
                }}
                isRetryAvailable={currentNode?.type === 'quiz'}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Tracker */}
              <ProgressTracker
                course={course}
                currentModuleIndex={playerState.current_module_index}
                currentNodeIndex={playerState.current_node_index}
                overallProgress={playerState.overall_progress}
                moduleProgress={playerState.module_progress}
              />

              {/* Course Outline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Outline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            module.is_completed ? 'bg-success' : 
                            module.is_locked ? 'bg-muted' : 'bg-primary'
                          }`} />
                          <span className="text-sm font-medium">{module.title}</span>
                        </div>
                        
                        <div className="ml-4 space-y-1">
                          {module.nodes.map((node, nodeIndex) => (
                            <div 
                              key={node.id}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                moduleIndex === playerState.current_module_index && 
                                nodeIndex === playerState.current_node_index
                                  ? 'bg-primary/10 border border-primary/20'
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => {
                                if (!node.is_locked) {
                                  setPlayerState(prev => ({
                                    ...prev,
                                    current_module_index: moduleIndex,
                                    current_node_index: nodeIndex,
                                    last_activity_at: new Date().toISOString()
                                  }));
                                }
                              }}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                node.is_completed ? 'bg-success' : 
                                node.is_locked ? 'bg-muted' : 'bg-primary'
                              }`} />
                              <span className="text-xs text-muted-foreground flex-1">
                                {node.title}
                              </span>
                              <div className="flex items-center gap-1">
                                {node.is_completed ? (
                                  <CheckCircle className="h-3 w-3 text-success" />
                                ) : node.is_locked ? (
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                  <Play className="h-3 w-3 text-primary" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quiz Modal */}
          {currentNode?.type === 'quiz' && currentNode.quiz && (
            <InlineQuizModal
              isOpen={isQuizModalOpen}
              onClose={() => setIsQuizModalOpen(false)}
              quiz={currentNode.quiz}
              onSubmit={handleQuizSubmit}
              onRetry={handleQuizRetry}
              maxAttempts={course.settings.max_attempts}
              currentAttempt={currentQuizAttempt}
              timeLimit={currentNode.quiz.settings.time_limit}
            />
          )}

          {/* Certificate Modal */}
          {playerState.overall_progress === 100 && (
            <CompletionCertificate
              certificate={mockCertificate}
              courseTitle={course.title}
              userName="John Doe"
              onDownload={handleCertificateDownload}
              onShare={handleCertificateShare}
              onVerify={handleCertificateVerify}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlayerPage;