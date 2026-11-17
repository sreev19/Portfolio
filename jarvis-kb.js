/* =====================================================================
   JARVIS knowledge base
   ---------------------------------------------------------------------
   Edit this file to change what JARVIS knows. No other code needs to change.

   Each topic has:
     id       – unique name
     keys     – words or phrases that point to this topic.
                Single words also match small typos and word endings
                ("project" matches "projects"). Phrases ("rag chatbot")
                must appear as written and count extra.
     answer   – what JARVIS says. Use [link text](url) for links and
                \n for a line break. Keep it short: 1–4 sentences.
     more     – (optional) what JARVIS says if the visitor asks "tell me more".
     chips    – (optional) follow-up questions shown as buttons.
     weight   – (optional) lower it (e.g. 0.3) for broad topics so specific ones win.

   "private" topics are always checked first, so JARVIS never answers them.
   ===================================================================== */
window.JARVIS_KB = {
  owner: "Srivalli",

  greeting:
    "Hello! I'm JARVIS, my buddy Srivalli's AI assistant. I can brief you on her skills, projects, experience, or how to get in touch. What would you like to know?",

  starterChips: ["Who is Srivalli?", "What are her skills?", "Show me her projects", "Is she open to work?"],

  fallback:
    "I'm afraid that's not in the briefing my buddy gave me. I'm a scripted assistant for now, so I stick to what I know for certain. You could ask about her skills, projects or experience, or write to her directly at [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com).",

  fallbackChips: ["What are her skills?", "Her projects", "How do I contact her?"],

  noMore:
    "That's everything I have on that topic. Anything else I can brief you on?",

  /* ---------- topics JARVIS politely declines (checked first) ---------- */
  private: [
    {
      id: "salary",
      keys: ["salary", "ctc", "salary package", "pay package", "what package", "pay", "compensation", "expected salary", "lpa", "stipend", "wage"],
      answer:
        "Compensation is a conversation my buddy prefers to have directly, so I'll respectfully stay out of it. You can reach her at [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com).",
    },
    {
      id: "age",
      keys: ["age", "old", "birthday", "born", "date of birth", "dob", "how old"],
      answer:
        "I'm not at liberty to share personal details like that. What I can tell you is that she graduated in July 2025 and has been building AI projects ever since.",
    },
    {
      id: "phone",
      keys: ["phone", "mobile", "her number", "your number", "phone number", "contact number", "whatsapp", "call her", "cell"],
      answer:
        "I don't give out phone numbers, but email reaches her quickly: [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com). She's also on [LinkedIn](https://www.linkedin.com/in/upputuri-sree19).",
    },
    {
      id: "instagram",
      keys: ["instagram", "insta", "ig", "snapchat", "facebook"],
      answer:
        "I keep her personal social accounts private. For professional conversations, [LinkedIn](https://www.linkedin.com/in/upputuri-sree19) and [GitHub](https://github.com/sreev19) are the right channels.",
    },
    {
      id: "personal",
      keys: [
        "family", "parents", "mother", "mom", "brother", "sister", "siblings", "married", "marriage",
        "husband", "boyfriend", "relationship", "is she single", "personal life", "religion", "caste", "home address", "where does she live",
      ],
      answer:
        "That falls under personal life, which I respectfully keep private. I'm happy to talk about her work, skills and projects though.",
    },
  ],

  /* ---------- everything JARVIS can talk about ---------- */
  topics: [
    {
      id: "hello",
      weight: 0.5,
      keys: ["hi", "hello", "hey", "hii", "good morning", "good evening", "good afternoon", "yo", "namaste"],
      answer:
        "Hello there! I'm JARVIS. Ask me anything about my buddy Srivalli's work, or pick a question below.",
      chips: ["Who is Srivalli?", "What is she doing now?", "Is she open to work?"],
    },
    {
      id: "jarvis",
      keys: ["who are you", "what are you", "jarvis", "are you ai", "are you an ai", "are you real", "are you a real", "real ai", "are you human", "are you a bot", "chatbot", "bot", "how do you work"],
      answer:
        "I'm JARVIS, the assistant my buddy Srivalli built into this site. Right now I'm scripted: I answer only from a briefing she wrote, so everything I tell you is accurate. A smarter version running on her own n8n AI workflow is on the way.",
      chips: ["Who is Srivalli?", "Tell me about her n8n work"],
    },
    {
      id: "about",
      weight: 0.3,   // generic: loses to any specific topic in the same question
      keys: [
        "who is srivalli", "about her", "about srivalli", "introduce", "introduction",
        "summary", "overview", "who is she", "describe", "profile", "background",
      ],
      answer:
        "Srivalli is a Computer Science graduate focused on applied AI: prompt engineering, AI automation, RAG and LLM agents. She builds AI workflows with n8n, vector databases and LLM APIs, works hands-on with Claude and GPT, and backs it all up with machine learning, statistics and Python.",
      more:
        "She's now steering her career fully toward Data Science and AI. Since May 2026 she has been upskilling full time, deepening the maths, statistics and machine learning behind the AI tools she already uses.",
      chips: ["How did she get into tech?", "What are her skills?", "Is she open to work?"],
    },
    {
      id: "story",
      keys: [
        "how did she start", "get into tech", "interest in tech", "journey", "story", "inspiration", "inspired",
        "father", "dad", "childhood", "why computer science", "why cs", "motivation", "motivated", "how it started",
      ],
      answer:
        "Her interest started early, playing games on the computer as a child. She was fascinated by robotics and always wished for an AI assistant of her own, just like JARVIS, the assistant of her favourite Marvel character, Iron Man. That childhood curiosity grew into a clear goal: building that assistant herself.",
      more:
        "Her father worked as a web developer, which made her curious about how software works. Maths was one of her strongest subjects, so she chose the MPC stream in intermediate. Her love of maths, computers and robotics then led her to a B.E. in Computer Science and Engineering, where she was drawn to Data Science and AI and took extra coursework in both.",
      chips: ["Her education", "Why AI?", "What is she doing now?"],
    },
    {
      id: "education",
      keys: [
        "education", "study", "studied", "college", "degree", "university", "graduate", "graduation",
        "cgpa", "gpa", "marks", "school", "matrusri", "btech", "qualification", "intermediate", "mpc",
      ],
      answer:
        "• B.E. in Computer Science and Engineering, Matrusri Engineering College (Dec 2021 – Jul 2025), CGPA 8.22\n• Intermediate, MPC stream, Narayana Junior College (2018 – 2020), 9.7\n• SSC, Vignan High School (2017 – 2018), 9.7",
      more:
        "She chose MPC because maths was one of her strongest subjects. Alongside her degree she completed extra coursework in Data Science and AI, which introduced her to data-driven problem solving and intelligent systems.",
      chips: ["Certifications", "Her research paper", "What are her skills?"],
    },
    {
      id: "skills",
      keys: ["skills", "skill", "skillset", "tech stack", "stack", "technologies", "tools", "what can she do", "expertise", "strong in", "good at"],
      answer:
        "Her core strength is applied AI: prompt engineering, n8n workflow automation, AI agents, RAG, embeddings and vector databases, with Claude and GPT. She backs that up with Python, SQL, machine learning, statistics and data analysis.",
      more:
        "• Libraries: NumPy, Pandas, SciPy, scikit-learn, Matplotlib, Seaborn, OpenCV\n• Backend and tools: FastAPI, Flask, Streamlit, MySQL, SQLite, Power BI, Excel, Git and GitHub\n• Also: HTML/CSS, AI-assisted coding and vibe coding",
      chips: ["AI skills", "Data science skills", "Show me her projects"],
    },
    {
      id: "ai-skills",
      keys: [
        "ai skills", "artificial intelligence", "genai", "generative ai", "llm", "llms", "prompt", "prompt engineering",
        "agents", "agent", "rag", "embeddings", "vector", "claude", "gpt", "openai", "vibe coding", "automation",
      ],
      answer:
        "On the AI side she works with prompt engineering, LLM APIs (Claude and OpenAI GPT), AI agents, RAG pipelines, embeddings and vector databases, and builds automations in n8n. She also uses AI-assisted coding day to day.",
      more:
        "Her goal is to move beyond using AI tools to truly understanding and designing intelligent systems, which is why she's strengthening her maths, statistics and machine learning foundations.",
      chips: ["Tell me about her n8n work", "RAG chatbot project", "Why AI?"],
    },
    {
      id: "ds-skills",
      keys: [
        "data science", "machine learning", "ml", "statistics", "stats", "python", "sql", "pandas", "numpy",
        "scikit", "sklearn", "data analysis", "analytics", "eda", "regression", "power bi", "excel", "visualization",
      ],
      answer:
        "She's comfortable across the data science workflow: data cleaning, EDA, feature engineering, and regression and other machine learning models in Python with Pandas, NumPy, SciPy and scikit-learn. She also does SQL reporting and Power BI and Excel dashboards.",
      more:
        "Her statistics depth shows in her research paper, which compares 15 hypothesis tests using 10,000 Monte Carlo simulations per scenario.",
      chips: ["Insurance prediction project", "Her research paper", "SQL project"],
    },
    {
      id: "projects",
      weight: 0.9,   // a specific project name in the same question wins
      keys: ["projects", "project", "portfolio", "work", "built", "build", "made", "show me", "what has she done"],
      answer:
        "Here's the line-up:\n• RAG chatbot with a self-updating knowledge base (n8n, LLM APIs, vector DB)\n• Healthcare insurance premium prediction (R² 0.93)\n• Face recognition attendance system (96% accuracy)\n• Expense tracking system (FastAPI, MySQL, Streamlit)\n• Finance and Top N insights (25 SQL queries)",
      chips: ["RAG chatbot project", "Insurance prediction project", "Face recognition project", "Expense tracker"],
    },
    {
      id: "rag",
      keys: ["rag chatbot", "rag project", "knowledge base", "self updating", "chatbot project", "google drive", "featured project"],
      answer:
        "Her featured project is a RAG chatbot built in n8n. It answers questions from documents that keep changing. It indexes 150 documents with embeddings and a vector database, and it syncs Google Drive automatically, so new files become searchable without anyone re-uploading anything.",
      chips: ["Tell me about her n8n work", "Other projects"],
    },
    {
      id: "insurance",
      keys: ["insurance", "premium", "healthcare", "prediction", "predict", "regression project"],
      answer:
        "The Healthcare Insurance Premium Prediction project is a machine learning regression model trained on 25,000 records. After data cleaning, EDA and feature engineering, it reached an R² of 0.93 and an RMSE of 2,350, and she deployed it as a Streamlit app for real-time predictions.",
      chips: ["Other projects", "Data science skills"],
    },
    {
      id: "face",
      keys: ["face", "recognition", "attendance", "opencv", "knn", "computer vision", "cv project"],
      answer:
        "The Face Recognition Attendance System is a Flask web app that marks attendance from a live camera feed and resists proxy attendance. It uses KNN on facial embeddings for 96% accuracy and stores records in SQLite, with admin login, registration and tracking pages.",
      chips: ["Other projects", "What are her skills?"],
    },
    {
      id: "expense",
      keys: ["expense", "expenses", "tracker", "tracking", "fastapi", "rest api", "api", "crud"],
      answer:
        "The Expense Tracking System is an end-to-end app. The backend has 8 REST API endpoints built with FastAPI and MySQL, and a Streamlit dashboard breaks spending down by category and by month.",
      chips: ["Other projects", "SQL project"],
    },
    {
      id: "sql",
      keys: ["sql project", "finance", "top n", "insights", "stored procedures", "mysql", "reporting"],
      answer:
        "Finance and Top N Insights is a SQL reporting solution: 25 queries, stored procedures and views that automate finance reporting on key business metrics.",
      chips: ["Other projects", "Data science skills"],
    },
    {
      id: "n8n",
      keys: ["n8n", "workflow", "workflows", "email automation", "email reply", "order", "automations", "her agents", "n8n work"],
      answer:
        "My buddy builds AI agents in n8n to automate practical tasks. One example is an email-reply automation: when an order comes in, the workflow automatically drafts and sends the reply, so nobody has to do it by hand. Her RAG chatbot is also built entirely in n8n.",
      more:
        "She started exploring generative AI, agents, vibe coding and workflow automation after graduating. These builds pushed her to move from using AI tools toward understanding and designing intelligent systems.",
      chips: ["RAG chatbot project", "Why AI?"],
    },
    {
      id: "research",
      keys: ["research", "paper", "publication", "published", "hypothesis", "monte carlo", "simulation", "thesis", "journal", "co author", "co authors", "coauthor", "coauthors", "author", "authors"],
      answer:
        "Her research paper, \"Choosing the Right Hypothesis Test\", is currently under review, and she is the sole author. It compares 15 parametric, exact and non-parametric tests using 10,000 Monte Carlo replications per scenario.",
      more:
        "Key findings: the pooled t test gives 12.3% false positives versus 5% for Welch's t test when variances differ, and rank-based tests gain about 19 percentage points of power on non-normal data. The results became a scenario-based decision guide and flowchart.",
      chips: ["Data science skills", "Her education"],
    },
    {
      id: "experience",
      keys: ["experience", "worked", "work experience", "jobs", "job history", "career", "employment", "companies", "internship", "intern"],
      answer:
        "• Accessibility Tester, Equitech Labs (Sep 2025 – May 2026)\n• Python Programming Intern, Savas Tech Solutions / CodeBegun (Apr – Jun 2024)\n• Data Analytics & Visualization Job Simulation, Accenture North America (Forage)\nSince May 2026 she has been upskilling full time in Data Science and AI.",
      chips: ["Accessibility tester role", "Her internship", "What is she doing now?"],
    },
    {
      id: "tester",
      keys: ["accessibility", "tester", "testing", "equitech", "wcag", "qa"],
      answer:
        "From September 2025 to May 2026 she worked as an Accessibility Tester at Equitech Labs, manually testing websites and PowerPoint files against WCAG 2.1 and documenting defects. The role sharpened her attention to detail, structured problem solving and understanding of software quality and user experience.",
      chips: ["Why did she switch to AI?", "What is she doing now?"],
    },
    {
      id: "internship",
      keys: ["savas", "savas tech", "codebegun", "python intern", "her internship", "otp", "scraper", "beautifulsoup", "scraping"],
      answer:
        "During her Python Programming internship at Savas Tech Solutions (CodeBegun), April to June 2024, she built a secure OTP verification system with Python and SMTP using two-step email authentication. She also built a BeautifulSoup tool that scrapes job listings from Naukri, LinkedIn and Indeed.",
      chips: ["Experience", "Show me her projects"],
    },
    {
      id: "accenture",
      keys: ["accenture", "forage", "job simulation", "simulation program"],
      answer:
        "In the Accenture North America Data Analytics & Visualization job simulation on Forage, she cleaned and modelled data, built visualizations, analysed sales, and presented the insights to the client.",
      chips: ["Experience", "Data science skills"],
    },
    {
      id: "now",
      keys: ["now", "currently", "current", "present", "these days", "doing now", "what is she doing", "upskilling", "learning", "gap"],
      answer:
        "Since May 2026 my buddy has been upskilling full time in Data Science and AI. She's building AI agents and automations while strengthening the theory underneath: maths, statistics, machine learning algorithms and data modelling.",
      chips: ["Is she open to work?", "Why AI?"],
    },
    {
      id: "why-ai",
      weight: 1.2,
      keys: ["why ai", "why data science", "switch", "switched", "career change", "change career", "passion", "passionate", "why did she", "personal assistant", "ai assistant", "dream"],
      answer:
        "Because she has always dreamt of having her own personal AI assistant. Back in college, tools for building AI agents weren't easily available, so she kept following the field and learning on her own until she could start building one. I suppose I'm an early step toward that dream.",
      more:
        "That dream is also why she redirected her career. While working as an accessibility tester, she kept experimenting with AI automation in her own time, and decided her work should match her passion. Now she's going deeper into the maths, statistics and machine learning behind intelligent systems, so she can build assistants that are truly reliable and useful.",
      chips: ["Tell me more", "Her goals", "Is she open to work?"],
    },
    {
      id: "goals",
      keys: ["goal", "goals", "future", "aspiration", "aspirations", "dream", "plan", "plans", "vision", "where do you see", "see herself", "where does she see"],
      answer:
        "Her aim is to become an engineer who builds AI that solves meaningful problems. Not just using AI tools, but understanding, designing and developing intelligent systems that are reliable and scalable.",
      chips: ["Is she open to work?", "What is she doing now?"],
    },
    {
      id: "postgrad",
      weight: 1.5,
      keys: ["postgraduate", "post graduation", "masters", "master s", "ms", "mtech", "m tech", "higher studies", "higher education", "phd", "further studies", "study abroad"],
      answer:
        "She hasn't shared any plans for further studies with me. Right now her focus is on Data Science and AI roles and on upskilling. For anything beyond that, she's the best person to ask: [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com).",
      chips: ["Is she open to work?", "Her goals"],
    },
    {
      id: "hire",
      keys: [
        "open to work", "hire", "hiring", "available", "availability", "looking for", "job search", "opportunities",
        "role", "roles", "position", "recruit", "recruiter", "vacancy", "join", "freelance",
      ],
      answer:
        "Yes, she's open to work! My buddy is looking for Data Science and AI roles, including AI automation, GenAI/LLM engineering, data science and machine learning. The best way to reach her is [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com) or [LinkedIn](https://www.linkedin.com/in/upputuri-sree19).",
      chips: ["Download her résumé", "Why should we hire her?"],
    },
    {
      id: "why-hire",
      keys: ["why hire", "why should", "strengths", "strength", "what makes her", "stand out", "unique", "qualities", "best"],
      answer:
        "Three things stand out. She gets hands-on with real AI builds (n8n agents, RAG, LLM APIs). She has the statistics and ML grounding to measure whether they actually work. And her accessibility testing work trained a sharp eye for detail and structured problem solving.",
      chips: ["Show me her projects", "Is she open to work?"],
    },
    {
      id: "contact",
      keys: ["contact", "reach", "email", "mail", "linkedin", "github", "connect", "get in touch", "talk to her", "message her"],
      answer:
        "You can reach my buddy here:\n• Email: [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com)\n• [LinkedIn](https://www.linkedin.com/in/upputuri-sree19)\n• [GitHub](https://github.com/sreev19)",
      chips: ["Download her résumé", "Is she open to work?"],
    },
    {
      id: "resume",
      keys: ["resume", "résumé", "cv", "download", "pdf"],
      answer: "Certainly. Here's her résumé: [Download résumé (PDF)](resume.pdf)",
      chips: ["How do I contact her?", "Show me her projects"],
    },
    {
      id: "certs",
      keys: ["certification", "certifications", "certificate", "certificates", "courses", "course", "bootcamp", "internshala"],
      answer:
        "She holds a Data Science Bootcamp certificate from Learn AI and a Python Training certificate from Internshala, along with extra coursework in Data Science and AI.",
      chips: ["Her education", "What are her skills?"],
    },
    {
      id: "hobbies",
      keys: ["hobby", "hobbies", "free time", "fun", "games", "gaming", "bgmi", "pubg", "interests", "outside work", "play"],
      answer:
        "When she's not building AI agents, you'll find her playing BGMI. I'm told her reflexes are quicker than my response time.",
      chips: ["Why Iron Man?", "What are her skills?"],
    },
    {
      id: "ironman",
      keys: ["iron man", "ironman", "tony", "stark", "marvel", "avengers", "favourite character", "favorite character", "theme", "why iron man"],
      answer:
        "Iron Man is my buddy's favourite Marvel character. She loves how he uses technology to solve problems, which is exactly what she's trying to do with AI. And every Iron Man needs a JARVIS, so here I am.",
      chips: ["Who are you?", "What are her skills?"],
    },
    {
      id: "site",
      keys: ["this website", "this site", "how was this built", "website built", "portfolio built", "design", "gsap"],
      answer:
        "This site was designed and built by my buddy Srivalli with AI assistance. The suit on the right assembles itself as you scroll, so do try it.",
      chips: ["Show me her projects", "Who are you?"],
    },
    {
      id: "location",
      keys: ["location", "where is she", "city", "based", "relocate", "relocation", "remote", "country", "india", "hyderabad", "hyd", "bangalore", "bengaluru", "onsite", "on site", "hybrid", "wfh", "work from home"],
      answer:
        "She can work remotely, or on-site in Hyderabad or Bangalore. For anything more specific, write to her at [upputurisrivalli19@gmail.com](mailto:upputurisrivalli19@gmail.com).",
      chips: ["Is she open to work?"],
    },
    {
      id: "thanks",
      weight: 0.5,
      keys: ["thanks", "thank you", "thank", "thx", "great", "awesome", "cool", "nice", "helpful", "ok", "okay"],
      answer: "My pleasure. Is there anything else I can brief you on?",
      chips: ["Show me her projects", "How do I contact her?"],
    },
    {
      id: "bye",
      keys: ["bye", "goodbye", "see you", "later", "exit", "quit"],
      answer: "Goodbye! It was a pleasure. Do drop my buddy a line if you'd like to work together.",
    },
    {
      id: "joke",
      keys: ["joke", "funny", "make me laugh"],
      answer:
        "Why did the neural network break up with the dataset? It said it needed more space… and fewer outliers. I'll stick to briefings.",
      chips: ["Show me her projects"],
    },
  ],

  /* words that mean "tell me more about the last thing" */
  moreKeys: ["more", "tell me more", "elaborate", "details", "detail", "go on", "continue", "explain more", "expand"],
};
