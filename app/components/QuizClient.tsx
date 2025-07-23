"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Eye, Brain, Trophy, Target, Clock } from "lucide-react"
// Import commented out until needed for wallet connection UI
// import { Wallet } from "lucide-react"
import { useWalletPayment } from "@/lib/hooks/useWalletPayment"
import { PAYMENT_AMOUNT } from "@/lib/wagmi"
import { questions } from "@/lib/questions"
// Type imported from questions.ts instead of redefined here
import type { Question } from "@/lib/questions"
import { useFarcaster } from "@/lib/hooks/useFarcaster"
import { LoadingState } from "./LoadingState"
import { useNetwork } from "wagmi"

interface UserAnswer {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
}

type QuizState = "welcome" | "quiz" | "results" | "review"

export default function QuizClient() {
  const [quizState, setQuizState] = useState<QuizState>("welcome")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(600)
  const [timerActive, setTimerActive] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const { handlePayment, isProcessing, error: paymentError, isConnected } = useWalletPayment()
  const { is: isFarcaster, error: farcasterError } = useFarcaster()
  const { chain: currentChain } = useNetwork()

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setTimerActive(false)
            setQuizState("results")
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeLeft])

  const startQuiz = () => {
    setQuizState("quiz")
    setCurrentQuestion(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setScore(0)
    setTimeLeft(600)
    setTimerActive(true)
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    const newAnswer: UserAnswer = {
      questionId: questions[currentQuestion].id,
      selectedAnswer,
      isCorrect,
    }

    setUserAnswers((prev) => [...prev, newAnswer])
    if (isCorrect) setScore((prev) => prev + 1)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      setTimerActive(false)
      setQuizState("results")
    }
  }

  const handleSeeMore = async () => {
    try {
      const result = await handlePayment()
      if (result.success && result.hash) {
        setTransactionHash(result.hash)
        setShowResults(true)
      }
    } catch (err) {
      console.error('Failed to process payment:', err)
    }
  }

  const getScoreLevel = (score: number) => {
    if (score >= 8) return { level: "Genius", color: "bg-purple-500", icon: Brain }
    if (score >= 6) return { level: "Advanced", color: "bg-green-500", icon: Trophy }
    if (score >= 4) return { level: "Average", color: "bg-blue-500", icon: Target }
    return { level: "Beginner", color: "bg-orange-500", icon: Target }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Show loading state while Farcaster initializes
  if (!isFarcaster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoadingState 
          title="Initializing..."
          message="Setting up the Mini App environment"
        />
      </div>
    )
  }

  // Show loading state during transaction
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoadingState 
          title="Processing Payment"
          message="Please confirm the transaction in your wallet"
        />
      </div>
    )
  }

  if (quizState === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">IQ Quiz Challenge</CardTitle>
            <p className="text-gray-600">
              Test your intelligence with 10 carefully crafted questions covering logic, patterns, and reasoning.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-900">10 Questions</div>
                <div className="text-gray-600">Multiple Choice</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-900">10 Minutes</div>
                <div className="text-gray-600">Time Limit</div>
              </div>
            </div>
            <Button onClick={startQuiz} className="w-full" size="lg">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizState === "quiz") {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{question.category}</Badge>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    timeLeft <= 60
                      ? "bg-red-100 text-red-700"
                      : timeLeft <= 180
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } cursor-pointer`}
                >
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={submitAnswer} disabled={selectedAnswer === null} className="flex-1" size="lg">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (quizState === "results") {
    const scoreLevel = getScoreLevel(score)
    const ScoreIcon = scoreLevel.icon
    const isOnBase = currentChain?.id === 8453

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className={`mx-auto w-20 h-20 ${scoreLevel.color} rounded-full flex items-center justify-center`}>
              <ScoreIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Quiz Complete!</CardTitle>
            {!showResults && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Connect your wallet and pay {PAYMENT_AMOUNT} ETH to see your detailed results
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}</span>
                  <span>•</span>
                  <span className={`${isOnBase ? 'text-green-600' : 'text-orange-500'}`}>
                    {isOnBase ? 'On Base Network' : 'Wrong Network'}
                  </span>
                </div>
                {farcasterError && (
                  <p className="text-xs text-red-500">
                    Warning: {farcasterError}
                  </p>
                )}
              </div>
            )}
            {paymentError && (
              <p className="text-sm text-red-600">
                {paymentError}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button 
                onClick={handleSeeMore} 
                variant="outline" 
                className="flex-1"
                disabled={isProcessing || showResults}
              >
                <Eye className="w-4 h-4 mr-2" />
                See More
              </Button>
              <Button onClick={startQuiz} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
            {showResults && (
              <div className="mt-4 space-y-4">
                <div className="text-left">
                  <p className="text-xl font-bold mb-2">Your Score: {score}/10</p>
                  <p className="text-gray-600">
                    Level: {scoreLevel.level}
                  </p>
                </div>
                {transactionHash && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-800 break-all">
                      Transaction: {transactionHash}
                    </p>
                    <a 
                      href={`https://basescan.org/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      View on BaseScan
                    </a>
                  </div>
                )}
                <Button 
                  onClick={() => setQuizState("review")} 
                  className="w-full"
                >
                  View Detailed Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizState === "review") {
    const scoreLevel = getScoreLevel(score)
    const ScoreIcon = scoreLevel.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Answer Review</h1>
            <p className="text-gray-600">Review your answers and learn from explanations</p>
          </div>

          <Card className="w-full max-w-md mx-auto text-center mb-6">
            <CardHeader className="space-y-4">
              <div className={`mx-auto w-20 h-20 ${scoreLevel.color} rounded-full flex items-center justify-center`}>
                <ScoreIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Your Score</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900">{score}/10</div>
                <Badge className={scoreLevel.color} variant="secondary">
                  {scoreLevel.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="text-sm text-gray-600 mb-2">Your Performance</div>
                <Progress value={(score / 10) * 100} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{score} out of 10 correct</span>
                  <span>Time: {formatTime(600 - timeLeft)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find((a) => a.questionId === question.id)
              const isCorrect = userAnswer?.isCorrect || false

              return (
                <Card key={question.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                          <Badge variant="secondary" className="text-xs">
                            {question.category}
                          </Badge>
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            optionIndex === question.correctAnswer
                              ? "border-green-500 bg-green-50 text-green-800"
                              : userAnswer?.selectedAnswer === optionIndex && !isCorrect
                                ? "border-red-500 bg-red-50 text-red-800"
                                : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {userAnswer?.selectedAnswer === optionIndex && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900 mb-1">Explanation</div>
                      <div className="text-sm text-blue-800">{question.explanation}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={startQuiz} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Quiz Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
} 