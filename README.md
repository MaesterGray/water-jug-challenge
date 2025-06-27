# Water Jug Challenge 🌊

A web-based solution to the classic Water Jug Riddle, implemented with Svelte and TypeScript. This application provides an interactive visualization of the solution using animated water jugs.

## 🌐 Live Demo

Try out the Water Jug Challenge here: [Water Jug Wizard](https://water-jug-challenge-for-chicks.netlify.app/)

## Problem Description

Given two jugs with capacities x and y liters respectively, and an infinite water supply, the goal is to measure exactly z liters of water using only these operations:
- Fill a jug completely
- Empty a jug completely
- Pour water from one jug to another until either the first jug is empty or the second jug is full

## Algorithmic Approach

The solution uses a Breadth-First Search (BFS) algorithm to find the shortest path to the target volume. Here's how it works:

1. Start with both jugs empty (0,0)
2. For each state (x,y), generate all possible next states using valid operations:
   - Fill jug A: (maxA, y)
   - Fill jug B: (x, maxB)
   - Empty jug A: (0, y)
   - Empty jug B: (x, 0)
   - Pour A to B: (max(0, x-(maxB-y)), min(maxB, y+x))
   - Pour B to A: (min(maxA, x+y), max(0, y-(maxA-x)))
3. Track visited states to avoid cycles
4. Use BFS to find the shortest path to a state where either jug contains the target amount

Time Complexity: O(xy) where x and y are the capacities of the jugs
Space Complexity: O(xy) to store visited states

## Test Cases for Validation

1. **Basic Case**
   - Jug A: 4 liters
   - Jug B: 3 liters
   - Target: 2 liters
   - Expected: Solvable
   - Solution Path: (0,0) -> (4,0) -> (1,3) -> (1,0) -> (0,1) -> (4,1) -> (2,3)

2. **Impossible Case**
   - Jug A: 3 liters
   - Jug B: 6 liters
   - Target: 4 liters
   - Expected: No solution
   - Reason: Cannot measure 4 liters with 3 and 6 liter jugs

3. **Equal Jugs Case**
   - Jug A: 5 liters
   - Jug B: 5 liters
   - Target: 4 liters
   - Expected: No solution
   - Reason: Cannot measure amounts less than jug capacity when jugs are equal

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MaesterGray/water-jug-challenge
cd water-jug-challenge
```

2. Install dependencies:
```bash
pnpm install
# or with npm
npm install
```

3. Start the development server:
```bash
pnpm dev
# or with npm
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
# or with npm
npm run build
```

## Features

- 🎨 Interactive UI with animated water jugs
- 📊 Step-by-step solution visualization
- 🔄 Real-time solution finding
- 📱 Responsive design
- ✨ Smooth animations

## Technologies Used

- Svelte + SvelteKit
- TypeScript
- TailwindCSS
- Lottie Animations
- Bits UI Components




