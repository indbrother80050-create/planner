/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Clock, 
  Briefcase, 
  User, 
  Heart, 
  MoreHorizontal,
  RefreshCw,
  X
} from 'lucide-react';
import { Todo, Suggestion } from './types';
import { getPlannerSuggestions } from './lib/gemini';

const CATEGORIES = [
  { id: 'work', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'personal', icon: User, color: 'text-bloom-clay', bg: 'bg-clay-50' },
  { id: 'health', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'other', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-50' },
] as const;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('bloom-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Todo['category']>('personal');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    localStorage.setItem('bloom-todos', JSON.stringify(todos));
  }, [todos]);

  const stats = useMemo(() => {
    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, progress };
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      category: selectedCategory,
      createdAt: Date.now(),
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    setShowSuggestions(true);
    const result = await getPlannerSuggestions(todos);
    setSuggestions(result);
    setIsGenerating(false);
  };

  const addSuggestion = (s: Suggestion) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: s.title,
      completed: false,
      category: s.category,
      createdAt: Date.now(),
    };
    setTodos([todo, ...todos]);
    setSuggestions(suggestions.filter(item => item.title !== s.title));
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-bloom-cream px-4 py-8 md:py-16 selection:bg-bloom-sage/30">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="serif text-5xl md:text-7xl font-light tracking-tight mb-2 text-bloom-ink">
              Bloom <span className="italic font-normal">Planner</span>
            </h1>
            <p className="text-bloom-olive/60 font-medium tracking-wide uppercase text-xs flex items-center justify-center md:justify-start gap-2">
              <Calendar size={14} />
              {today}
            </p>
          </motion.div>
        </header>

        {/* Stats & AI Trigger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-bloom-ink/5 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-bloom-olive/40 uppercase tracking-widest mb-1">Daily Progress</p>
              <h2 className="serif text-3xl font-medium">{stats.progress}%</h2>
            </div>
            <div className="mt-4 h-1 w-full bg-bloom-cream rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-bloom-sage"
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-bloom-olive/60 mt-2">{stats.completed} of {stats.total} tasks completed</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="bg-bloom-olive text-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center gap-3 transition-colors hover:bg-bloom-olive/90 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="animate-spin" size={24} />
            ) : (
              <Sparkles size={24} className="text-bloom-clay" />
            )}
            <div className="text-center">
              <p className="text-sm font-medium">AI Suggestions</p>
              <p className="text-xs text-white/60">Balance your day</p>
            </div>
          </motion.button>
        </div>

        {/* Input */}
        <motion.form 
          onSubmit={handleAddTodo}
          className="bg-white rounded-3xl p-4 shadow-sm border border-bloom-ink/5 mb-8 flex items-center gap-3"
        >
          <div className="flex gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-2 rounded-full transition-all ${selectedCategory === cat.id ? cat.bg + ' ' + cat.color : 'text-gray-300 hover:text-gray-400'}`}
              >
                <cat.icon size={18} />
              </button>
            ))}
          </div>
          <input 
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to bloom today?"
            className="flex-1 bg-transparent outline-none text-bloom-ink placeholder:text-bloom-olive/30 font-medium"
          />
          <button 
            type="submit"
            className="bg-bloom-sage text-white p-2 rounded-full hover:bg-bloom-sage/90 transition-colors"
          >
            <Plus size={20} />
          </button>
        </motion.form>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-bloom-sage/10 rounded-3xl p-6 border border-bloom-sage/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="serif text-xl font-medium flex items-center gap-2">
                    <Sparkles size={18} className="text-bloom-clay" />
                    Suggested for you
                  </h3>
                  <button onClick={() => setShowSuggestions(false)} className="text-bloom-olive/40 hover:text-bloom-olive">
                    <X size={18} />
                  </button>
                </div>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center py-8 gap-4">
                    <div className="flex gap-2">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-bloom-sage" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-bloom-sage" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-bloom-sage" />
                    </div>
                    <p className="text-xs font-medium text-bloom-olive/60 uppercase tracking-widest italic">Cultivating ideas...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {suggestions.map((s, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/60 p-4 rounded-2xl flex items-start justify-between group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-bloom-sage px-2 py-0.5 bg-bloom-sage/10 rounded-full">
                              {s.category}
                            </span>
                            <h4 className="font-semibold text-sm">{s.title}</h4>
                          </div>
                          <p className="text-xs text-bloom-ink/70 mb-2">{s.description}</p>
                          <p className="text-[10px] italic text-bloom-olive/50">" {s.reason} "</p>
                        </div>
                        <button 
                          onClick={() => addSuggestion(s)}
                          className="ml-4 p-2 rounded-full bg-bloom-sage text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex p-6 rounded-full bg-bloom-sage/5 mb-4">
                  <Clock size={40} className="text-bloom-sage/20" />
                </div>
                <p className="serif text-2xl text-bloom-ink/30 italic">Your garden is empty. Let's plant some tasks.</p>
              </motion.div>
            ) : (
              todos.map((todo) => {
                const category = CATEGORIES.find(c => c.id === todo.category) || CATEGORIES[3];
                return (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group bg-white rounded-3xl p-4 shadow-sm border border-bloom-ink/5 flex items-center gap-4 transition-all ${todo.completed ? 'opacity-50' : ''}`}
                  >
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-bloom-sage border-bloom-sage text-white' : 'border-bloom-sage/20 hover:border-bloom-sage'}`}
                    >
                      {todo.completed && <Check size={14} />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`font-medium transition-all ${todo.completed ? 'line-through text-bloom-ink/40' : 'text-bloom-ink'}`}>
                        {todo.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <category.icon size={12} className={category.color} />
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${category.color}`}>
                          {todo.category}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-bloom-ink/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-bloom-olive/30">
            Cultivate your time with intention
          </p>
        </footer>
      </div>
    </div>
  );
}
