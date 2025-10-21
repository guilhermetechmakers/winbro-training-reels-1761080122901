import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizResultsApi } from '@/lib/api';

// Query keys
export const quizResultKeys = {
  all: ['quiz-results'] as const,
  byQuiz: (quizId: string) => [...quizResultKeys.all, 'quiz', quizId] as const,
  byAttempt: (quizId: string, attemptId: string) => [...quizResultKeys.byQuiz(quizId), 'attempt', attemptId] as const,
  byUser: () => [...quizResultKeys.all, 'user'] as const,
  retakeOptions: (quizId: string) => [...quizResultKeys.byQuiz(quizId), 'retake-options'] as const,
  certificate: (quizId: string, attemptId: string) => [...quizResultKeys.byAttempt(quizId, attemptId), 'certificate'] as const,
};

// Get quiz result by quiz ID and attempt ID
export const useQuizResult = (quizId: string, attemptId: string) => {
  return useQuery({
    queryKey: quizResultKeys.byAttempt(quizId, attemptId),
    queryFn: () => quizResultsApi.getResult(quizId, attemptId),
    enabled: !!(quizId && attemptId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get all quiz results for a specific quiz
export const useQuizResults = (quizId: string) => {
  return useQuery({
    queryKey: quizResultKeys.byQuiz(quizId),
    queryFn: () => quizResultsApi.getResultsByQuiz(quizId),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get user's quiz results
export const useUserQuizResults = (params?: any) => {
  return useQuery({
    queryKey: [...quizResultKeys.byUser(), params],
    queryFn: () => quizResultsApi.getResultsByUser(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get retake options for a quiz
export const useRetakeOptions = (quizId: string) => {
  return useQuery({
    queryKey: quizResultKeys.retakeOptions(quizId),
    queryFn: () => quizResultsApi.getRetakeOptions(quizId),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get certificate for a quiz result
export const useQuizCertificate = (quizId: string, attemptId: string) => {
  return useQuery({
    queryKey: quizResultKeys.certificate(quizId, attemptId),
    queryFn: () => quizResultsApi.getCertificate(quizId, attemptId),
    enabled: !!(quizId && attemptId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Retake quiz mutation
export const useRetakeQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId }: { quizId: string }) => quizResultsApi.retakeQuiz(quizId),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: quizResultKeys.byQuiz(variables.quizId),
      });
      queryClient.invalidateQueries({
        queryKey: quizResultKeys.retakeOptions(variables.quizId),
      });
    },
  });
};

// Download certificate mutation
export const useDownloadCertificate = () => {
  return useMutation({
    mutationFn: ({ certificateId }: { certificateId: string }) => {
      // This would typically trigger a download
      return quizResultsApi.getCertificate(certificateId, '');
    },
  });
};

// Share certificate mutation
export const useShareCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ certificateId }: { certificateId: string }) => {
      // This would generate a shareable link
      return quizResultsApi.getCertificate(certificateId, '');
    },
    onSuccess: (_, variables) => {
      // Invalidate certificate queries
      queryClient.invalidateQueries({
        queryKey: quizResultKeys.certificate(variables.certificateId, ''),
      });
    },
  });
};
