# Quiz & Certificate Page

## Overview
The Quiz & Certificate Page (`/quiz/:quizId/results/:attemptId`) displays quiz results, provides detailed question feedback, and allows users to access their certificates.

## Features Implemented

### ✅ Score Summary
- **Score Display**: Shows current score vs max score with percentage
- **Progress Bar**: Visual representation of performance
- **Pass/Fail Status**: Clear indication with color-coded badges
- **Time Tracking**: Displays time taken to complete the quiz
- **Attempts Information**: Shows attempts used and remaining
- **Certificate Eligibility**: Indicates if user is eligible for a certificate

### ✅ Question Feedback
- **Question Review**: Detailed breakdown of each question
- **Answer Comparison**: Shows user's answer vs correct answer
- **Explanation**: Provides explanations for correct answers
- **Remediation Links**: Links to relevant clips for incorrect answers
- **Points Breakdown**: Shows points earned for each question

### ✅ Certificate Management
- **Certificate Card**: Displays certificate information
- **Download PDF**: Allows users to download their certificate
- **Share Certificate**: Share certificate via native sharing or clipboard
- **Verification Link**: Link to verify certificate authenticity

### ✅ Retake Functionality
- **Retake Options**: Shows if retake is allowed
- **Attempts Remaining**: Displays remaining attempts
- **Retake Button**: Allows users to retake the quiz

## Technical Implementation

### Components
- **Main Page**: `src/pages/QuizCertificatePage.tsx`
- **API Hook**: `src/hooks/useQuizResults.ts`
- **Mock Data**: `src/data/mockQuizResults.ts`

### Routing
- **Route**: `/quiz/:quizId/results/:attemptId`
- **Protection**: Requires authentication
- **Parameters**: 
  - `quizId`: ID of the quiz
  - `attemptId`: ID of the specific attempt

### Data Flow
1. Page loads with loading state
2. Fetches quiz result data (currently using mock data)
3. Displays score summary and question feedback
4. Shows certificate options if eligible
5. Provides retake options if available

### Styling
- **Design System**: Follows project's design guidelines
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and loading states

## Mock Data
The page currently uses mock data from `src/data/mockQuizResults.ts` which includes:
- Sample quiz results with 5 questions
- Mixed correct/incorrect answers
- Certificate eligibility
- Retake options

## Future Enhancements
- [ ] Real API integration
- [ ] Real-time certificate generation
- [ ] Advanced analytics
- [ ] Social sharing features
- [ ] Certificate templates
- [ ] Bulk operations

## Usage
Navigate to `/quiz/{quizId}/results/{attemptId}` to view quiz results and certificates.

Example: `/quiz/quiz-123/results/attempt-456`