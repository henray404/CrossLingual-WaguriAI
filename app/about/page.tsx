import Link from "next/link"
import { ArrowLeft, Brain, Languages, Sparkles, Cpu, Database, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border-2 border-pink-200">
              <img
                src="/cute-anime-girl-avatar-with-pink-hair-waguri-ai-ma.jpg"
                alt="Waguri AI"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-semibold text-pink-400">Waguri AI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-pink-400 transition-colors">
              Chat
            </Link>
            <Link href="/about" className="text-pink-500 font-medium border-b-2 border-pink-400 pb-1">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chat</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-pink-100 border-4 border-pink-200 overflow-hidden shadow-lg">
              <img
                src="/cute-anime-girl-avatar-with-pink-hair-waguri-ai-ma.jpg"
                alt="Waguri AI"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">About Waguri AI</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A bilingual conversational AI assistant fine-tuned for Indonesian and English language understanding
            </p>
          </div>

          {/* README-style Content */}
          <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-8 mb-8">
            {/* Project Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-400" />
                Project Overview
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Waguri AI is a bilingual conversational assistant developed as a final project for Machine Learning and
                Data Mining. The model is designed to understand and respond naturally in both Indonesian and English,
                making it accessible to a wider audience in Southeast Asia.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The name "Waguri" is inspired by the Japanese word for chestnut, symbolizing warmth and nourishment -
                qualities we want our AI assistant to embody in every conversation.
              </p>
            </section>

            {/* Technical Details */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-pink-400" />
                Technical Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Base Model</h3>
                  <p className="text-gray-600 text-sm">
                    Qwen 2.5 - A state-of-the-art large language model with strong multilingual capabilities
                  </p>
                </div>
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Fine-tuning Method</h3>
                  <p className="text-gray-600 text-sm">
                    XLoRA (Extended Low-Rank Adaptation) - Efficient fine-tuning technique for domain adaptation
                  </p>
                </div>
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Training Data</h3>
                  <p className="text-gray-600 text-sm">
                    Curated bilingual dataset of conversational exchanges in Indonesian and English
                  </p>
                </div>
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Inference</h3>
                  <p className="text-gray-600 text-sm">
                    FastAPI backend with optimized inference pipeline for real-time responses
                  </p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-pink-400" />
                Key Features
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Bilingual Support</h4>
                    <p className="text-gray-600 text-sm">
                      Seamlessly switches between Indonesian and English based on user preference
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Context-Aware Responses</h4>
                    <p className="text-gray-600 text-sm">
                      Maintains conversation context for coherent multi-turn dialogues
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Customizable Parameters</h4>
                    <p className="text-gray-600 text-sm">
                      Adjust temperature, top-p, and other generation parameters for desired output style
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            {/* API Reference */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">API Reference</h2>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  {`POST /api/chat

Request Body:
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "config": {
    "system_prompt": "You are Waguri AI...",
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 256,
    "do_sample": true,
    "lang": "id" | "en"
  }
}

Response:
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Halo! Aku Waguri AI..."
      }
    }
  ]
}`}
                </pre>
              </div>
            </section>

            {/* Team */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Team</h2>
              <p className="text-gray-600 mb-4">
                This project was developed as part of our Machine Learning and Data Mining final project. Special thanks
                to all contributors who made this possible.
              </p>
              <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                <p className="text-gray-700 italic text-center">"Building AI that speaks your language, literally."</p>
              </div>
            </section>
          </div>

          {/* Tech Stack */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Built with</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 border border-pink-200 shadow-sm">
                Qwen 2.5
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 border border-pink-200 shadow-sm">
                XLoRA
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 border border-pink-200 shadow-sm">
                FastAPI
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 border border-pink-200 shadow-sm">
                Next.js
              </span>
              <span className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 border border-pink-200 shadow-sm">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-pink-100 bg-white">
        <p>Our Machine Learning and Data Mining Final Project</p>
        <p className="text-pink-400">Powered by Qwen 2.5 + XLoRA Fine-tuning</p>
      </footer>
    </div>
  )
}
