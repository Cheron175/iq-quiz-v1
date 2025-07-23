export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What comes next in the sequence: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    correctAnswer: 1,
    explanation: "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30",
    category: "Pattern Recognition",
  },
  {
    id: 2,
    question: "If all roses are flowers and some flowers are red, which statement must be true?",
    options: ["All roses are red", "Some roses may be red", "No roses are red", "All flowers are roses"],
    correctAnswer: 1,
    explanation:
      "Since all roses are flowers and some flowers are red, it's possible (but not certain) that some roses are red.",
    category: "Logical Reasoning",
  },
  {
    id: 3,
    question: "Which number should replace the question mark: 3, 7, 15, 31, ?",
    options: ["47", "63", "55", "71"],
    correctAnswer: 1,
    explanation: "Each number is double the previous plus 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63",
    category: "Mathematical",
  },
  {
    id: 4,
    question: "A cube has how many edges?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 3,
    explanation: "A cube has 12 edges: 4 on the top face, 4 on the bottom face, and 4 connecting them vertically.",
    category: "Spatial",
  },
  {
    id: 5,
    question: "If you rearrange the letters 'CIFAIPC', you would get the name of a:",
    options: ["Country", "Ocean", "City", "Animal"],
    correctAnswer: 1,
    explanation: "CIFAIPC rearranged spells PACIFIC, which is an ocean.",
    category: "Word Puzzle",
  },
  {
    id: 6,
    question: "What is the missing number: 1, 4, 9, 16, ?, 36",
    options: ["20", "25", "30", "32"],
    correctAnswer: 1,
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6². The missing number is 5² = 25.",
    category: "Mathematical",
  },
  {
    id: 7,
    question: "Which word does not belong: Apple, Orange, Banana, Carrot, Grape",
    options: ["Apple", "Orange", "Carrot", "Grape"],
    correctAnswer: 2,
    explanation: "Carrot is a vegetable, while all others are fruits.",
    category: "Classification",
  },
  {
    id: 8,
    question:
      "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
    options: ["1 minute", "5 minutes", "20 minutes", "100 minutes"],
    correctAnswer: 1,
    explanation: "Each machine makes 1 widget in 5 minutes, so 100 machines would make 100 widgets in 5 minutes.",
    category: "Logical Reasoning",
  },
  {
    id: 9,
    question: "Complete the analogy: Book is to Reading as Fork is to:",
    options: ["Kitchen", "Eating", "Spoon", "Food"],
    correctAnswer: 1,
    explanation: "A book is used for reading, just as a fork is used for eating.",
    category: "Analogies",
  },
  {
    id: 10,
    question: "What comes next: O, T, T, F, F, S, S, E, ?",
    options: ["N", "T", "E", "I"],
    correctAnswer: 0,
    explanation: "These are the first letters of numbers: One, Two, Three, Four, Five, Six, Seven, Eight, Nine.",
    category: "Pattern Recognition",
  },
] 