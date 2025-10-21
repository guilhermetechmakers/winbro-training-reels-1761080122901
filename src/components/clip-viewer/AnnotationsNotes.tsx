import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, MessageSquare, Reply } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { clipsApi } from '@/lib/api';
import type { Note, Comment } from '@/types/content';

interface AnnotationsNotesProps {
  clipId: string;
  onToggleVisibility?: () => void;
  className?: string;
}

const AnnotationsNotes: React.FC<AnnotationsNotesProps> = ({
  clipId,
  onToggleVisibility,
  className
}) => {
  const [newNote, setNewNote] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ['notes', clipId],
    queryFn: () => clipsApi.getNotes(clipId),
  });

  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', clipId],
    queryFn: () => clipsApi.getComments?.(clipId) || Promise.resolve([]),
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (data: { content: string; timestamp?: number; is_public: boolean }) =>
      clipsApi.addNote(clipId, data.content, data.timestamp || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', clipId] });
      setNewNote('');
      setTimestamp(null);
      setIsPublic(false);
      setShowAddNote(false);
      toast.success('Note added successfully');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (data: { content: string; parent_id?: string }) =>
      clipsApi.addComment?.(clipId, data.content, data.parent_id) || Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', clipId] });
      setNewComment('');
      setReplyTo(null);
      setShowAddComment(false);
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  // Format time for display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle note submission
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    addNoteMutation.mutate({
      content: newNote,
      timestamp: timestamp || undefined,
      is_public: isPublic,
    });
  };

  // Handle comment submission
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    addCommentMutation.mutate({
      content: newComment,
      parent_id: replyTo || undefined,
    });
  };

  // Handle mention detection
  const handleMentionDetection = (_text: string) => {
    // In a real implementation, this would detect @mentions
    // and show a dropdown with user suggestions
  };

  // Get user initials
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (notesLoading || commentsLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Notes & Comments</CardTitle>
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notes & Comments</CardTitle>
          {onToggleVisibility && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note/Comment Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddNote(!showAddNote)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddComment(!showAddComment)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </Button>
        </div>

        {/* Add Note Form */}
        {showAddNote && (
          <Card className="border-primary/20">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Note Content</label>
                <Textarea
                  placeholder="Add your note..."
                  value={newNote}
                  onChange={(e) => {
                    setNewNote(e.target.value);
                    handleMentionDetection(e.target.value);
                  }}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Timestamp (optional)"
                  type="number"
                  value={timestamp || ''}
                  onChange={(e) => setTimestamp(e.target.value ? Number(e.target.value) : null)}
                  className="w-32"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="public-note"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="public-note" className="text-sm text-muted-foreground">
                    Public
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || addNoteMutation.isPending}
                >
                  {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddNote(false);
                    setNewNote('');
                    setTimestamp(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Comment Form */}
        {showAddComment && (
          <Card className="border-primary/20">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    handleMentionDetection(e.target.value);
                  }}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                >
                  {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddComment(false);
                    setNewComment('');
                    setReplyTo(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        {notes && notes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes ({notes.length})
            </h3>
            <ScrollArea className="h-48">
              <div className="space-y-3 pr-4">
                {notes.map((note: Note) => (
                  <div key={note.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {getUserInitials('User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">You</span>
                        {note.timestamp && (
                          <Badge variant="outline" className="text-xs">
                            {formatTime(note.timestamp)}
                          </Badge>
                        )}
                        {note.is_public ? (
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Private
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Comments Section */}
        {comments && comments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </h3>
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {comments.map((comment: Comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {getUserInitials('User')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">User</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(comment.id)}
                            className="text-xs h-6 px-2"
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {comment.replies.map((reply: Comment) => (
                          <div key={reply.id} className="flex gap-3 p-2 bg-muted/20 rounded-lg">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {getUserInitials('User')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">User</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-foreground">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Empty State */}
        {(!notes || notes.length === 0) && (!comments || comments.length === 0) && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">No notes or comments yet</h3>
            <p className="text-xs text-muted-foreground">
              Be the first to add a note or comment on this clip.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnotationsNotes;