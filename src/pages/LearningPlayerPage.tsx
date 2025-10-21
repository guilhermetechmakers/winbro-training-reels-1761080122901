import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock,
  ArrowLeft,
  BookOpen,
  Target,
  Users,
  Star,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCourseOutline, setShowCourseOutline] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      toast.success('Lesson completed!', {
        description: 'Great job! You can now proceed to the next lesson.',
        duration: 3000,
      });
    }
  };


  const handleCourseComplete = () => {
    toast.success('Course completed!', {
      description: 'Congratulations! You\'ve successfully completed the entire course.',
      duration: 5000,
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  // Check for course completion
  useEffect(() => {
    if (playerState.overall_progress === 100) {
      handleCourseComplete();
    }
  }, [playerState.overall_progress]);

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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded w-80" />
                <div className="h-4 bg-muted animate-pulse rounded w-48" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 bg-muted animate-pulse rounded w-20" />
                <div className="h-8 bg-muted animate-pulse rounded w-8" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-3 space-y-6">
                <div className="aspect-video bg-muted animate-pulse rounded-lg" />
                <div className="h-16 bg-muted animate-pulse rounded-lg" />
              </div>
              
              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
                <div className="h-48 bg-muted animate-pulse rounded-lg" />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-12 w-12 text-error" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Course Not Found</h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                The course you're looking for could not be found or may have been removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="min-w-32">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/library')} className="min-w-32">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Library
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-muted/50 self-start"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <p className="text-muted-foreground">by {course.author.name}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{course.enrollment_count} enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <Clock className="h-3 w-3" />
                  {course.estimated_duration} min
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Target className="h-3 w-3" />
                  {playerState.overall_progress}% complete
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="lg:hidden self-end sm:self-auto"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <div className={`grid gap-6 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'
          }`}>
            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`space-y-6 ${isSidebarCollapsed ? 'lg:col-span-1' : 'col-span-1 lg:col-span-3'}`}
            >
              {/* Video Player */}
              <AnimatePresence mode="wait">
                {currentNode && (
                  <motion.div
                    key={`${playerState.current_module_index}-${playerState.current_node_index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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
              </motion.div>
            </motion.div>

            {/* Enhanced Sidebar */}
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 col-span-1 lg:col-span-1"
                >
                  {/* Progress Tracker */}
                  <ProgressTracker
                    course={course}
                    currentModuleIndex={playerState.current_module_index}
                    currentNodeIndex={playerState.current_node_index}
                    overallProgress={playerState.overall_progress}
                    moduleProgress={playerState.module_progress}
                  />

                  {/* Enhanced Course Outline */}
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Course Outline
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCourseOutline(!showCourseOutline)}
                          className="h-8 w-8 p-0"
                        >
                          {showCourseOutline ? (
                            <ChevronLeft className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {showCourseOutline && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              {course.modules.map((module, moduleIndex) => (
                                <motion.div
                                  key={module.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: moduleIndex * 0.1 }}
                                  className="space-y-3"
                                >
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <div className={`w-3 h-3 rounded-full ${
                                      module.is_completed ? 'bg-success' : 
                                      module.is_locked ? 'bg-muted' : 'bg-primary'
                                    }`} />
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium text-foreground">
                                        {module.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {module.estimated_duration} min • {module.nodes.length} lessons
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {module.is_completed ? (
                                        <CheckCircle className="h-4 w-4 text-success" />
                                      ) : module.is_locked ? (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <Play className="h-4 w-4 text-primary" />
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="ml-6 space-y-1">
                                    {module.nodes.map((node, nodeIndex) => {
                                      const isCurrentNode = moduleIndex === playerState.current_module_index && 
                                                           nodeIndex === playerState.current_node_index;
                                      
                                      return (
                                        <motion.div
                                          key={node.id}
                                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                            isCurrentNode
                                              ? 'bg-primary/10 border border-primary/20 shadow-sm'
                                              : 'hover:bg-muted/50'
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
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <div className={`w-2 h-2 rounded-full ${
                                            node.is_completed ? 'bg-success' : 
                                            node.is_locked ? 'bg-muted' : 'bg-primary'
                                          }`} />
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${
                                              isCurrentNode ? 'text-primary' : 'text-foreground'
                                            }`}>
                                              {node.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs text-muted-foreground">
                                                {node.estimated_duration} min
                                              </span>
                                              {node.attempts > 0 && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                  <RotateCcw className="h-3 w-3" />
                                                  {node.attempts} attempts
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            {node.is_completed ? (
                                              <CheckCircle className="h-3 w-3 text-success" />
                                            ) : node.is_locked ? (
                                              <Lock className="h-3 w-3 text-muted-foreground" />
                                            ) : (
                                              <Play className="h-3 w-3 text-primary" />
                                            )}
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quiz Modal */}
          <AnimatePresence>
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
          </AnimatePresence>

          {/* Certificate Modal */}
          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LearningPlayerPage;