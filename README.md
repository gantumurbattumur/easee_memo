# Easee Memo 

**Easee Memo** is an AI-powered web application that helps users **train their memory using the Memory Palace technique** — a centuries-old visualization method enhanced with modern AI storytelling and feedback systems.

🌐 **Live App:** [https://easee-memo.onrender.com](https://easee-memo.onrender.com)  
🎨 **Frontend (Vercel):** [https://easee-memo.vercel.app](https://easee-memo.vercel.app)

---

## 💡 What Is Easee Memo?

Easee Memo transforms the way you learn and recall information.  
Instead of rote memorization, it helps you **convert knowledge into vivid mental stories** tied to familiar locations (your “Memory Palace”).  

The app guides users through four simple, scrollable steps:
1. **Imagine your palace** – visualize places you know well (like your home).  
2. **Build it in the app** – add locations (doorway, desk, window...) as memory “spots.”  
3. **Generate a story** – AI (Gemini) creates an imaginative story linking your topic to each palace spot.  
4. **Recall & review** – you test your memory, describing what each location represents, and receive **AI feedback** on accuracy.

---

## 🎯 Why This Project Matters

Traditional memorization is passive and repetitive.  
Easee Memo makes it:
- **Visual** – information is anchored to physical spaces you imagine.  
- **Interactive** – users actively create, walk through, and recall their palace stories.  
- **AI-Assisted** – Gemini generates memorable stories, and recall feedback is powered by **semantic similarity models** and **AI reasoning**, showing how well you remembered each part.

This hybrid approach merges **ancient mnemonic science** with **modern AI evaluation**, making memorization engaging, measurable, and effective.

---

## 🧠 Key Features

- **Memory Palace Builder** – Create your own palaces and define locations.  
- **AI Story Generation** – Gemini transforms abstract topics into walkable stories.  
- **Recall Trainer** – Enter what you remember and get instant feedback.  
- **AI Feedback System** – Evaluates correctness using sentence-transformers and Gemini reasoning.  
- **Smooth Scroll UX** – All steps (palace → story → recall) on one guided page.  

---

## ⚙️ Technology Overview

| Layer | Tools & Frameworks |
|-------|--------------------|
| Frontend | React (Vite), Tailwind CSS, React Router |
| Backend | FastAPI, Sentence-Transformers, Gemini API |
| Database | Render-hosted (PostgreSQL) |
| Hosting | Backend: Render • Frontend: Vercel |

---

## 🧩 How It Works (In Simple Terms)

1. **User Input:** Topic + Palace spots  
2. **AI Generation:** Gemini creates a narrative linking topic → spots  
3. **Recall Test:** User describes each spot’s meaning  
4. **Feedback:**  
   - Sentence-transformer compares meaning similarity  
   - Gemini gives natural-language feedback like:  
     > “🟡 Partially correct — you remembered the structure but missed key details.”

---

## 📈 Why Easee Memo Stands Out

- **Bridges human memory and artificial intelligence**  
- **Gamifies studying** using personalized visualization  
- **Encourages understanding over repetition**  
- **Open, educational, and creative** — applicable for language learning, exams, or skill mastery  

---

### Author

Developed by **[Gantumur Battumur](https://github.com/gantumurbattumur)**    
“Making memory training smarter, visual, and AI-driven.”
