import { QuizData } from '../types/quiz';

export const DEMO_QUIZ: QuizData = {
  id: 'demo-ai-and-computing',
  title: 'Artificial Intelligence & Modern Computing Essentials',
  description: 'A pre-compiled sample assessment demonstrating Quizora AI question formats, rigorous distractors, and in-depth educational rationales.',
  createdAt: new Date().toISOString(),
  sourceSummary: 'Synthesized from standard foundational curricula covering Machine Learning architectures, Computational Complexity, and Operating System principles.',
  config: {
    questionCount: 10,
    difficulty: 'mixed',
    questionTypes: ['mcq', 'multi_select', 'true_false', 'fill_in_blank'],
    language: 'english',
    mode: 'practice',
    timeLimitMinutes: 12,
    negativeMarking: false,
    shuffleQuestions: false,
    topicFocus: 'Core Computing & Artificial Intelligence',
    customInstructions: 'Demonstrate diverse question types with accurate source references.',
  },
  questions: [
    {
      id: 'demo-q1',
      type: 'mcq',
      question: 'What is the primary role of the Self-Attention mechanism in the Transformer architecture introduced by Vaswani et al.?',
      options: [
        'To process sequence tokens in parallel by computing dynamic relevance scores between all token pairs',
        'To compress high-dimensional tokens into rigid recurrent hidden states sequentially',
        'To eliminate the requirement for linear matrix projections during feed-forward phases',
        'To reduce gradient descent step size uniformly across all encoder layers'
      ],
      correctAnswer: 'To process sequence tokens in parallel by computing dynamic relevance scores between all token pairs',
      explanation: 'Unlike recurrent neural networks (RNNs) that evaluate inputs sequentially, self-attention maps queries, keys, and values across all tokens simultaneously, capturing long-range context without sequential bottleneck.',
      difficulty: 'medium',
      topic: 'Deep Learning',
      sourcePassage: 'Vaswani et al. (2017) "Attention Is All You Need", Section 3.2: Attention calculation Softmax(QK^T / sqrt(d_k))V allows direct pairwise weighting between tokens across the entire context window.'
    },
    {
      id: 'demo-q2',
      type: 'true_false',
      question: 'In computational complexity theory, every problem solvable in polynomial time (class P) is also in the class NP.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'True. Class P is a subset of NP (P ⊆ NP). If a decision problem can be solved in deterministic polynomial time, its solution can trivially be verified in polynomial time.',
      difficulty: 'easy',
      topic: 'Complexity Theory',
      sourcePassage: 'Sipser, Introduction to the Theory of Computation: P is the class of languages decidable in polynomial time; NP is the class verifiable in polynomial time. Clearly P ⊆ NP.'
    },
    {
      id: 'demo-q3',
      type: 'multi_select',
      question: 'Which of the following techniques are primarily utilized to mitigate overfitting in deep neural networks? (Select all that apply)',
      options: [
        'Dropout regularization',
        'Early stopping based on validation loss',
        'L2 weight decay (Ridge)',
        'Increasing model parameter count without expanding training data'
      ],
      correctAnswer: [
        'Dropout regularization',
        'Early stopping based on validation loss',
        'L2 weight decay (Ridge)'
      ],
      explanation: 'Dropout randomly deactivates neurons during training; early stopping halts training when validation loss stops improving; L2 weight decay penalizes large weights. In contrast, expanding parameter capacity without more data typically increases the risk of overfitting.',
      difficulty: 'medium',
      topic: 'Machine Learning',
      sourcePassage: 'Goodfellow et al., Deep Learning Textbook, Chapter 7: Regularization strategies constrain capacity to improve generalization performance.'
    },
    {
      id: 'demo-q4',
      type: 'fill_in_blank',
      question: 'The mathematical equation that forms the basis of reinforcement learning dynamic programming, expressing the value of a state as the immediate reward plus the discounted value of successor states, is known as the ______ equation.',
      options: ['Bellman', 'Euler', 'Navier-Stokes', 'Schrödinger'],
      correctAnswer: 'Bellman',
      explanation: 'The Bellman equation decomposes optimal value functions into immediate reward and discounted future expectation: V(s) = max_a [ R(s,a) + γ Σ P(s\'|s,a) V(s\') ].',
      difficulty: 'medium',
      topic: 'Reinforcement Learning',
      sourcePassage: 'Sutton & Barto, Reinforcement Learning: An Introduction, Chapter 3.5: Bellman Expectation & Optimality Equations.'
    },
    {
      id: 'demo-q5',
      type: 'mcq',
      question: 'Which CPU scheduling algorithm provides the theoretical minimum average waiting time for a set of stationary processes?',
      options: [
        'Shortest Job First (SJF / SRTF)',
        'First-Come, First-Served (FCFS)',
        'Round Robin with high quantum',
        'Multi-Level Feedback Queue without aging'
      ],
      correctAnswer: 'Shortest Job First (SJF / SRTF)',
      explanation: 'Shortest Job First is provably optimal regarding average waiting time because scheduling the shortest burst first minimizes cumulative process delay across the queue.',
      difficulty: 'easy',
      topic: 'Operating Systems',
      sourcePassage: 'Silberschatz et al., Operating System Concepts, Section 5.3.2: Shortest-Job-First scheduling theorem and mathematical optimality proof.'
    },
    {
      id: 'demo-q6',
      type: 'true_false',
      question: 'Softmax temperature values approaching zero (T → 0) make the probability distribution more uniform, leading to maximum randomness in token generation.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'False. As temperature T approaches 0, the softmax distribution sharpens towards an argmax (greedy decoding), making outputs deterministic and concentrating probability exclusively on the highest logit.',
      difficulty: 'hard',
      topic: 'Language Models',
      sourcePassage: 'Mathematical definition: P(i) = exp(z_i / T) / Σ exp(z_j / T). As T → 0, max(z_i) dominates completely; as T → ∞, distribution becomes uniform.'
    },
    {
      id: 'demo-q7',
      type: 'mcq',
      question: 'In relational database management systems, what does the "I" in the ACID transactional guarantees represent?',
      options: [
        'Isolation',
        'Immutability',
        'Indexing',
        'Interoperability'
      ],
      correctAnswer: 'Isolation',
      explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially.',
      difficulty: 'easy',
      topic: 'Databases',
      sourcePassage: 'Database System Concepts (Silberschatz): Section 14.1 Transaction Concept: ACID properties overview.'
    },
    {
      id: 'demo-q8',
      type: 'multi_select',
      question: 'Which of the following are necessary conditions for a deadlock to occur in a concurrent computing system? (Coffman Conditions)',
      options: [
        'Mutual Exclusion',
        'Hold and Wait',
        'No Preemption',
        'Circular Wait'
      ],
      correctAnswer: [
        'Mutual Exclusion',
        'Hold and Wait',
        'No Preemption',
        'Circular Wait'
      ],
      explanation: 'All four Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) must simultaneously hold for a resource deadlock to occur in a system.',
      difficulty: 'hard',
      topic: 'Operating Systems',
      sourcePassage: 'Coffman et al. (1971) "System Deadlocks": Characterization of the four requisite conditions.'
    },
    {
      id: 'demo-q9',
      type: 'mcq',
      question: 'Which data structure offers amortized O(1) time complexity for insert, search, and delete operations under standard uniform hashing assumptions?',
      options: [
        'Hash Table',
        'Red-Black Tree',
        'B-Tree',
        'Min-Heap'
      ],
      correctAnswer: 'Hash Table',
      explanation: 'Hash tables achieve average O(1) lookup, insertion, and deletion when collisions are minimal. Red-Black trees and B-trees are O(log n), and heaps are O(1) peek with O(log n) removal.',
      difficulty: 'easy',
      topic: 'Data Structures',
      sourcePassage: 'Cormen, Leiserson, Rivest, Stein (CLRS) Introduction to Algorithms: Chapter 11 Hash Tables.'
    },
    {
      id: 'demo-q10',
      type: 'fill_in_blank',
      question: 'In symmetric cryptography, the Advanced Encryption Standard (AES) operates on fixed block lengths of ______ bits.',
      options: ['128', '64', '256', '512'],
      correctAnswer: '128',
      explanation: 'The AES standard (Rijndael) specifies a fixed block size of 128 bits, although key sizes can be 128, 192, or 256 bits.',
      difficulty: 'medium',
      topic: 'Cryptography',
      sourcePassage: 'NIST FIPS PUB 197: Specification for the Advanced Encryption Standard (AES), Section 3.'
    }
  ]
};
