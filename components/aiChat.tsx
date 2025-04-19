"use client";
import { useState, useEffect } from "react";
import { 
  MessageSquare, Send, User, ChevronsRight, X, Lightbulb, 
  Calendar, Trophy, Zap, Dumbbell, BookOpen, Clock, BarChart, 
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import axios from "axios";
import useWorkoutState from "@/app/(pages)/(authenticated)/store/useworkoutState";

interface AiAdvisorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Define types for message structure
interface Message {
  type: 'user' | 'assistant';
  content: string;
}

// Define types for pre-generated advice
interface AdviceCard {
  title: string;
  content: string;
  icon: React.ReactNode;
  category: string;
}

export default function AiAdvisor({ isOpen, setIsOpen }: AiAdvisorProps) {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hello! I'm your Fitness AI Advisor. I can analyze your workout data and provide personalized recommendations. What would you like help with today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const { workouts } = useWorkoutState();
  const [workoutInsights, setWorkoutInsights] = useState<{
    streak: number;
    muscleGroups: { name: string; percentage: number }[];
    recommendations: string[];
  }>({
    streak: 0,
    muscleGroups: [],
    recommendations: []
  });
  
  const [workoutPlans, setWorkoutPlans] = useState<{
    title: string;
    days: {
      name: string;
      focus?: string; // Making this optional since some implementations might not have it
      exercises: {name: string; sets: number; reps: string; note?: string}[] // Added note property as optional
    }[];
    isLoading: boolean;
  }>({
    title: "Recommended 4-Day Split",
    days: [],
    isLoading: false
  });
  
  // Pre-generated advice cards
  const adviceCards: AdviceCard[] = [
    {
      title: "Progressive Overload",
      content: "To see continuous progress, gradually increase weight by 5-10% once you can perform 2 extra reps beyond your target range for 2 consecutive sessions.",
      icon: <BarChart className="text-green-400 w-5 h-5" />,
      category: "technique"
    },
    {
      title: "Rest Periods",
      content: "For strength-focused training, rest 2-3 minutes between sets. For hypertrophy, 60-90 seconds is optimal. For endurance, limit rest to 30-45 seconds.",
      icon: <Clock className="text-blue-400 w-5 h-5" />,
      category: "recovery"
    },
    {
      title: "Push-Pull-Legs Split",
      content: "This efficient 6-day split maximizes recovery by grouping muscles that work together: Push (chest, shoulders, triceps), Pull (back, biceps), and Legs.",
      icon: <Dumbbell className="text-purple-400 w-5 h-5" />,
      category: "planning"
    },
    {
      title: "Mind-Muscle Connection",
      content: "Focus on feeling the target muscle working during each exercise. Try lighter weights with perfect form to establish this connection before adding load.",
      icon: <Lightbulb className="text-yellow-400 w-5 h-5" />,
      category: "technique"
    },
    {
      title: "Deload Strategy",
      content: "Every 6-8 weeks, incorporate a deload week where you reduce volume by 40-50% while maintaining intensity to prevent plateaus and overtraining.",
      icon: <ArrowRight className="text-red-400 w-5 h-5" />,
      category: "recovery"
    },
    {
      title: "Workout Tracking",
      content: "Record all exercises, sets, reps, and weights. This data helps identify patterns and ensures you're making progress over time.",
      icon: <CheckCircle2 className="text-teal-400 w-5 h-5" />,
      category: "planning"
    }
  ];

  // Filter cards by category
  const [adviceFilter, setAdviceFilter] = useState("all");
  const filteredAdvice = adviceFilter === "all" 
    ? adviceCards 
    : adviceCards.filter(card => card.category === adviceFilter);
  
  // Generate workout plan with Gemini
  useEffect(() => {
    if (activeTab === 'plans' && workoutPlans.days.length === 0 && !workoutPlans.isLoading) {
      generateWorkoutPlan();
    }
  }, [activeTab, workoutPlans.days.length, workoutPlans.isLoading]);
    
  // Generate insights from workout data
  useEffect(() => {
    if (workouts.length > 0) {
      generateWorkoutInsights();
    }
  }, [workouts]);

  const generateWorkoutInsights = async () => {
    // Calculate basic stats locally
    const insights = calculateBasicInsights();
    
    // If you have Gemini API set up, you can enhance insights with AI
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      try {
        const aiInsights = await getAIInsights(workouts);
        if (aiInsights) {
          setWorkoutInsights({...insights, ...aiInsights});
          return;
        }
      } catch (error) {
        console.error("Error getting AI insights:", error);
      }
    }
    
    // Fallback to basic insights if AI fails or isn't available
    setWorkoutInsights(insights);
  };

  const generateWorkoutPlan = async () => {
  // Don't generate if we are currently loading
  if (workoutPlans.isLoading) return;
  
  setWorkoutPlans(prev => ({...prev, isLoading: true, days: []}));
  
  try {
    // Get user's current fitness level based on workout data
    const fitnessLevel = workouts.length < 5 ? "beginner" : 
                        workouts.length < 20 ? "intermediate" : "advanced";
    
    // Look at most common muscle groups to determine focus
    const muscleGroups = calculateBasicInsights().muscleGroups;
    
    // Prepare prompt for Gemini API
    const prompt = `
  Create a detailed 7-day workout plan covering all major muscle groups throughout the week.
  Based on these details about the user:
  - Fitness level: ${fitnessLevel}
  - Number of tracked workouts: ${workouts.length}
  - Most trained muscle groups: ${muscleGroups.length > 0 ? 
    muscleGroups.map(g => g.name).join(", ") : "balanced training"}
  
  The plan should have 7 days with specific muscle group focus for each day:
  - Day 1: Chest
  - Day 2: Back
  - Day 3: Legs (Quads, Hamstrings, Calves)
  - Day 4: Shoulders
  - Day 5: Arms (Biceps, Triceps)
  - Day 6: Core and Stability
  - Day 7: Rest or Active Recovery
  
  Each day should have 4-6 exercises specific to the muscle group with sets, reps, and brief technique notes.
  
  Format the output strictly as a valid JSON object like this:
  {
    "title": "7-Day Complete Muscle Group Split",
    "fitnessLevel": "${fitnessLevel}",
    "days": [
      {
        "name": "Day 1: Chest",
        "focus": "Chest",
        "exercises": [
          {"name": "Exercise name", "sets": 3, "reps": "8-12", "note": "Brief technique note"},
          ...more exercises
        ]
      },
      ...more days
    ]
  }
  
  IMPORTANT: The output must be a valid JSON object and nothing else. No explanations, markdown formatting, or code blocks. Just the raw JSON.
  Each exercise should target the specific muscle group for that day.
  For ${fitnessLevel} level, use appropriate exercise selection and volume.
`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': undefined 
        }
      }
    );
    
    // Parse the response
    const aiText = response.data.candidates[0].content.parts[0].text;
    try {
      // Clean up the text in case there are markdown code blocks or other non-JSON content
      const jsonText = aiText.replace(/```json|```|`/g, "").trim();
      const planData = JSON.parse(jsonText);
      
      if (planData.title && planData.days && Array.isArray(planData.days)) {
        setWorkoutPlans({
          title: planData.title,
          days: planData.days,
          isLoading: false
        });
      } else {
        throw new Error("Invalid plan format");
      }
    } catch (e) {
      console.error("Failed to parse AI plan response:", e);
      // Fall back to default 7-day muscle group plan
      setWorkoutPlans({
        title: "7-Day Complete Muscle Group Split",
        days: [
          {
            name: "Day 1: Chest",
            focus: "Chest",
            exercises: [
              {name: "Bench Press", sets: 3, reps: "8-10", note: "Keep shoulders back and down"},
              {name: "Incline Dumbbell Press", sets: 3, reps: "10-12", note: "Focus on upper chest contraction"},
              {name: "Chest Dips", sets: 3, reps: "8-12", note: "Lean forward to target chest"},
              {name: "Cable Flyes", sets: 3, reps: "12-15", note: "Maintain slight elbow bend"}
            ]
          },
          {
            name: "Day 2: Back",
            focus: "Back",
            exercises: [
              {name: "Pull-ups", sets: 3, reps: "6-10", note: "Full range of motion"},
              {name: "Bent-Over Barbell Rows", sets: 3, reps: "8-10", note: "Keep back straight"},
              {name: "Seated Cable Rows", sets: 3, reps: "10-12", note: "Squeeze shoulder blades together"},
              {name: "Lat Pulldowns", sets: 3, reps: "10-12", note: "Pull to upper chest"}
            ]
          },
          {
            name: "Day 3: Legs",
            focus: "Lower Body",
            exercises: [
              {name: "Squats", sets: 4, reps: "8-10", note: "Keep weight on heels"},
              {name: "Romanian Deadlifts", sets: 3, reps: "10-12", note: "Feel stretch in hamstrings"},
              {name: "Leg Press", sets: 3, reps: "10-12", note: "Don't lock knees at top"},
              {name: "Standing Calf Raises", sets: 3, reps: "15-20", note: "Full range of motion"}
            ]
          },
          {
            name: "Day 4: Shoulders",
            focus: "Shoulders",
            exercises: [
              {name: "Overhead Press", sets: 3, reps: "8-10", note: "Keep core tight"},
              {name: "Lateral Raises", sets: 3, reps: "12-15", note: "Lead with elbows"},
              {name: "Face Pulls", sets: 3, reps: "12-15", note: "Pull to forehead level"},
              {name: "Rear Delt Flyes", sets: 3, reps: "12-15", note: "Maintain slight elbow bend"}
            ]
          },
          {
            name: "Day 5: Arms",
            focus: "Biceps & Triceps",
            exercises: [
              {name: "Barbell Curls", sets: 3, reps: "8-12", note: "Keep elbows fixed at sides"},
              {name: "Tricep Dips", sets: 3, reps: "10-12", note: "Keep body upright for tricep focus"},
              {name: "Hammer Curls", sets: 3, reps: "10-12", note: "Neutral grip for brachialis"},
              {name: "Tricep Pushdowns", sets: 3, reps: "12-15", note: "Keep elbows close to body"}
            ]
          },
          {
            name: "Day 6: Core & Stability",
            focus: "Core",
            exercises: [
              {name: "Plank", sets: 3, reps: "30-60 seconds", note: "Keep body in straight line"},
              {name: "Russian Twists", sets: 3, reps: "15-20 per side", note: "Rotate from waist"},
              {name: "Hanging Leg Raises", sets: 3, reps: "10-15", note: "Control the movement"},
              {name: "Cable Woodchoppers", sets: 3, reps: "12 per side", note: "Rotate through core"}
            ]
          },
          {
            name: "Day 7: Rest & Recovery",
            focus: "Active Recovery",
            exercises: [
              {name: "Light Walking", sets: 1, reps: "20-30 minutes", note: "Maintain heart rate at 50-60% max"},
              {name: "Stretching Routine", sets: 1, reps: "10-15 minutes", note: "Focus on tight areas"},
              {name: "Foam Rolling", sets: 1, reps: "5-10 minutes", note: "Target main muscle groups"}
            ]
          }
        ],
        isLoading: false
      });
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    // Set fallback plan (same as above)
    setWorkoutPlans({
      title: "7-Day Complete Muscle Group Split",
      days: [
        {
          name: "Day 1: Chest",
          focus: "Chest",
          exercises: [
            {name: "Bench Press", sets: 3, reps: "8-10", note: "Keep shoulders back and down"},
            {name: "Incline Dumbbell Press", sets: 3, reps: "10-12", note: "Focus on upper chest contraction"},
            {name: "Chest Dips", sets: 3, reps: "8-12", note: "Lean forward to target chest"},
            {name: "Cable Flyes", sets: 3, reps: "12-15", note: "Maintain slight elbow bend"}
          ]
        },
        {
          name: "Day 2: Back",
          focus: "Back",
          exercises: [
            {name: "Pull-ups", sets: 3, reps: "6-10", note: "Full range of motion"},
            {name: "Bent-Over Barbell Rows", sets: 3, reps: "8-10", note: "Keep back straight"},
            {name: "Seated Cable Rows", sets: 3, reps: "10-12", note: "Squeeze shoulder blades together"},
            {name: "Lat Pulldowns", sets: 3, reps: "10-12", note: "Pull to upper chest"}
          ]
        },
        {
          name: "Day 3: Legs",
          focus: "Lower Body",
          exercises: [
            {name: "Squats", sets: 4, reps: "8-10", note: "Keep weight on heels"},
            {name: "Romanian Deadlifts", sets: 3, reps: "10-12", note: "Feel stretch in hamstrings"},
            {name: "Leg Press", sets: 3, reps: "10-12", note: "Don't lock knees at top"},
            {name: "Standing Calf Raises", sets: 3, reps: "15-20", note: "Full range of motion"}
          ]
        },
        {
          name: "Day 4: Shoulders",
          focus: "Shoulders",
          exercises: [
            {name: "Overhead Press", sets: 3, reps: "8-10", note: "Keep core tight"},
            {name: "Lateral Raises", sets: 3, reps: "12-15", note: "Lead with elbows"},
            {name: "Face Pulls", sets: 3, reps: "12-15", note: "Pull to forehead level"},
            {name: "Rear Delt Flyes", sets: 3, reps: "12-15", note: "Maintain slight elbow bend"}
          ]
        },
        {
          name: "Day 5: Arms",
          focus: "Biceps & Triceps",
          exercises: [
            {name: "Barbell Curls", sets: 3, reps: "8-12", note: "Keep elbows fixed at sides"},
            {name: "Tricep Dips", sets: 3, reps: "10-12", note: "Keep body upright for tricep focus"},
            {name: "Hammer Curls", sets: 3, reps: "10-12", note: "Neutral grip for brachialis"},
            {name: "Tricep Pushdowns", sets: 3, reps: "12-15", note: "Keep elbows close to body"}
          ]
        },
        {
          name: "Day 6: Core & Stability",
          focus: "Core",
          exercises: [
            {name: "Plank", sets: 3, reps: "30-60 seconds", note: "Keep body in straight line"},
            {name: "Russian Twists", sets: 3, reps: "15-20 per side", note: "Rotate from waist"},
            {name: "Hanging Leg Raises", sets: 3, reps: "10-15", note: "Control the movement"},
            {name: "Cable Woodchoppers", sets: 3, reps: "12 per side", note: "Rotate through core"}
          ]
        },
        {
          name: "Day 7: Rest & Recovery",
          focus: "Active Recovery",
          exercises: [
            {name: "Light Walking", sets: 1, reps: "20-30 minutes", note: "Maintain heart rate at 50-60% max"},
            {name: "Stretching Routine", sets: 1, reps: "10-15 minutes", note: "Focus on tight areas"},
            {name: "Foam Rolling", sets: 1, reps: "5-10 minutes", note: "Target main muscle groups"}
          ]
        }
      ],
      isLoading: false
    });
  }
};

  // Calculate basic insights from workout data
  const calculateBasicInsights = () => {
    // Handle empty workout case
    if (!workouts || workouts.length === 0) {
      return {
        streak: 0,
        muscleGroups: [],
        recommendations: [
          "Start tracking your workouts to get personalized recommendations",
          "Try to maintain consistent workout frequency for best results",
          "Focus on proper form before increasing weight"
        ]
      };
    }
  
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime()
    );
    
    // Calculate streak
    let streak = 0;
    if (sortedWorkouts.length > 0) {
      // Simple streak calculation
      const today = new Date();
      const lastWorkoutDate = new Date(sortedWorkouts[sortedWorkouts.length - 1].createdAt || sortedWorkouts[sortedWorkouts.length - 1].date);
      const daysSinceLastWorkout = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysSinceLastWorkout <= 1) {
        // Count consecutive days with workouts
        let currentStreak = 1;
        for (let i = sortedWorkouts.length - 2; i >= 0; i--) {
          const currentDate = new Date(sortedWorkouts[i].createdAt || sortedWorkouts[i].date);
          const prevDate = new Date(sortedWorkouts[i + 1].createdAt || sortedWorkouts[i + 1].date);
          const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
          
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
        streak = currentStreak;
      }
    }
    
    // Calculate muscle group distribution
    const muscleGroupCounts: Record<string, number> = {};
    let totalExercises = 0;
    
    // Based on your workout structure in page.tsx, it appears each workout has a muscle group
    workouts.forEach(workout => {
      const muscleGroup = workout.muscle_Group || "Other";
      muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1;
      totalExercises++;
    });
    
    const muscleGroups = Object.entries(muscleGroupCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalExercises) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3); // Top 3 muscle groups
    
    // Generate basic recommendations
    const recommendations: string[] = [];
    
    // Check for muscle group imbalances
    if (muscleGroups.length > 1) {
      const highestPercentage = muscleGroups[0].percentage;
      const lowestPercentage = muscleGroups[muscleGroups.length - 1].percentage;
      
      if (highestPercentage > lowestPercentage * 2) {
        recommendations.push(`Balance your training by increasing ${muscleGroups[muscleGroups.length - 1].name} frequency`);
      }
    }
    
    // Check volume trends
    const recentWorkouts = sortedWorkouts.slice(-5);
    if (recentWorkouts.length >= 3) {
      const avgWeight = recentWorkouts.reduce((sum, workout) => sum + (workout.weight || 0), 0) / recentWorkouts.length;
      if (avgWeight > 0) {
        recommendations.push(`Your recent average weight is ${avgWeight.toFixed(1)}kg. Try for progressive overload by increasing 2.5-5kg`);
      }
    }
    
    // Add generic recommendations if we don't have enough
    if (recommendations.length < 3) {
      const genericRecommendations = [
        "Try progressive overload on your main compound exercises",
        "Consider adding one rest day between intense training sessions",
        "Focus on proper form before increasing weights",
        "Track nutrition alongside workouts for optimal results",
        "Include adequate protein intake to support muscle recovery"
      ];
      
      // Add enough generic recommendations to reach 3 total
      for (let i = 0; i < genericRecommendations.length && recommendations.length < 3; i++) {
        if (!recommendations.includes(genericRecommendations[i])) {
          recommendations.push(genericRecommendations[i]);
        }
      }
    }
    
    return {
      streak,
      muscleGroups,
      recommendations: recommendations.slice(0, 3)
    };
  };
  
  // Get AI-enhanced insights using Gemini
  // filepath: f:\Programming\full stack project\UIs\workout tracker\workout-tracker\components\aiChat.tsx
// Get AI-enhanced insights using Gemini
const getAIInsights = async (workouts: any[]) => {
    try {
      // Format workout data for the AI based on your actual data structure
      const workoutSummary = {
        count: workouts.length,
        muscleGroups: calculateBasicInsights().muscleGroups,
        recentWorkouts: workouts.slice(-5).map(w => ({
          date: w.createdAt || w.date,
          title: w.title,
          muscle: w.muscle_Group,
          weight: w.weight,
          reps: w.reps
        }))
      };
      
      // Send to Gemini API
      const prompt = `As a fitness expert, analyze this workout data and provide insights:
      ${JSON.stringify(workoutSummary)}
      
      Return ONLY a JSON object with:
      1. Three specific recommendations based on the workout data
      2. Any notable patterns or insights about training balance
      
      Format: { "recommendations": ["rec1", "rec2", "rec3"] }
      
      IMPORTANT: Return just the plain JSON without any markdown formatting, code blocks, or additional text.`;
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': undefined 
          }
        }
      );
      
      // Parse the response
      const aiText = response.data.candidates[0].content.parts[0].text;
      try {
        // Clean up the text to handle markdown and code blocks that Gemini might include
        const cleanedResponse = aiText
          .replace(/```json|```|\`/g, '') // Remove markdown code blocks and backticks
          .replace(/^\s*[\r\n]/gm, '')    // Remove empty lines
          .trim();                        // Remove trailing/leading whitespace
        
        console.log("Cleaned response:", cleanedResponse);
        
        // Find JSON object in the text
        const jsonMatch = cleanedResponse.match(/(\{[\s\S]*\})/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
        
        const aiData = JSON.parse(jsonString);
        if (aiData.recommendations && Array.isArray(aiData.recommendations)) {
          return { recommendations: aiData.recommendations.slice(0, 3) };
        }
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        console.log("Raw AI response:", aiText);
      }
    } catch (error) {
      console.error("Error calling Gemini API for insights:", error);
    }
    
    return null;
  };

  // Function to call Gemini API
  const fetchGeminiResponse = async (prompt: string) => {
    try {
      // Replace YOUR_GEMINI_API_KEY with your actual API key in production
      // In production, this should be secured in environment variables
      
      
      // Add workout-specific context to make responses more relevant
      const enhancedPrompt = `You are a professional fitness coach with expertise in workout planning, technique, and nutrition. Respond specifically about fitness and workouts. 
      The user's question is: ${prompt}`;
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: enhancedPrompt}]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': undefined 
          }
        }
      );
      console.log(response)
      // Extract the response text from Gemini API
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm having trouble connecting to my knowledge base right now. Here's my best advice: Focus on proper form first, then progressive overload. For your current level, I recommend following a structured program with built-in progression.";
    }
  };

  const handleSend = async () => {
    if (!query.trim()) return;
    
    // Add user message to conversation
    const userMessage = { type: 'user' as const, content: query };
    setConversation(prev => [...prev, userMessage]);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // In development/testing mode, you can use this simulated response
      let aiResponse;
      
      // Uncomment this section and comment out the next section to use the mock response generator
      // aiResponse = generateMockResponse(query);
      
      // Use actual Gemini API (comment this out if using mock responses)
      aiResponse = await fetchGeminiResponse(query);
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { type: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setConversation(prev => [...prev, { 
        type: 'assistant', 
        content: "I'm sorry, I encountered an issue processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  // Mock response generator for testing (use when API is not connected)
  const generateMockResponse = (userQuery: string) => {
    const lowerQuery = userQuery.toLowerCase();
    
    if (lowerQuery.includes('leg') || lowerQuery.includes('calf')) {
      return "Based on your recent leg workouts, I've noticed you're consistently performing calf raises and hamstring curls. To improve your leg development, consider adding squats and lunges to target your quadriceps more effectively. Your current volume looks good, but you might benefit from increasing weight on your hamstring exercises by 5-10% for optimal growth.";
    } else if (lowerQuery.includes('shoulder') || lowerQuery.includes('shrug')) {
      return "Your shoulder training shows good variety with different shrug variations. To complement this, I'd recommend adding some overhead pressing movements and lateral raises to ensure balanced deltoid development. Based on your progress, you could aim for 3 shoulder sessions every 2 weeks for optimal recovery and growth.";
    } else if (lowerQuery.includes('plan') || lowerQuery.includes('schedule')) {
      return "Looking at your workout history, I recommend a 4-day split: Day 1: Chest/Triceps, Day 2: Back/Biceps, Day 3: Legs, Day 4: Shoulders/Core. This would optimize your current training pattern while ensuring adequate recovery between muscle groups. Your data shows you're most consistent with workouts in the evening, so I'd suggest maintaining that timeframe.";
    } else {
      return "Based on your workout data, I notice you've been training consistently for 19 days. Great job maintaining your streak! Your recent focus has been on legs and shoulders. For balanced development, consider incorporating more chest and back exercises in your upcoming sessions. Would you like a specific recommendation for your next workout?";
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestedPrompts = [
    "Analyze my leg workout routine",
    "Suggest a weekly workout plan",
    "How can I improve my shoulder exercises?",
    "What muscle groups should I focus on next?"
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="p-0 w-full sm:w-[80%] sm:max-w-[800px] border-l border-gray-800 bg-gray-900 backdrop-blur-none">
        <SheetHeader className="px-6 py-4 border-b border-gray-800">
          <SheetTitle className="text-white flex items-center">
            <Zap className="text-blue-500 w-5 h-5 mr-2" />
            Fitness AI Advisor
          </SheetTitle>
        </SheetHeader>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button 
            className={`flex-1 py-2 px-4 ${activeTab === 'chat' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('chat')}
          >
            <div className="flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </div>
          </button>
          <button 
            className={`flex-1 py-2 px-4 ${activeTab === 'insights' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('insights')}
          >
            <div className="flex items-center justify-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Insights
            </div>
          </button>
          <button 
            className={`flex-1 py-2 px-4 ${activeTab === 'plans' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('plans')}
          >
            <div className="flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-2" />
              Plans
            </div>
          </button>
          <button 
            className={`flex-1 py-2 px-4 ${activeTab === 'advice' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('advice')}
          >
            <div className="flex items-center justify-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Tips
            </div>
          </button>
        </div>

        <div className="h-[calc(100%-130px)] flex flex-col">
          {activeTab === 'chat' && (
            <>
              {/* Conversation Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {conversation.map((message, index) => (
                  <div key={index} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-100'
                    }`}>
                      <div className="flex items-center mb-1">
                        {message.type === 'assistant' ? (
                          <Zap className="w-4 h-4 mr-1 text-blue-400" />
                        ) : (
                          <User className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-xs font-semibold">
                          {message.type === 'assistant' ? 'Fitness AI' : 'You'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-800 text-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-blue-400" />
                        <span className="text-xs font-semibold">Fitness AI</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Prompts */}
              <div className="px-6 pb-2 border-t border-gray-800 bg-gray-900">
                <div className="text-xs text-gray-400 mt-3 mb-2">Try asking:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-2 rounded-full flex items-center"
                      onClick={() => setQuery(prompt)}
                    >
                      <ChevronsRight className="w-3 h-3 mr-1" />
                      {prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-800 p-3 mt-auto">
                <div className="flex rounded-lg bg-gray-800 overflow-hidden">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask for workout advice..."
                    className="flex-1 px-4 py-2 bg-transparent text-white focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!query.trim() || isLoading}
                    className={`px-3 flex items-center justify-center ${
                      !query.trim() || isLoading ? 'text-gray-500' : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'insights' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Trophy className="text-yellow-500 w-5 h-5 mr-2" />
                  <h4 className="font-semibold text-white">Streak Analysis</h4>
                </div>
                <p className="text-sm text-gray-300">
                  {workouts.length === 0 
                    ? "No workout data available yet. Start logging your workouts!" 
                    : `You're on a ${workoutInsights.streak}-day streak! Users who maintain ${Math.min(workoutInsights.streak + 5, 20)}+ day streaks see 40% better results on average.`}
                </p>
              </div>
              
              {workouts.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Dumbbell className="text-blue-400 w-5 h-5 mr-2" />
                    <h4 className="font-semibold text-white">Training Balance</h4>
                  </div>
                  {workoutInsights.muscleGroups.map((group, index) => (
                    <div key={index} className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{group.name}</span>
                        <span>{group.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${group.percentage}%`}}></div>
                      </div>
                    </div>
                  ))}
                  {workoutInsights.muscleGroups.length === 0 && (
                    <p className="text-sm text-gray-300 mt-2">No muscle group data available yet.</p>
                  )}
                </div>
              )}
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Lightbulb className="text-yellow-400 w-5 h-5 mr-2" />
                  <h4 className="font-semibold text-white">Recommendations</h4>
                </div>
                {workoutInsights.recommendations.length > 0 ? (
                  <ul className="text-sm text-gray-300 space-y-2">
                    {workoutInsights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-gray-700 rounded-full p-1 mr-2 mt-0.5">
                          <ChevronsRight className="w-3 h-3 text-blue-400" />
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-300">
                    Start tracking your workouts to receive personalized recommendations!
                  </p>
                )}
              </div>
            </div>
          )}
          
          // Inside your component's JSX where the plans tab content is rendered:
{activeTab === 'plans' && (
  <div className="flex-1 p-6 overflow-y-auto">
    {workoutPlans.isLoading ? (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-200"></div>
        </div>
        <p className="text-gray-400">Generating personalized 7-day workout plan...</p>
      </div>
    ) : (
      <>
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-white mb-3 flex items-center text-lg">
            <Calendar className="text-blue-400 w-5 h-5 mr-2" />
            {workoutPlans.title}
            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
              {workouts.length < 5 ? "Beginner" : workouts.length < 20 ? "Intermediate" : "Advanced"}
            </span>
          </h4>
          
          <div className="space-y-4">
            {workoutPlans.days.length > 0 ? (
              workoutPlans.days.map((day, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded">
                  <div className="text-blue-400 font-medium flex items-center">
                    {day.name}
                    {day.focus && (
                      <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                        {day.focus}
                      </span>
                    )}
                  </div>
                  {day.exercises && day.exercises.length > 0 ? (
                    <div className="mt-2">
                      {day.exercises.map((exercise, idx) => (
                        <div key={idx} className="mb-2 border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div className="text-white font-medium">
                              {exercise.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {exercise.sets} × {exercise.reps}
                            </div>
                          </div>
                          {exercise.note && (
                            <div className="text-xs text-gray-400 mt-1 flex items-center">
                              <Lightbulb className="w-3 h-3 mr-1 text-yellow-400" />
                              {exercise.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 mt-1">Rest day</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No workout plan generated yet</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={generateWorkoutPlan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Generate New 7-Day Plan
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center mb-2">
            <Lightbulb className="text-yellow-400 w-5 h-5 mr-2" />
            <h4 className="font-semibold text-white">Plan Guidelines</h4>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            This 7-day plan targets all major muscle groups for balanced development. Each day focuses on a specific area to maximize recovery between sessions.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
              Progressive overload weekly
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
              48hr muscle group recovery
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
              Hydrate throughout workouts
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
              Follow note guidance for form
            </div>
          </div>
        </div>
      </>
    )}
  </div>
)}
          {/* New Advice Tab */}
          {activeTab === 'advice' && (
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Category Filter */}
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                <button 
                  className={`text-xs whitespace-nowrap px-3 py-1 rounded-full ${adviceFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setAdviceFilter('all')}
                >
                  All Tips
                </button>
                <button 
                  className={`text-xs whitespace-nowrap px-3 py-1 rounded-full ${adviceFilter === 'technique' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setAdviceFilter('technique')}
                >
                  Technique
                </button>
                <button 
                  className={`text-xs whitespace-nowrap px-3 py-1 rounded-full ${adviceFilter === 'recovery' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setAdviceFilter('recovery')}
                >
                  Recovery
                </button>
                <button 
                  className={`text-xs whitespace-nowrap px-3 py-1 rounded-full ${adviceFilter === 'planning' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setAdviceFilter('planning')}
                >
                  Planning
                </button>
              </div>

              {/* Advice Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAdvice.map((card, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center mb-2">
                      {card.icon}
                      <h4 className="font-semibold text-white ml-2">{card.title}</h4>
                    </div>
                    <p className="text-sm text-gray-300">{card.content}</p>
                    <div className="mt-3">
                      <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-blue-300">
                        {card.category.charAt(0).toUpperCase() + card.category.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Ask AI message */}
              <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-300 mb-2">Want more personalized advice?</p>
                <button 
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto"
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI Advisor
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}