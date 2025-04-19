"use client";
import { WorkoutForm } from "@/components/workoutForm";
import WorkoutDetails from "@/components/workoutDetails";
import useWorkoutState from "./store/useworkoutState";
import { GymCalendar } from "@/components/calendar";
import useUserState from "./store/userUpdateStore";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { MessageSquare, Send, User, ChevronsRight, X, Lightbulb, 
         Dumbbell, Calendar, Trophy, Zap } from 'lucide-react';

export default function Home() {
  const { workouts } = useWorkoutState();
  const { logout } = useUserState();
  const router = useRouter();
  
  // Fitness AI Advisor state
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'assistant',
      content: "Hello! I'm your Fitness AI Advisor. I can analyze your workout data and provide personalized recommendations. What would you like help with today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const handleSend = () => {
    if (!query.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { type: 'user', content: query }]);
    
    // Simulate AI processing
    setIsLoading(true);
    setTimeout(() => {
      const newResponse = { 
        type: 'assistant', 
        content: generateResponse(query) 
      };
      setConversation([...conversation, { type: 'user', content: query }, newResponse]);
      setIsLoading(false);
      setQuery('');
    }, 1500);
  };

  const generateResponse = (userQuery: string) => {
    // This would be replaced by actual AI integration
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

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
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
    <>
      <div className="flex h-screen w-full">
        <div className="bg-[#020817] w-full flex flex-col item">
          <div className="text-4xl font-bold text-white w-10/12 mx-auto py-8 flex-nowrap">
            Welcome to Rep-Sync
            <div onClick={() => {
              logout();
              router.push('/login');
            }} className="text-sm bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer inline-block ml-4">
              Logout
            </div>
          </div>
          <div className="w-full flex justify-center mx-auto overflow-x-auto">
            <div className="w-full flex justify-center pr-5">
              <GymCalendar />
            </div>
          </div>
          <div className="text-white m-3 flex flex-col items-center">
            <div className="text-3xl font-semibold text-white py-3 w-10/12 flex justify-between">
              Recent Workouts
              <div className="text-black pr-7">
                <WorkoutForm muscleExist={false} muscleName="" workoutName="" />
              </div>
            </div>
            <div className="w-10/12">
              <WorkoutDetails data={workouts} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Fitness AI Advisor */}
      <div className="relative">
        {/* Button to open the advisor */}
        {!isOpen && (
          <button 
            onClick={toggleDrawer}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}

        {/* AI Advisor Panel */}
        {isOpen && (
          <div className="fixed bottom-0 right-6 w-96 bg-gray-900 rounded-t-lg shadow-2xl border border-gray-800 flex flex-col max-h-[600px] z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950 rounded-t-lg">
              <div className="flex items-center">
                <Zap className="text-blue-500 w-5 h-5 mr-2" />
                <h3 className="font-bold text-white">Fitness AI Advisor</h3>
              </div>
              <button onClick={toggleDrawer} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
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
            </div>

            {activeTab === 'chat' && (
              <>
                {/* Conversation Area */}
                <div className="flex-1 p-4 overflow-y-auto">
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
                        <p className="text-sm">{message.content}</p>
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
                <div className="px-4 pb-2">
                  <div className="text-xs text-gray-400 mb-2">Try asking:</div>
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
                <div className="border-t border-gray-800 p-3">
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
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Trophy className="text-yellow-500 w-5 h-5 mr-2" />
                    <h4 className="font-semibold text-white">Streak Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-300">You are on a 19-day streak! Users who maintain 20+ day streaks see 40% better results on average.</p>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Dumbbell className="text-blue-400 w-5 h-5 mr-2" />
                    <h4 className="font-semibold text-white">Training Balance</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Legs</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Shoulders</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Other muscle groups</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="text-yellow-400 w-5 h-5 mr-2" />
                    <h4 className="font-semibold text-white">Recommendations</h4>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-1 mr-2 mt-0.5">
                        <ChevronsRight className="w-3 h-3 text-blue-400" />
                      </div>
                      <span>Increase chest training frequency by 1 session per week</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-1 mr-2 mt-0.5">
                        <ChevronsRight className="w-3 h-3 text-blue-400" />
                      </div>
                      <span>Try progressive overload on your shoulder exercises</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-1 mr-2 mt-0.5">
                        <ChevronsRight className="w-3 h-3 text-blue-400" />
                      </div>
                      <span>Consider adding bicep isolation exercises for balance</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'plans' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-white mb-2">Recommended 4-Day Split</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-900 p-3 rounded">
                      <div className="text-blue-400 font-medium">Day 1: Chest & Triceps</div>
                      <ul className="text-sm text-gray-300 mt-1">
                        <li>• Bench Press: 3 sets × 8-10 reps</li>
                        <li>• Incline Dumbbell Press: 3 sets × 10-12 reps</li>
                        <li>• Tricep Pushdowns: 3 sets × 12-15 reps</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900 p-3 rounded">
                      <div className="text-blue-400 font-medium">Day 2: Back & Biceps</div>
                      <ul className="text-sm text-gray-300 mt-1">
                        <li>• Pull-ups: 3 sets × max reps</li>
                        <li>• Barbell Rows: 3 sets × 8-10 reps</li>
                        <li>• Bicep Curls: 3 sets × 10-12 reps</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900 p-3 rounded">
                      <div className="text-blue-400 font-medium">Day 3: Legs</div>
                      <ul className="text-sm text-gray-300 mt-1">
                        <li>• Squats: 3 sets × 8-10 reps</li>
                        <li>• Romanian Deadlifts: 3 sets × 10-12 reps</li>
                        <li>• Standing Calf Raises: 3 sets × 15-20 reps</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900 p-3 rounded">
                      <div className="text-blue-400 font-medium">Day 4: Shoulders & Core</div>
                      <ul className="text-sm text-gray-300 mt-1">
                        <li>• Overhead Press: 3 sets × 8-10 reps</li>
                        <li>• Lateral Raises: 3 sets × 12-15 reps</li>
                        <li>• Plank: 3 sets × 45-60 seconds</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Plan to Calendar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}