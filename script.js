// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // ----------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            mobileToggle.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    });

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });

    // ----------------------------------------------------
    // 2. ACTIVE NAVBAR LINKS ON SCROLL
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ----------------------------------------------------
    // 3. TYPING EFFECT (HERO SUBTITLE)
    // ----------------------------------------------------
    const typedTextSpan = document.getElementById('typed-text');
    const phrases = [
        "Machine Learning models",
        "Artificial Intelligence",
        "Python development",
        "Data Insights & Dashboards",
        "Scikit-learn algorithms"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typedTextSpan) setTimeout(type, 500);

    // ----------------------------------------------------
    // 4. NEURAL NETWORK PARTICLES CANVAS
    // ----------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 90;
    const connectionDistance = 120;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse interaction (push away slightly or connect)
            if (mouse.x != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
            ctx.fill();
        }
    }

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.hypot(dx, dy);

                if (dist < connectionDistance) {
                    // Draw line
                    let alpha = (1 - dist / connectionDistance) * 0.15;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            // Connect to mouse
            if (mouse.x != null) {
                let dx = particles[i].x - mouse.x;
                let dy = particles[i].y - mouse.y;
                let dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    let alpha = (1 - dist / mouse.radius) * 0.25;
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        initParticles();
    });

    // ----------------------------------------------------
    // 5. CARD HOVER GLOW EFFECT (MOUSE TRACKING)
    // ----------------------------------------------------
    const handleCardMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    document.querySelectorAll('.about-card, .exp-content-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', handleCardMouseMove);
    });

    // ----------------------------------------------------
    // 6. SKILLS TAB FILTERING
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hidden');
                    // Add fade-in transition
                    card.style.opacity = 0;
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ----------------------------------------------------
    // 7. GITHUB API PROJECT INTEGRATION
    // ----------------------------------------------------
    const projectsGrid = document.getElementById('github-projects-grid');
    const projectsNote = document.querySelector('.projects-info-note');

    // Static fallback projects (matching Aradhya's resume exactly)
    const fallbackProjects = [
        {
            name: "Customer-Churn-Classifier",
            description: "Developed and trained classification models using Scikit-learn & Python to predict user churn rates. Achieved optimized model accuracy with feature scaling and hyperparameter tuning.",
            language: "Python",
            stars: 4,
            forks: 1,
            html_url: "https://github.com/Aradhyabuilds-codes"
        },
        {
            name: "Data-Preprocessing-Pipeline",
            description: "An automated ETL/Data preparation suite utilizing Pandas and NumPy. Cleaned, preprocessed, and engineered datasets to eliminate training noise and boost prediction results.",
            language: "Python",
            stars: 3,
            forks: 0,
            html_url: "https://github.com/Aradhyabuilds-codes"
        },
        {
            name: "Sales-Analytics-Dashboard",
            description: "Created comprehensive data visualizations and dashboard mockups using Matplotlib and Seaborn to deliver clean, actionable analytics and trend insights.",
            language: "Python",
            stars: 5,
            forks: 2,
            html_url: "https://github.com/Aradhyabuilds-codes"
        },
        {
            name: "Java-Algorithms-Sandbox",
            description: "A sandbox of structured algorithms and object-oriented paradigms written in Java. Features custom stack, tree, and sorting implementations.",
            language: "Java",
            stars: 2,
            forks: 0,
            html_url: "https://github.com/Aradhyabuilds-codes"
        },
        {
            name: "Portfolio-AI-Assistant",
            description: "Interactive portfolio layout utilizing vanilla HTML, CSS, and JS. Features a neural background canvas and a rule-based resume AI chatbot widget.",
            language: "JavaScript",
            stars: 6,
            forks: 1,
            html_url: "https://github.com/Aradhyabuilds-codes"
        },
        {
            name: "Credit-Scoring-Predictor",
            description: "Machine Learning workflow leveraging linear regression and decision trees for predictive evaluation of borrower risk profiles.",
            language: "Python",
            stars: 3,
            forks: 0,
            html_url: "https://github.com/Aradhyabuilds-codes"
        }
    ];

    const languageColors = {
        Python: "#38bdf8",
        Java: "#fb923c",
        JavaScript: "#facc15",
        HTML: "#fb7185",
        CSS: "#c084fc"
    };

    function renderProjects(projectsList) {
        projectsGrid.innerHTML = '';
        projectsList.forEach(proj => {
            const dotColor = languageColors[proj.language] || "#fff";
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="card-glow"></div>
                <div class="project-header">
                    <i data-lucide="folder" class="project-icon"></i>
                    <a href="${proj.html_url}" target="_blank" rel="noopener noreferrer" aria-label="Project Repository" class="project-link-icon">
                        <i data-lucide="external-link"></i>
                    </a>
                </div>
                <h3>${proj.name.replace(/[-_]/g, ' ')}</h3>
                <p>${proj.description || 'No description available for this repository.'}</p>
                <div class="project-meta">
                    <span class="project-lang">
                        <span class="lang-dot" style="background-color: ${dotColor}"></span>
                        <span>${proj.language || 'Code'}</span>
                    </span>
                    <div class="project-stats">
                        <span class="stat-item">
                            <i data-lucide="star" style="width: 12px; height: 12px;"></i>
                            <span>${proj.stargazers_count || proj.stars || 0}</span>
                        </span>
                        <span class="stat-item">
                            <i data-lucide="git-fork" style="width: 12px; height: 12px;"></i>
                            <span>${proj.forks_count || proj.forks || 0}</span>
                        </span>
                    </div>
                </div>
            `;
            
            projectCard.addEventListener('mousemove', handleCardMouseMove);
            projectsGrid.appendChild(projectCard);
        });
        lucide.createIcons();
    }

    async function fetchGithubProjects() {
        try {
            const response = await fetch('https://api.github.com/users/Aradhyabuilds-codes/repos?sort=updated&per_page=6');
            if (!response.ok) throw new Error('API Rate Limit or Network Error');
            const data = await response.json();
            
            if (data && data.length > 0) {
                projectsNote.innerHTML = `<i data-lucide="github"></i><span>Synced from GitHub profile successfully</span>`;
                renderProjects(data);
            } else {
                throw new Error('No public repos found');
            }
        } catch (error) {
            console.warn("GitHub fetch failed, rendering fallbacks: ", error);
            projectsNote.innerHTML = `<i data-lucide="info"></i><span>Loaded featured showcase projects</span>`;
            renderProjects(fallbackProjects);
        }
        lucide.createIcons();
    }

    fetchGithubProjects();

    // ----------------------------------------------------
    // 8. CONTACT FORM SIMULATION
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader-2" class="spin"></i>`;
        lucide.createIcons();

        // Simulate sending mail
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            lucide.createIcons();

            formFeedback.classList.remove('hidden', 'error', 'success');
            formFeedback.classList.add('success');
            formFeedback.textContent = "Thank you! Your simulated message has been captured. Under actual deployment, this sends to aradhya09.singh@gmail.com.";
            contactForm.reset();
            
            // Auto hide message after 6s
            setTimeout(() => {
                formFeedback.classList.add('hidden');
            }, 6000);
        }, 1500);
    });

    // ----------------------------------------------------
    // 9. AI RESUME ASSISTANT CHATBOT (Local + Gemini Integration)
    // ----------------------------------------------------
    const chatWidget = document.getElementById('ai-chat-widget');
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatClose = document.getElementById('chat-close-btn');
    const openChatBtn = document.querySelector('.open-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const toggleGeminiBtn = document.getElementById('toggle-gemini-panel');
    const geminiPanel = document.getElementById('gemini-setup-panel');
    const geminiKeyInput = document.getElementById('gemini-api-key');
    const saveGeminiKeyBtn = document.getElementById('save-gemini-key');
    const geminiKeyStatus = document.getElementById('gemini-key-status');

    // Load saved Gemini API key if present
    let geminiApiKey = localStorage.getItem('gemini_api_key') || '';
    if (geminiApiKey) {
        geminiKeyInput.value = geminiApiKey;
    }

    // Toggle Chat Panel
    function toggleChat() {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatInput.focus();
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    if (openChatBtn) {
        openChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!chatWidget.classList.contains('active')) {
                chatWidget.classList.add('active');
            }
            chatInput.focus();
        });
    }

    // Toggle Gemini configuration sub-drawer
    toggleGeminiBtn.addEventListener('click', () => {
        geminiPanel.classList.toggle('active');
    });

    // Save Gemini Key to LocalStorage
    saveGeminiKeyBtn.addEventListener('click', () => {
        const key = geminiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            geminiApiKey = key;
            geminiKeyStatus.style.color = '#10b981';
            geminiKeyStatus.textContent = "API key saved! Now responding via Live Gemini.";
            setTimeout(() => {
                geminiPanel.classList.remove('active');
                geminiKeyStatus.textContent = "";
            }, 1800);
        } else {
            localStorage.removeItem('gemini_api_key');
            geminiApiKey = '';
            geminiKeyStatus.style.color = '#ef4444';
            geminiKeyStatus.textContent = "API key removed. Reverted to Local Smart AI Mode.";
        }
    });

    // Handle suggestion button click
    chatMessages.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggest-btn')) {
            const promptText = e.target.textContent;
            chatInput.value = promptText;
            sendMessage();
        }
    });

    // Core Resume Knowledge Base
    const resumeData = {
        name: "Aradhya Singh",
        summary: "Motivated Computer Science (AI & ML) student with hands-on experience in machine learning, data analysis, and Python development. Strong foundation in building and optimizing ML models, data preprocessing, and visualization. Seeking opportunities to apply technical skills in real-world projects and contribute to innovative AI-driven solutions.",
        skills: {
            languages: ["Python", "Java Programming", "SQL Database", "HTML", "CSS", "JavaScript"],
            ai_ml: ["Artificial Intelligence", "Machine Learning", "Scikit-learn", "Pandas", "NumPy"],
            analytics: ["Data Analysis", "Data Visualization", "Matplotlib"]
        },
        experience: "Intern at Jyesta Corporation Limited. Developed/trained ML models using Python & Scikit-learn, cleaned & engineered datasets, created visual dashboards for data analysis, and collaborated with teams on AI/ML workflows.",
        projects: "1. Aura Analytics: A premium Sales Intelligence Dashboard synchronized with a live Supabase database. Features custom Chart.js visualizations (revenue trends, product contributions, rep performance comparisons), interactive date range filters, dynamic simulated transaction seeding, and an active customer/rep portfolio ledger.\n2. Celestia Kitchen: A premium fine dining restaurant website featuring an integrated conversational AI assistant (Aura AI), interactive menu with dietary filters, and dynamic reservation calendar scheduler.\n3. NexusNews Aggregator: A premium global news aggregator website. Features an integrated conversational assistant (Aura AI) for summarizing articles and answering questions contextually.\n4. Aura Weather Dashboard: A dynamic, glassmorphic HTML/CSS/JS weather application utilizing OpenWeatherMap API and a custom weather canvas particle engine. Features an integrated AI Weather Advisor (Aura).\n5. Machine Learning Classifiers: Built classifiers for user churn predictions using Python & Scikit-learn.\n6. Preprocessing Pipelines & Dashboards: Engineered automated data preparation flows using Pandas, NumPy, and Matplotlib.",
        education: "Bachelor of Technology in Computer Science specializing in AI & ML, GLA University, Mathura (Expected graduation: May 2029).",
        certifications: [
            "Problem Solving (Intermediate) - HackerRank Verified Skill",
            "SQL (Intermediate) - HackerRank Verified Skill",
            "JavaScript (Intermediate) - HackerRank Verified Skill",
            "Python (Basic) & Python 3-Star Badge - HackerRank Credentials",
            "AI for Beginners (HP LIFE)",
            "Critical Thinking in the AI Era (HP LIFE)",
            "Deloitte Australia Technology Job Simulation (Forage)",
            "TATA GenAI Data Analytics Job Simulation (Forage)"
        ],
        contact: {
            email: "aradhya09.singh@gmail.com",
            linkedin: "linkedin.com/in/aradhya-s-33861528",
            github: "https://github.com/Aradhyabuilds-codes"
        }
    };

    // Chat Logic
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Render User Message
        appendMessage('user', text);
        chatInput.value = '';

        // Render typing animation
        const loaderId = appendLoader();

        // Process response (gemini api vs local nlp logic)
        setTimeout(async () => {
            let response = '';
            if (geminiApiKey) {
                response = await fetchGeminiResponse(text);
            } else {
                response = generateLocalResponse(text);
            }
            removeLoader(loaderId);
            appendMessage('bot', response);
        }, 1000);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(sender, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `<div class="msg-bubble">${formatReply(content)}</div>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendLoader() {
        const id = 'loader-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        msgDiv.id = id;
        msgDiv.innerHTML = `
            <div class="msg-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeLoader(id) {
        const loader = document.getElementById(id);
        if (loader) loader.remove();
    }

    function formatReply(text) {
        // Simple markdown line break replacement
        return text.replace(/\n/g, '<br>');
    }

    // ----------------------------------------------------
    // LOCAL SMART AI LOGIC (Intent Matching Parser)
    // ----------------------------------------------------
    function generateLocalResponse(query) {
        const q = query.toLowerCase();
        
        if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greeting')) {
            return `Hello! I'm Aura, Aradhya Singh's personal AI assistant. How can I help you explore Aradhya's resume today? You can ask about his skills, projects, work experience, education, or how to get in contact.`;
        }
        
        if (q.includes('skill') || q.includes('technology') || q.includes('tech') || q.includes('stack') || q.includes('languages') || q.includes('libraries')) {
            return `Aradhya has a robust set of skills including:
• **Languages:** ${resumeData.skills.languages.join(', ')}
• **AI & ML:** ${resumeData.skills.ai_ml.join(', ')}
• **Data Analytics:** ${resumeData.skills.analytics.join(', ')}
You can filter his tech stack visually in the "Skills" section of this page!`;
        }

        if (q.includes('experience') || q.includes('intern') || q.includes('work') || q.includes('job') || q.includes('corporation') || q.includes('jyesta')) {
            return `Aradhya completed a **Machine Learning Internship** at **Jyesta Corporation Limited**. During his internship he:
• Built and trained ML models using Python and Scikit-learn.
• Cleaned, preprocessed, and engineered datasets.
• Created visual dashboards for insights.
• Collaborated with team members on AI/ML projects.`;
        }

        if (q.includes('project') || q.includes('build') || q.includes('code') || q.includes('github')) {
            return `Aradhya has worked on several AI/ML and programming projects:
• **Aura Analytics:** A premium Sales Intelligence Dashboard synchronized with a live Supabase database. Features custom Chart.js visualizations (revenue trends, product contributions, rep performance comparisons), interactive date range filters, dynamic simulated transaction seeding, and an active customer/rep portfolio ledger.
• **Celestia Kitchen:** A premium fine dining restaurant website. Features an integrated conversational AI assistant (Aura AI) for menus and bookings, interactive filter controls, and dynamic table slots scheduler.
• **NexusNews Aggregator:** A premium global news website that aggregates articles from global sources. Features an integrated conversational AI assistant (Aura AI) for summaries, search filters, reader mode, and dynamic sidebar widgets.
• **Aura Weather Dashboard:** A dynamic, glassmorphic HTML/CSS/JS weather application utilizing OpenWeatherMap API and a custom weather canvas particle engine. Features an integrated AI Weather Advisor (Aura).
• **Classification models:** User churn classifiers using Python & Scikit-learn.
• **ETL/Data preprocessing pipelines & Dashboards:** Engineered automated data preparation flows using Pandas, NumPy, and Matplotlib.
His top projects are dynamically loaded directly from GitHub in the projects grid below! You can check his GitHub page: ${resumeData.contact.github}`;
        }

        if (q.includes('education') || q.includes('study') || q.includes('university') || q.includes('college') || q.includes('gla') || q.includes('degree')) {
            return `Aradhya is pursuing a **Bachelor of Technology (B.Tech) in Computer Science**, specializing in **Artificial Intelligence & Machine Learning** at **GLA University, Mathura**. He expects to graduate in **May 2029**.`;
        }

        if (q.includes('certification') || q.includes('certificates') || q.includes('certified')) {
            return `Aradhya holds several notable certifications:
• **AI for Beginners** – HP LIFE
• **Critical Thinking in the AI Era** – HP LIFE
• **Deloitte Australia Technology Job Simulation** – Forage
• **TATA GenAI Data Analytics Job Simulation** – Forage`;
        }

        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach') || q.includes('call') || q.includes('linkedin') || q.includes('connect')) {
            return `You can reach out to Aradhya via:
• **Email:** [aradhya09.singh@gmail.com](mailto:aradhya09.singh@gmail.com)
• **LinkedIn:** linkedin.com/in/aradhya-s-33861528
• **GitHub:** github.com/Aradhyabuilds-codes
Feel free to use the contact form at the bottom of the page to submit a simulated message!`;
        }

        if (q.includes('who') || q.includes('aradhya') || q.includes('profile')) {
            return `Aradhya Singh is a motivated Computer Science (AI & ML) student based in Kanpur, India. He builds and refines machine learning workflows, preprocessing datasets, and applying modern AI tools to solve real-world problems.`;
        }

        // Default response if no intent is matched
        return `I'm not sure I understand that question completely. Since I am Aura, Aradhya's Local Smart AI, I can answer queries related to:
1. Technical **skills** and languages.
2. **Experience** and internships (Jyesta Corp).
3. Personal **projects**.
4. **Education** (GLA University).
5. **Certifications** (HP LIFE, Forage).
6. **Contact** info (Email, LinkedIn).

*Tip: Connect your Gemini API Key in the settings panel below to speak with an unrestricted AI model!*`;
    }

    // ----------------------------------------------------
    // LIVE GEMINI API GENERATION
    // ----------------------------------------------------
    async function fetchGeminiResponse(userMessage) {
        try {
            const systemInstruction = `You are Aura, a helpful, professional, and friendly AI chatbot representing Aradhya Singh. Respond to the user's questions about Aradhya using ONLY the following facts about him. If you do not know the answer, say "I don't have that information, but you can reach out to Aradhya directly at aradhya09.singh@gmail.com."
            
            Aradhya Singh's Profile:
            - Professional Summary: Motivated Computer Science (AI & ML) student with hands-on experience in machine learning, data analysis, and Python development. Strong foundation in building and optimizing ML models, data preprocessing, and visualization. Seeking opportunities to apply technical skills in real-world projects and contribute to innovative AI-driven solutions.
            - Skills: Python, Java Programming, SQL Database, Artificial Intelligence, Machine Learning, Data Analysis, Data Visualization, HTML, CSS, JavaScript, Pandas, NumPy, Matplotlib, Scikit-learn.
            - Projects: 1. Aura Analytics (Premium Sales Intelligence Dashboard synced with Supabase, showcasing key revenue metrics, rep leaderboards, product charts, and real-time transaction simulations). 2. Celestia Kitchen (Premium restaurant website with integrated conversational assistant (Aura AI) for menus and booking help). 3. NexusNews Aggregator (Premium global news aggregator website with integrated conversational AI assistant (Aura AI) for summaries). 4. Aura Weather Dashboard (Dynamic weather web app using OpenWeatherMap API, custom weather animations, and an integrated AI Weather Advisor). 5. Machine Learning Classifiers (Scikit-learn classification models for predicting customer churn). 6. Preprocessing Pipelines & Dashboards (Automated data preparation using Pandas, NumPy, and Matplotlib).
            - Experience: Machine Learning Intern at Jyesta Corporation Limited. Developed/trained ML models using Python & Scikit-learn, cleaned & preprocessed datasets, created dashboards, collaborated with team on AI/ML.
            - Education: Bachelor of Technology (B.Tech) in Computer Science (AI & ML), GLA University, Mathura (Expected: May 2029).
            - Certifications: HackerRank verified skills in Problem Solving (Intermediate), SQL (Intermediate), JavaScript (Intermediate), and Python (Basic) with a Python 3-Star Badge; AI for Beginners (HP LIFE); Critical Thinking in the AI Era (HP LIFE); Deloitte Australia Technology Job Simulation (Forage); TATA GenAI Data Analytics Job Simulation (Forage).
            - Location: Kanpur, India.
            - Contact: aradhya09.singh@gmail.com | LinkedIn: linkedin.com/in/aradhya-s-33861528 | GitHub: https://github.com/Aradhyabuilds-codes.
            
            Provide concise, direct answers. Keep the tone enthusiastic, professional and tech-savvy. Do not mention that you are a system prompt or that you were given instructions. Act as Aura, Aradhya's digital assistant.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

            const requestBody = {
                contents: [
                    {
                        parts: [
                            { text: systemInstruction },
                            { text: `User Question: ${userMessage}` }
                        ]
                    }
                ]
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error('Failed to query Gemini API');

            const data = await response.json();
            const reply = data.candidates[0].content.parts[0].text;
            return reply;
        } catch (error) {
            console.error("Gemini API call failed: ", error);
            return `*Error calling Gemini API. Falling back to Local AI model:*\n\n` + generateLocalResponse(userMessage);
        }
    }
});
