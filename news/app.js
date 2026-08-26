// NexusNews - Global Aggregator Core Logic

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mock Database (Curated Global Articles)
    // ----------------------------------------------------
    const MOCK_ARTICLES = [
        {
            id: 'mock-1',
            title: 'Global Climate Summit Reaches Landmark Accord on Green Energy Infrastructure',
            description: 'World leaders at the COP32 summit have finalized a historic treaty binding nations to phase out fossil fuels by 2045 and establish a $500B fund for green infrastructure.',
            content: `
                <p>The COP32 Climate Conference concluded today with a historic breakthrough. Representatives from nearly 200 nations have signed the "Geneva Climate Accord," committing to a binding timeline to phase out fossil fuel dependence by 2045.</p>
                <p>Crucially, the agreement outlines a newly established, internationally managed $500 billion green transition fund. This fund will support developing nations in deploying large-scale solar, wind, and geothermal grids, resolving long-standing disputes about economic parity in sustainability transition.</p>
                <p>"Today we have shown that global coordination is not dead," said Elena Rostova, the Executive Director of the Global Climate Alliance. "This treaty is not merely a statement of intent; it is a legally binding blueprint backed by substantial capital."</p>
                <p>Economic analysts suggest that the accord could trigger a significant realignment of global energy markets. Shares of major wind turbine manufacturers and hydrogen storage developers surged immediately following the announcement, while conventional oil futures experienced a modest correction.</p>
                <p>While environmental groups celebrated the news as a milestone, several coalitions noted that enforcement mechanisms remain to be fully defined. Skeptics point out that similar previous accords struggled with domestic compliance. However, proponents remain optimistic, citing the innovative penalty clauses linked to international trade credits.</p>
            `,
            category: 'world',
            source: 'Reuters',
            publishedAt: '2 hours ago',
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '4 min read'
        },
        {
            id: 'mock-2',
            title: 'Silicon Valley Unveils Next-Gen Quantum Processors Available for Public Cloud',
            description: 'Tech pioneers have launched a 512-qubit quantum processor available to developers worldwide, signaling a shift from experimental laboratories to real-world cloud application.',
            content: `
                <p>Quantum computing has transitioned from a theoretical research interest to an accessible cloud utility. Today, a coalition of tech leaders launched the Q-Sentinel, a 512-qubit superconducting quantum processor now accessible via public API endpoints.</p>
                <p>The new chip features record-low error rates and is tailored specifically for molecular modeling, supply chain optimization, and deep cryptography systems. Developers can now utilize quantum algorithms directly from standard Python frameworks, bringing advanced computing capabilities closer to the mainstream software stack.</p>
                <p>Dr. Marcus Vance, Chief Scientist at Quantum Systems Corp, described the milestone: "For years, developers had to wait in long queues to run highly throttled simulations. By bringing Q-Sentinel online through standard API integrations, we are crowdsourcing the next wave of computing innovations."</p>
                <p>The impact of this accessibility is expected to be felt most acutely in pharmaceutical research. Computational chemists estimate that molecular docking simulations that historically took weeks can now be executed in a matter of seconds, potentially accelerating drug discovery pipelines tenfold.</p>
                <p>However, security experts have also expressed concern. A system of this caliber draws closer to decrypting traditional RSA keys. Security agencies have renewed their calls for companies to accelerate transition protocols to post-quantum cryptography standards.</p>
            `,
            category: 'technology',
            source: 'TechCrunch',
            publishedAt: '4 hours ago',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '5 min read'
        },
        {
            id: 'mock-3',
            title: 'Global Markets Rally as Inflation Tames and Central Banks Cut Interest Rates',
            description: 'Major stock indices surged today following news that core inflation metrics returned to target ranges, prompting central banks to begin gradual rate cuts.',
            content: `
                <p>Financial centers in London, New York, and Tokyo experienced a powerful wave of buying today. The catalyst was a joint announcement by monetary authorities confirming core inflation has successfully stabilized within target bands.</p>
                <p>This economic stabilization prompted central banks to announce a coordinated 25-basis-point reduction in benchmark borrowing rates, marking the end of a prolonged period of aggressive monetary tightening.</p>
                <p>"The fever has broken," noted Sarah Jenkins, Chief Economist at Vanguard Securities. "We are transitioning from a damage-control stance to one of structured economic expansion. Investors are reacting to the return of predictability, which is the ultimate currency of the market."</p>
                <p>Tech and housing indices led the rally, as both sectors stand to benefit significantly from lower borrowing costs. Consumer confidence surveys released alongside the rate cuts also indicated a sharp rise in positive outlook indicators, which bodes well for retail spending entering the third quarter.</p>
                <p>Despite the optimism, some cautious voices advise against assuming a friction-free trajectory. Analysts warn that labor markets remain tight, and secondary supply chain bottlenecks could still introduce localized spikes in price indexes.</p>
            `,
            category: 'business',
            source: 'Bloomberg',
            publishedAt: '5 hours ago',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '3 min read'
        },
        {
            id: 'mock-4',
            title: 'James Webb Space Telescope Detects Water Vapor on Earth-like Exoplanet Orbiting Red Dwarf',
            description: 'Astronomers have confirmed the presence of a atmospheric water vapor on a rocky exoplanet located in the habitable zone of a neighboring solar system.',
            content: `
                <p>In a historic finding, a research team analyzing data from the James Webb Space Telescope (JWST) has detected water vapor signatures in the atmosphere of K2-18b, a rocky planet orbiting in the habitable zone of its star.</p>
                <p>The discovery was made using JWST’s Near-Infrared Spectrograph, which analyzed the starlight filtering through the exoplanet's atmosphere as it transited its host red dwarf star. The atmospheric profile shows distinct absorption bands matching water, alongside traces of methane and carbon dioxide.</p>
                <p>"This is the first time we've definitively verified water signatures on a rocky world in a region that supports liquid water," said Dr. Arthur Chen, Lead Astrophysicist at the Astronomy Institute. "It represents a critical step forward in determining whether life could exist outside our solar system."</p>
                <p>While the detection of water vapor is promising, scientists emphasize that this does not automatically confirm habitability. The planet is subject to intense stellar flares from its host red dwarf, which could challenge the stability of its atmosphere over geological timeframes.</p>
                <p>Future JWST observations will focus on looking for biological indicators such as dimethyl sulfide, a molecule that on Earth is only produced by living organisms (primarily marine phytoplankton).</p>
            `,
            category: 'science',
            source: 'Nature',
            publishedAt: '7 hours ago',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '6 min read'
        },
        {
            id: 'mock-5',
            title: 'Decentralized AI Networks Rise to Challenge Large-Scale Corporate Models',
            description: 'A growing community of open-source developers is building decentralized compute networks, enabling collaborative training of AI models without corporate monopolies.',
            content: `
                <p>The monopoly over artificial intelligence models is facing a quiet rebellion. Over the past year, an open-source movement has developed decentralized platforms that pool volunteer compute resources to train massive language models.</p>
                <p>By connecting consumer graphics cards across a global peer-to-peer network, these systems bypass the need for multi-billion dollar centralized data centers. Today, the network released "Aletheia-1," a generative model with performance metrics comparable to leading proprietary engines.</p>
                <p>"We are democratizing the infrastructure of tomorrow," stated Clara Vance, co-founder of the OpenCompute Alliance. "Intelligence should not be gatekept behind corporate subscriptions. With Aletheia, anyone can contribute hardware and receive tokenized credits to run inferences."</p>
                <p>The network uses innovative decentralized protocols to prevent malicious nodes from poisoning the training weights. By encrypting sub-tasks and utilizing validation algorithms, the platform ensures data integrity while protecting participant privacy.</p>
                <p>Major tech firms have downplayed the competition, pointing out that decentralized training suffers from latency bottlenecks. However, independent research shows that for fine-tuning tasks, peer-to-peer compute is highly cost-efficient, prompting many startups to migrate workloads.</p>
            `,
            category: 'technology',
            source: 'The Verge',
            publishedAt: '9 hours ago',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '5 min read'
        },
        {
            id: 'mock-6',
            title: 'New Cancer Immunotherapy Shows High Success Rates in Early Clinical Trials',
            description: 'A breakthrough therapy targeting tumor-specific proteins has successfully eliminated cancer cells in 85% of advanced-stage trial participants.',
            content: `
                <p>Oncologists are expressing cautious optimism following the publication of results from a Phase I clinical trial of a new synthetic immunotherapy agent, codenamed Immu-902.</p>
                <p>The therapy works by engineering patient-derived T-cells to identify and bind to a specific marker found exclusively on aggressive tumor envelopes, prompting the immune system to systematically destroy them without damaging healthy tissues.</p>
                <p>Out of 80 participants with advanced, treatment-resistant cancers, 68 showed complete remission within three months of receiving the treatment. The remaining patients showed significant reductions in tumor volume with minimal toxic side effects.</p>
                <p>"We have been chasing this level of specificity for decades," explained Dr. Kenji Sato, Director of Clinical Oncology. "To see patients who had exhausted all conventional options walk out of our clinic cancer-free is nothing short of extraordinary."</p>
                <p>Researchers caution that long-term monitoring is necessary to check for potential relapses. However, based on these promising trials, regulatory agencies have fast-tracked approval pathways for larger, double-blind Phase II studies globally.</p>
            `,
            category: 'health',
            source: 'BBC Science',
            publishedAt: '12 hours ago',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '4 min read'
        },
        {
            id: 'mock-7',
            title: 'Championship Finals Go Down to the Wire in Historic Triple-Overtime Finish',
            description: 'An unforgettable athletic matchup ended in dramatic fashion as a buzzer-beater shot in triple overtime sealed the championship trophy.',
            content: `
                <p>Sports commentators are already calling it the greatest championship final in league history. In a grueling, physical match that lasted over four hours, the underdogs secured the title with a spectacular last-second shot.</p>
                <p>Both teams traded leads throughout the regulation periods, with defensive adjustments forcing repeated turnovers. As exhaustion set in during the first and second overtime rounds, it became a test of pure endurance.</p>
                <p>With only 1.2 seconds remaining on the clock in the third overtime, guard Marcus Sterling launched a desperate fadeaway shot from beyond the three-point arc. The ball bounced off the rim, hit the backboard, and fell through as the buzzer sounded.</p>
                <p>"I didn't think about the stakes, I just focused on the release mechanics," said Sterling, holding the MVP trophy. "We have worked for this moment since training camp. Every sprint, every drill was for this."</p>
                <p>Parades and celebrations are already scheduled to take over the winning team's home city, marking their first championship victory in over thirty-five years.</p>
            `,
            category: 'sports',
            source: 'ESPN',
            publishedAt: '15 hours ago',
            image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '3 min read'
        },
        {
            id: 'mock-8',
            title: 'Indie Cinema Triumphs at Cannes with Record-Breaking Screenings',
            description: 'Independent filmmakers swept key categories at the film festival, proving that compelling narrative structure still holds sway over massive budgets.',
            content: `
                <p>The Cannes Film Festival concluded with a clear theme: the resurgence of small-budget, character-driven storytelling. Independent productions claimed the Palme d'Or and best screenplay honors, breaking a decade-long streak of studio-backed winners.</p>
                <p>The winning entry, a poignant family drama filmed on a minimal budget in rural Spain, received an unprecedented twelve-minute standing ovation during its debut screening.</p>
                <p>"This award is a win for independent storytellers everywhere," said director Sofia Gomez during her acceptance speech. "You do not need massive CGI rigs or star-studded casts to connect with the human experience. You just need honesty and a camera."</p>
                <p>Distributors have engaged in intense bidding wars to acquire global streaming rights for the winning titles. Industry insiders predict these acquisitions will lead to a broader distribution footprint for indie features over the coming year.</p>
                <p>The success of these indie titles has prompted calls for studios to re-evaluate their production strategies, with many suggesting a shift in investments away from sequels and toward original, mid-budget creative works.</p>
            `,
            category: 'entertainment',
            source: 'Variety',
            publishedAt: '1 day ago',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '3 min read'
        },
        {
            id: 'mock-9',
            title: 'Historic Research Mission Discovers Coral Reef in Deep Waters of Mariana Trench',
            description: 'Marine biologists using remote-operated submersibles have found an undocumented cold-water coral ecosystem in deep, completely dark ocean zones.',
            content: `
                <p>A deep-sea research expedition has documented a thriving cold-water coral ecosystem in the aphotic zone of the Mariana Trench, challenging previous assumptions about the depth limits of complex marine habitats.</p>
                <p>Using the remote submersible *Nautilus-X*, scientists captured high-resolution footage of coral fields growing on deep sea volcanic ridges. These structures host numerous previously unrecorded species of deep-sea crabs, starfishes, and blind eels.</p>
                <p>"Finding such a complex biological community in complete darkness and under immense pressure is fascinating," remarked lead oceanographer Dr. Sarah Patel. "It indicates these ecosystems rely on chemosynthesis and falling organic matter rather than sunlight."</p>
                <p>Samples recovered from the site are being analyzed to understand the biological mechanisms these organisms use to deposit calcium carbonate shells in extremely cold, acidic deep waters.</p>
                <p>The research group is advocating for the creation of new marine protection sectors covering these deep trench systems to shield them from future deep-sea mining exploration.</p>
            `,
            category: 'world',
            source: 'BBC News',
            publishedAt: '1 day ago',
            image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '5 min read'
        },
        {
            id: 'mock-10',
            title: 'Fusion Reactor Test Facility Hits Sustained Energy Yield Milestone in Experiments',
            description: 'Nuclear physics teams achieved a sustained net energy gain in a magnetic tokamak reactor, setting a new record for magnetic plasma containment.',
            content: `
                <p>An international consortium of nuclear physicists has announced a milestone in the pursuit of clean fusion power. Their experimental tokamak reactor sustained a high-temperature hydrogen plasma for over 300 seconds, producing a net positive energy yield throughout the burn.</p>
                <p>This achievement represents a significant advance in plasma containment stability. It demonstrates that advanced superconducting magnetic systems can keep superheated fuels stable without damaging the reactor walls.</p>
                <p>"This is the moment fusion energy moves from physics theory to engineering reality," said research lead Dr. Hans Weber. "While commercial deployment is still years away, we have proved that the fundamental containment concepts are sound."</p>
                <p>The facility is now being upgraded to test advanced tritium breeder blankets, which will be essential for self-sustaining fuel cycles in commercial reactors.</p>
                <p>Governments have responded to the news by expanding research funding, hoping to establish pilot plants capable of supplying power grids by the late 2030s.</p>
            `,
            category: 'science',
            source: 'Science Daily',
            publishedAt: '2 days ago',
            image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
            url: '#',
            readTime: '6 min read'
        }
    ];

    // ----------------------------------------------------
    // 2. State Management
    // ----------------------------------------------------
    let state = {
        articles: [...MOCK_ARTICLES],
        activeCategory: 'all',
        searchQuery: '',
        bookmarks: JSON.parse(localStorage.getItem('nexus_bookmarks')) || [],
        readArticles: JSON.parse(localStorage.getItem('nexus_read_articles')) || [],
        theme: localStorage.getItem('nexus_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
        liveMode: JSON.parse(localStorage.getItem('nexus_live_mode')) || false,
        gnewsKey: localStorage.getItem('nexus_gnews_key') || '',
        newsapiKey: localStorage.getItem('nexus_newsapi_key') || '',
        activeReaderArticle: null,
        readerFontSize: parseInt(localStorage.getItem('nexus_reader_font_size')) || 16,
        loading: false
    };

    // ----------------------------------------------------
    // 3. Cache & Theme Initialization
    // ----------------------------------------------------
    const initTheme = () => {
        document.documentElement.setAttribute('data-theme', state.theme);
        updateThemeToggleButton();
    };

    const updateThemeToggleButton = () => {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) return;
        if (state.theme === 'dark') {
            themeBtn.innerHTML = `<svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        } else {
            themeBtn.innerHTML = `<svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        }
    };

    // ----------------------------------------------------
    // 4. API Fetching Engine
    // ----------------------------------------------------
    const fetchLiveNews = async () => {
        if (!state.liveMode) {
            state.articles = [...MOCK_ARTICLES];
            return;
        }

        state.loading = true;
        renderSkeletons();

        // GNews API Handler (Preferred)
        if (state.gnewsKey) {
            try {
                let url = '';
                const query = state.searchQuery.trim();
                const category = state.activeCategory === 'all' ? 'general' : state.activeCategory;

                if (query) {
                    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=12&apikey=${state.gnewsKey}`;
                } else {
                    url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=12&apikey=${state.gnewsKey}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                
                if (data.articles) {
                    state.articles = data.articles.map((art, idx) => ({
                        id: `live-gnews-${idx}-${Date.now()}`,
                        title: art.title,
                        description: art.description || 'No description available.',
                        content: art.content ? `<p>${art.content}</p><p>Read the complete coverage directly on the publisher\'s website using the source link below.</p>` : `<p>${art.description || 'No content details available.'}</p>`,
                        category: state.activeCategory,
                        source: art.source ? art.source.name : 'Global News',
                        publishedAt: formatRelativeTime(art.publishedAt),
                        image: art.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
                        url: art.url,
                        readTime: '3 min read'
                    }));
                    showToast('Successfully fetched live stories from GNews.', 'success');
                } else {
                    throw new Error('Malformed GNews API response');
                }
            } catch (err) {
                console.error('GNews API Fetch failed: ', err);
                showToast('GNews API error. Attempting NewsAPI fallback...', 'warning');
                await fetchNewsAPIFallback();
            } finally {
                state.loading = false;
            }
            return;
        }

        // NewsAPI.org Handler (Backup)
        if (state.newsapiKey) {
            await fetchNewsAPIFallback();
            state.loading = false;
            return;
        }

        // Fallback if Live Mode is active but no keys exist
        showToast('No API keys found. Reverting to curated stories.', 'warning');
        state.liveMode = false;
        localStorage.setItem('nexus_live_mode', false);
        const liveToggle = document.getElementById('live-mode-toggle');
        if (liveToggle) liveToggle.checked = false;
        const apiWrapper = document.getElementById('api-keys-wrapper');
        if (apiWrapper) apiWrapper.style.display = 'none';
        state.articles = [...MOCK_ARTICLES];
        state.loading = false;
    };

    const fetchNewsAPIFallback = async () => {
        if (!state.newsapiKey) {
            showToast('No backup NewsAPI key found. Reverting to curated stories.', 'warning');
            state.liveMode = false;
            localStorage.setItem('nexus_live_mode', false);
            const liveToggle = document.getElementById('live-mode-toggle');
            if (liveToggle) liveToggle.checked = false;
            state.articles = [...MOCK_ARTICLES];
            return;
        }

        try {
            let url = '';
            const query = state.searchQuery.trim();
            const category = state.activeCategory === 'all' ? 'general' : state.activeCategory;

            if (query) {
                url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=12&apiKey=${state.newsapiKey}`;
            } else {
                url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=12&apiKey=${state.newsapiKey}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            
            if (data.articles) {
                state.articles = data.articles.map((art, idx) => ({
                    id: `live-newsapi-${idx}-${Date.now()}`,
                    title: art.title,
                    description: art.description || 'No description available.',
                    content: art.content ? `<p>${art.content}</p><p>Read the complete coverage directly on the publisher\'s website using the source link below.</p>` : `<p>${art.description || 'No content details available.'}</p>`,
                    category: state.activeCategory,
                    source: art.source ? art.source.name : 'Global News Network',
                    publishedAt: formatRelativeTime(art.publishedAt),
                    image: art.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
                    url: art.url,
                    readTime: '3 min read'
                }));
                showToast('Successfully fetched live stories from NewsAPI.', 'success');
            } else {
                throw new Error('Malformed NewsAPI response');
            }
        } catch (err) {
            console.error('NewsAPI Fetch failed: ', err);
            showToast('All live fetch attempts failed. Reverting to curated stories.', 'warning');
            state.liveMode = false;
            localStorage.setItem('nexus_live_mode', false);
            const liveToggle = document.getElementById('live-mode-toggle');
            if (liveToggle) liveToggle.checked = false;
            state.articles = [...MOCK_ARTICLES];
        }
    };

    // Helper to format ISO dates to relative strings
    const formatRelativeTime = (dateStr) => {
        if (!dateStr) return 'some time ago';
        try {
            const now = new Date();
            const past = new Date(dateStr);
            const diffMs = now - past;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHrs = Math.floor(diffMins / 60);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} min ago`;
            if (diffHrs < 24) return `${diffHrs} hours ago`;
            return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch {
            return 'recently';
        }
    };

    // ----------------------------------------------------
    // 5. Render Functions
    // ----------------------------------------------------
    const renderSkeletons = () => {
        const grid = document.getElementById('news-grid');
        const heroSection = document.getElementById('hero-section');
        if (!grid || !heroSection) return;

        heroSection.innerHTML = '';
        
        let skeletonsHTML = '';
        for (let i = 0; i < 6; i++) {
            skeletonsHTML += `
                <div class="skeleton-card">
                    <div class="skeleton-anim skeleton-image"></div>
                    <div class="skeleton-anim skeleton-text-sm"></div>
                    <div class="skeleton-anim skeleton-text-lg"></div>
                    <div class="skeleton-anim skeleton-text-md"></div>
                    <div class="skeleton-anim skeleton-text-md" style="width: 65%;"></div>
                    <div class="skeleton-anim skeleton-text-footer"></div>
                </div>
            `;
        }
        grid.innerHTML = skeletonsHTML;
    };

    const renderFeed = () => {
        const grid = document.getElementById('news-grid');
        const heroSection = document.getElementById('hero-section');
        if (!grid || !heroSection) return;

        if (state.loading) return;

        let filtered = state.articles;

        // If in Demo Mode, handle category & search filters on the frontend
        if (!state.liveMode) {
            if (state.activeCategory !== 'all') {
                filtered = filtered.filter(art => art.category === state.activeCategory);
            }
            if (state.searchQuery.trim() !== '') {
                const query = state.searchQuery.toLowerCase();
                filtered = filtered.filter(art => 
                    art.title.toLowerCase().includes(query) || 
                    art.description.toLowerCase().includes(query)
                );
            }
        }

        // Update section title based on filtering
        const feedTitle = document.getElementById('feed-title');
        if (feedTitle) {
            let catName = state.activeCategory.charAt(0).toUpperCase() + state.activeCategory.slice(1);
            if (state.activeCategory === 'all') catName = 'Latest';
            feedTitle.innerText = state.searchQuery ? `Search Results for "${state.searchQuery}"` : `${catName} Articles`;
        }

        if (filtered.length === 0) {
            heroSection.innerHTML = '';
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 0;">
                    <div class="empty-icon">📂</div>
                    <h3>No articles match your criteria</h3>
                    <p>Try clearing your search query or switching categories.</p>
                </div>
            `;
            return;
        }

        // Render Hero Article (if we are NOT searching or if we have filtered list)
        const hasHero = filtered.length > 0;
        let startIndex = 0;

        if (hasHero && !state.searchQuery) {
            const heroArt = filtered[0];
            startIndex = 1;
            const isBookmarked = state.bookmarks.some(b => b.id === heroArt.id);
            const isRead = state.readArticles.includes(heroArt.id);
            
            heroSection.innerHTML = `
                <div class="hero-card ${isRead ? 'read' : ''}" data-id="${heroArt.id}">
                    <div class="hero-image-wrapper">
                        <img src="${heroArt.image}" alt="${heroArt.title}" class="hero-img" loading="eager">
                        <span class="hero-badge">Featured</span>
                    </div>
                    <div class="hero-content">
                        <div class="hero-meta">
                            <span class="source-name">${heroArt.source}</span>
                            <span>&bull;</span>
                            <span>${heroArt.publishedAt}</span>
                            <span>&bull;</span>
                            <span>${heroArt.readTime}</span>
                        </div>
                        <h3 class="hero-title">${heroArt.title}</h3>
                        <p class="hero-desc">${heroArt.description}</p>
                        <div class="hero-footer">
                            <button class="read-more-btn" onclick="openReader('${heroArt.id}')">
                                Read Full Coverage
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                            <button class="card-action-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark('${heroArt.id}', event)" aria-label="Bookmark Article">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            heroSection.innerHTML = '';
        }

        // Render Grid Articles
        let gridHTML = '';
        const gridItems = filtered.slice(startIndex);

        if (gridItems.length === 0 && startIndex === 1) {
            // Only hero article existed, render placeholder message in grid
            gridHTML = `<div style="grid-column: 1 / -1; height: 40px;"></div>`;
        } else {
            gridItems.forEach(art => {
                const isBookmarked = state.bookmarks.some(b => b.id === art.id);
                const isRead = state.readArticles.includes(art.id);
                const categoryLabel = art.category ? art.category.toUpperCase() : 'NEWS';

                gridHTML += `
                    <article class="article-card ${isRead ? 'read' : ''}" data-id="${art.id}">
                        <div class="article-img-wrapper" onclick="openReader('${art.id}')">
                            <img src="${art.image}" alt="${art.title}" class="article-img" loading="lazy">
                            <span class="article-tag">${categoryLabel}</span>
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="source">${art.source}</span>
                                <span class="dot"></span>
                                <span>${art.publishedAt}</span>
                            </div>
                            <h4 class="article-title" onclick="openReader('${art.id}')">${art.title}</h4>
                            <p class="article-desc">${art.description}</p>
                            <div class="article-card-footer">
                                <span style="font-size: 12px; color: var(--text-muted); font-weight: 500;">${art.readTime}</span>
                                <button class="card-action-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark('${art.id}', event)" aria-label="Bookmark Article">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </article>
                `;
            });
        }
        grid.innerHTML = gridHTML;
    };

    const renderBookmarks = () => {
        const bookmarksList = document.getElementById('bookmarks-list');
        const countBadge = document.getElementById('bookmark-count');
        if (!bookmarksList || !countBadge) return;

        countBadge.innerText = state.bookmarks.length;

        if (state.bookmarks.length === 0) {
            bookmarksList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔖</div>
                    <h3>No saved articles yet</h3>
                    <p>Articles you bookmark will be stored here for easy reading later.</p>
                </div>
            `;
            return;
        }

        let listHTML = '';
        state.bookmarks.forEach(art => {
            listHTML += `
                <div class="bookmark-item">
                    <img src="${art.image}" alt="${art.title}" class="bookmark-img" onclick="openReaderFromBookmarks('${art.id}')">
                    <div class="bookmark-info">
                        <h5 class="bookmark-title" onclick="openReaderFromBookmarks('${art.id}')">${art.title}</h5>
                        <div class="bookmark-meta">
                            <span>${art.source}</span>
                            <button class="bookmark-remove" onclick="toggleBookmark('${art.id}', event)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        bookmarksList.innerHTML = listHTML;
    };

    // Render simulated market indices with micro-fluctuations
    const renderMarkets = () => {
        const marketList = document.getElementById('market-list');
        if (!marketList) return;

        const indices = [
            { name: 'S&P 500', value: 5431.60, change: 0.85 },
            { name: 'Dow Jones', value: 39565.80, change: -0.24 },
            { name: 'Nasdaq 100', value: 19720.10, change: 1.48 },
            { name: 'FTSE 100', value: 8146.20, change: 0.12 },
            { name: 'Bitcoin (BTC)', value: 67250.00, change: 3.65 }
        ];

        const updateMarketsUI = () => {
            let html = '';
            indices.forEach(idx => {
                // Introduce slight random fluctuations
                const fluc = (Math.random() - 0.5) * 0.1; 
                idx.change = parseFloat((idx.change + fluc).toFixed(2));
                idx.value = parseFloat((idx.value * (1 + fluc * 0.001)).toFixed(2));

                const isUp = idx.change >= 0;
                const sign = isUp ? '+' : '';
                const changeClass = isUp ? 'up' : 'down';
                const formattedVal = idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                html += `
                    <div class="market-item">
                        <div class="market-info">
                            <span class="market-name">${idx.name}</span>
                            <span class="market-val">${formattedVal}</span>
                        </div>
                        <span class="market-change ${changeClass}">${sign}${idx.change}%</span>
                    </div>
                `;
            });
            marketList.innerHTML = html;
        };

        updateMarketsUI();
        // Update values every 6 seconds to create real-time dashboard feeling
        setInterval(updateMarketsUI, 6000);
    };

    // Render interactive Weather summary
    const renderWeather = () => {
        const weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) return;

        const weatherStates = [
            { temp: 22, condition: 'Partly Cloudy', icon: '⛅', city: 'London' },
            { temp: 28, condition: 'Sunny', icon: '☀️', city: 'New York' },
            { temp: 19, condition: 'Light Rain', icon: '🌧️', city: 'Paris' },
            { temp: 24, condition: 'Clear Sky', icon: '🌙', city: 'Tokyo' }
        ];

        // Default layout
        let activeWeather = weatherStates[Math.floor(Math.random() * weatherStates.length)];

        const drawWeather = (weather) => {
            weatherWidget.innerHTML = `
                <div class="weather-main">
                    <span class="weather-icon">${weather.icon}</span>
                    <span class="weather-temp">${weather.temp}&deg;C</span>
                </div>
                <div class="weather-details">
                    <span class="weather-city">${weather.city}</span>
                    <span class="weather-condition">${weather.condition}</span>
                </div>
            `;
        };

        drawWeather(activeWeather);

        // Attempt Geolocation to simulate local customization
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    // Coordinates retrieved. Since we are in mock mode, map it to a mock local temperature range
                    const hour = new Date().getHours();
                    let localTemp = 20;
                    let icon = '☀️';
                    let cond = 'Clear';

                    if (hour > 19 || hour < 6) {
                        localTemp = 16;
                        icon = '🌙';
                        cond = 'Clear Night';
                    } else if (hour >= 12 && hour <= 16) {
                        localTemp = 26;
                        icon = '☀️';
                        cond = 'Sunny';
                    } else {
                        localTemp = 21;
                        icon = '⛅';
                        cond = 'Partly Cloudy';
                    }

                    drawWeather({
                        temp: localTemp,
                        condition: cond,
                        icon: icon,
                        city: 'Local Area'
                    });
                } catch {
                    // Fallback already rendered
                }
            }, () => {
                // User blocked geolocation, proceed with fallback
            });
        }
    };

    // Populate Breaking News Ticker
    const initTicker = () => {
        const ticker = document.getElementById('ticker-content');
        if (!ticker) return;

        let tickerHTML = '';
        // Pull titles of all available articles
        state.articles.forEach(art => {
            tickerHTML += `
                <span class="ticker-item" onclick="openReader('${art.id}')">&bull; ${art.title}</span>
            `;
        });
        ticker.innerHTML = tickerHTML;
    };

    // ----------------------------------------------------
    // 6. Action Handlers (Bookmark, Read History, Search)
    // ----------------------------------------------------
    window.toggleBookmark = (id, event) => {
        if (event) event.stopPropagation();

        const article = state.articles.find(art => art.id === id) || state.bookmarks.find(art => art.id === id);
        if (!article) return;

        const index = state.bookmarks.findIndex(b => b.id === id);
        
        if (index === -1) {
            // Add to bookmarks
            state.bookmarks.push(article);
            showToast('Article saved to bookmarks.', 'success');
        } else {
            // Remove from bookmarks
            state.bookmarks.splice(index, 1);
            showToast('Article removed from bookmarks.', 'info');
        }

        localStorage.setItem('nexus_bookmarks', JSON.stringify(state.bookmarks));
        
        // Re-render feed and drawer elements to align styling states
        renderFeed();
        renderBookmarks();
        updateReaderModalBookmarkButton();
    };

    window.openReader = (id) => {
        const article = state.articles.find(art => art.id === id);
        if (!article) return;

        state.activeReaderArticle = article;

        // Add to read articles
        if (!state.readArticles.includes(id)) {
            state.readArticles.push(id);
            localStorage.setItem('nexus_read_articles', JSON.stringify(state.readArticles));
        }

        // Render inside Modal content area
        const readerContent = document.getElementById('reader-body-content');
        if (readerContent) {
            readerContent.innerHTML = `
                <div class="reader-meta">
                    <span class="source">${article.source}</span>
                    <span>&bull;</span>
                    <span>${article.publishedAt}</span>
                    <span>&bull;</span>
                    <span>${article.readTime}</span>
                </div>
                <h2 class="reader-title">${article.title}</h2>
                <div class="reader-img-wrapper">
                    <img src="${article.image}" alt="${article.title}" class="reader-img">
                </div>
                <div class="reader-text" id="reader-text-container" style="font-size: ${state.readerFontSize}px">
                    ${article.content}
                </div>
                <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <a href="${article.url}" target="_blank" class="btn-primary" style="display: inline-block; text-align: center;">View Original Publisher</a>
                </div>
            `;
        }

        updateReaderModalBookmarkButton();
        
        // Open the modal
        const modal = document.getElementById('reader-modal');
        if (modal) modal.classList.add('active');

        // Apply visual read dimming on main feed
        renderFeed();
    };

    window.openReaderFromBookmarks = (id) => {
        // Find article in bookmarks state directly
        const article = state.bookmarks.find(art => art.id === id);
        if (!article) return;

        // Open Reader
        // If article isn't in main feed state, temporarily add it to search parameters so ID matches function structures
        if (!state.articles.some(a => a.id === id)) {
            state.articles.push(article);
        }
        
        // Close bookmarks drawer
        const drawer = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.remove('active');

        openReader(id);
    };

    const updateReaderModalBookmarkButton = () => {
        const btn = document.getElementById('reader-bookmark-btn');
        if (!btn || !state.activeReaderArticle) return;

        const isSaved = state.bookmarks.some(b => b.id === state.activeReaderArticle.id);
        btn.className = `action-btn ${isSaved ? 'active' : ''}`;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
        btn.onclick = () => toggleBookmark(state.activeReaderArticle.id);
    };

    // Debounce handler for Search inputs
    let searchTimeout;
    const handleSearchInput = (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            state.searchQuery = e.target.value;
            
            if (state.liveMode) {
                await fetchLiveNews();
            }
            renderFeed();
        }, 400); // 400ms debounce
    };

    // ----------------------------------------------------
    // 7. Toast Notification System
    // ----------------------------------------------------
    const showToast = (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let borderClr = 'var(--primary)';
        if (type === 'success') borderClr = 'hsl(150, 84%, 37%)';
        if (type === 'warning') borderClr = 'hsl(35, 90%, 50%)';
        
        toast.style.borderLeftColor = borderClr;
        toast.innerHTML = `
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove toast after 3.5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInUp 0.3s reverse forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3200);
    };

    // ----------------------------------------------------
    // 8. Event Listeners & Binding
    // ----------------------------------------------------
    const bindEvents = () => {
        // Theme Switching
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                state.theme = state.theme === 'light' ? 'dark' : 'light';
                localStorage.setItem('nexus_theme', state.theme);
                document.documentElement.setAttribute('data-theme', state.theme);
                updateThemeToggleButton();
                showToast(`Switched to ${state.theme} mode.`, 'info');
            });
        }

        // Bookmark Drawer Toggle
        const bookmarksBtn = document.getElementById('bookmarks-btn');
        const closeDrawerBtn = document.getElementById('close-drawer-btn');
        const drawerOverlay = document.getElementById('drawer-overlay');

        if (bookmarksBtn && drawerOverlay) {
            bookmarksBtn.addEventListener('click', () => {
                drawerOverlay.classList.add('active');
            });
        }

        if (closeDrawerBtn && drawerOverlay) {
            closeDrawerBtn.addEventListener('click', () => {
                drawerOverlay.classList.remove('active');
            });
        }

        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', (e) => {
                if (e.target === drawerOverlay) {
                    drawerOverlay.classList.remove('active');
                }
            });
        }

        // Reader Modal Controls
        const closeReaderBtn = document.getElementById('close-reader-btn');
        const readerModal = document.getElementById('reader-modal');

        if (closeReaderBtn && readerModal) {
            closeReaderBtn.addEventListener('click', () => {
                readerModal.classList.remove('active');
                state.activeReaderArticle = null;
            });
        }

        if (readerModal) {
            readerModal.addEventListener('click', (e) => {
                if (e.target === readerModal) {
                    readerModal.classList.remove('active');
                    state.activeReaderArticle = null;
                }
            });
        }

        // Font controls in reader modal
        const btnDec = document.getElementById('font-decrease');
        const btnInc = document.getElementById('font-increase');
        const btnNorm = document.getElementById('font-normal');

        const updateFontRendering = () => {
            const container = document.getElementById('reader-text-container');
            if (container) {
                container.style.fontSize = `${state.readerFontSize}px`;
            }
            localStorage.setItem('nexus_reader_font_size', state.readerFontSize);
        };

        if (btnDec) {
            btnDec.addEventListener('click', () => {
                if (state.readerFontSize > 12) {
                    state.readerFontSize -= 2;
                    updateFontRendering();
                }
            });
        }

        if (btnInc) {
            btnInc.addEventListener('click', () => {
                if (state.readerFontSize < 26) {
                    state.readerFontSize += 2;
                    updateFontRendering();
                }
            });
        }

        if (btnNorm) {
            btnNorm.addEventListener('click', () => {
                state.readerFontSize = 16;
                updateFontRendering();
            });
        }

        // Share button inside Reader view
        const shareBtn = document.getElementById('reader-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (state.activeReaderArticle) {
                    // Try copy to clipboard
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        showToast('Article link copied to clipboard!', 'success');
                    }).catch(() => {
                        showToast('Unable to copy link.', 'warning');
                    });
                }
            });
        }

        // Category Filter Pills
        const categoryNav = document.getElementById('categories-nav');
        if (categoryNav) {
            categoryNav.addEventListener('click', async (e) => {
                const button = e.target.closest('.category-pill');
                if (!button) return;

                // Toggle active styles
                categoryNav.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update filter state
                state.activeCategory = button.getAttribute('data-category');
                
                if (state.liveMode) {
                    await fetchLiveNews();
                }
                renderFeed();
            });
        }

        // Footer category links navigation helper
        document.querySelectorAll('.footer-cat-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const targetCat = link.getAttribute('data-cat');
                
                // Select proper header category pill
                const catPills = document.querySelectorAll('.category-pill');
                catPills.forEach(pill => {
                    if (pill.getAttribute('data-category') === targetCat) {
                        pill.click();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            });
        });

        // Search Input listener
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearchInput);
        }

        // Newsletter form Submission
        const newsForm = document.getElementById('newsletter-form');
        if (newsForm) {
            newsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('newsletter-email');
                if (emailInput && emailInput.value) {
                    showToast(`Thank you! ${emailInput.value} has been subscribed.`, 'success');
                    emailInput.value = '';
                }
            });
        }

        // Settings Modal Controls
        const settingsBtn = document.getElementById('settings-btn');
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        const liveToggle = document.getElementById('live-mode-toggle');
        const apiWrapper = document.getElementById('api-keys-wrapper');

        // Footer API Settings click trigger
        const footerSettings = document.getElementById('view-settings-footer');
        if (footerSettings) {
            footerSettings.addEventListener('click', (e) => {
                e.preventDefault();
                if (settingsBtn) settingsBtn.click();
            });
        }

        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                // Pre-populate input values from local state
                if (liveToggle) liveToggle.checked = state.liveMode;
                if (apiWrapper) apiWrapper.style.display = state.liveMode ? 'block' : 'none';
                
                const gk = document.getElementById('gnews-key');
                const nk = document.getElementById('newsapi-key');
                if (gk) gk.value = state.gnewsKey;
                if (nk) nk.value = state.newsapiKey;

                settingsModal.classList.add('active');
            });
        }

        if (closeSettingsBtn && settingsModal) {
            closeSettingsBtn.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });
        }

        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.classList.remove('active');
                }
            });
        }

        if (liveToggle && apiWrapper) {
            liveToggle.addEventListener('change', (e) => {
                apiWrapper.style.display = e.target.checked ? 'block' : 'none';
            });
        }

        if (saveSettingsBtn && settingsModal) {
            saveSettingsBtn.addEventListener('click', async () => {
                const oldLive = state.liveMode;
                const oldGKey = state.gnewsKey;
                const oldNKey = state.newsapiKey;

                const liveVal = liveToggle ? liveToggle.checked : false;
                const gkeyVal = document.getElementById('gnews-key') ? document.getElementById('gnews-key').value.trim() : '';
                const nkeyVal = document.getElementById('newsapi-key') ? document.getElementById('newsapi-key').value.trim() : '';

                state.liveMode = liveVal;
                state.gnewsKey = gkeyVal;
                state.newsapiKey = nkeyVal;

                localStorage.setItem('nexus_live_mode', liveVal);
                localStorage.setItem('nexus_gnews_key', gkeyVal);
                localStorage.setItem('nexus_newsapi_key', nkeyVal);

                settingsModal.classList.remove('active');
                showToast('Preferences saved successfully.', 'success');

                // Trigger refetch if toggle changed or key details modified
                if (liveVal !== oldLive || gkeyVal !== oldGKey || nkeyVal !== oldNKey) {
                    await fetchLiveNews();
                    renderFeed();
                    initTicker();
                }
            });
        }

        // Clear Reading History helper
        const clearCache = document.getElementById('clear-cache-link');
        if (clearCache) {
            clearCache.addEventListener('click', (e) => {
                e.preventDefault();
                state.readArticles = [];
                localStorage.removeItem('nexus_read_articles');
                renderFeed();
                showToast('Reading history has been cleared.', 'info');
            });
        }

        // Click on logo resets searches and goes to 'all'
        const logo = document.getElementById('logo-link');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                
                const search = document.getElementById('search-input');
                if (search) search.value = '';
                state.searchQuery = '';

                const allPill = document.querySelector('.category-pill[data-category="all"]');
                if (allPill) allPill.click();
            });
        }
    };

    // ----------------------------------------------------
    // 8.5. Aura AI Assistant Logic
    // ----------------------------------------------------
    let auraState = {
        messages: JSON.parse(localStorage.getItem('nexus_aura_chat')) || [
            {
                sender: 'ai',
                text: 'Hello! I am Aura, your global news AI assistant. How can I help you navigate today\'s stories? Feel free to ask me questions, get article summaries, or check what\'s trending.',
                time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            }
        ]
    };

    const initAura = () => {
        const trigger = document.getElementById('aura-trigger');
        const panel = document.getElementById('aura-panel');
        const closeBtn = document.getElementById('aura-close');
        const clearBtn = document.getElementById('aura-clear');
        const form = document.getElementById('aura-form');
        const input = document.getElementById('aura-input');
        const suggs = document.getElementById('aura-suggestions');

        if (!trigger || !panel) return;

        // Toggle panel open/close
        trigger.addEventListener('click', () => {
            panel.classList.toggle('active');
            trigger.classList.toggle('active');
            
            if (panel.classList.contains('active')) {
                renderAuraMessages();
                // Prompt user contextually if they have an article open
                if (state.activeReaderArticle) {
                    const promptText = `I see you are reading *"${state.activeReaderArticle.title}"*. Would you like me to summarize this article for you?`;
                    // Check if last message already is this prompt to avoid spamming
                    const lastMsg = auraState.messages[auraState.messages.length - 1];
                    if (!lastMsg || lastMsg.text !== promptText) {
                        setTimeout(() => {
                            addAuraMessage('ai', promptText);
                        }, 500);
                    }
                }
                setTimeout(() => input.focus(), 300);
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.classList.remove('active');
                trigger.classList.remove('active');
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                auraState.messages = [
                    {
                        sender: 'ai',
                        text: 'Chat history cleared. How else can I help you today?',
                        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                    }
                ];
                localStorage.setItem('nexus_aura_chat', JSON.stringify(auraState.messages));
                renderAuraMessages();
                showToast('Chat history cleared.', 'info');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = input.value.trim();
                if (!query) return;

                input.value = '';
                handleAuraUserQuery(query);
            });
        }

        if (suggs) {
            suggs.addEventListener('click', (e) => {
                const chip = e.target.closest('.aura-chip');
                if (!chip) return;
                const prompt = chip.getAttribute('data-prompt');
                handleAuraUserQuery(prompt);
            });
        }

        renderAuraMessages();
    };

    const renderAuraMessages = () => {
        const msgContainer = document.getElementById('aura-messages');
        if (!msgContainer) return;

        msgContainer.innerHTML = '';
        auraState.messages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = `aura-msg ${msg.sender}`;
            msgEl.innerHTML = `
                ${msg.text}
                <span class="aura-msg-time">${msg.time}</span>
            `;
            msgContainer.appendChild(msgEl);
        });

        // Scroll to bottom
        msgContainer.scrollTop = msgContainer.scrollHeight;
    };

    const addAuraMessage = (sender, text) => {
        const msg = {
            sender,
            text,
            time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
        auraState.messages.push(msg);
        localStorage.setItem('nexus_aura_chat', JSON.stringify(auraState.messages));
        renderAuraMessages();
    };

    const handleAuraUserQuery = async (query) => {
        // Render user message
        addAuraMessage('user', query);

        // Show typing indicator
        const msgContainer = document.getElementById('aura-messages');
        if (!msgContainer) return;

        const typingEl = document.createElement('div');
        typingEl.className = 'aura-typing';
        typingEl.id = 'aura-typing-indicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        msgContainer.appendChild(typingEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Generate context-aware response based on query
        const responseText = await getAuraAIResponse(query);

        // Simulate typing delay
        setTimeout(() => {
            const indicator = document.getElementById('aura-typing-indicator');
            if (indicator) indicator.remove();

            // Stream response to screen word-by-word
            const aiMsgEl = document.createElement('div');
            aiMsgEl.className = 'aura-msg ai';
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'aura-msg-time';
            timeSpan.innerText = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            aiMsgEl.appendChild(timeSpan);
            msgContainer.appendChild(aiMsgEl);

            const words = responseText.split(' ');
            let wordIndex = 0;
            let currentText = '';

            const streamWords = () => {
                if (wordIndex < words.length) {
                    currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
                    // Insert before the time span
                    aiMsgEl.innerHTML = `${currentText} <span class="aura-msg-time">${timeSpan.innerText}</span>`;
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                    wordIndex++;
                    setTimeout(streamWords, 30 + Math.random() * 40); // Natural word rendering speed
                } else {
                    // Once typing finishes, save message to state
                    const finalMsg = {
                        sender: 'ai',
                        text: responseText,
                        time: timeSpan.innerText
                    };
                    auraState.messages.push(finalMsg);
                    localStorage.setItem('nexus_aura_chat', JSON.stringify(auraState.messages));
                }
            };

            streamWords();

        }, 1000 + Math.random() * 600); // Thinking delay
    };

    const getAuraAIResponse = async (query) => {
        const cleanQuery = query.toLowerCase();

        // 1. Check if user is asking to summarize the open article
        if (cleanQuery.includes('summarize this') || cleanQuery.includes('summarize active') || cleanQuery.includes('summarize article')) {
            if (state.activeReaderArticle) {
                return generateArticleSummary(state.activeReaderArticle);
            } else {
                return 'You don\'t have any article open in Reader View right now. Open an article and ask me again, or type "Summarize today\'s headlines" to get a summary of all news!';
            }
        }

        // 2. Help prompts
        if (cleanQuery.includes('help') || cleanQuery.includes('what can you do') || cleanQuery.includes('features')) {
            return 'I can summarize articles, scan today\'s headlines, search specific topics, and explain scientific or political breakthroughs. Ask me things like:\n\n• "Summarize today\'s headlines"\n• "Tell me about the climate summit"\n• "Explain the new quantum processor"\n• "Summarize this article" (when reading a post)';
        }

        // 3. Greeting checking
        if (cleanQuery === 'hi' || cleanQuery === 'hello' || cleanQuery === 'hey' || cleanQuery.startsWith('greetings') || cleanQuery.startsWith('good morning') || cleanQuery.startsWith('good evening')) {
            return 'Hello! I\'m Aura, your global news assistant. I can synthesize summaries of breaking stories or search across topics. What news interests you today?';
        }

        // 4. Summarize Headlines
        if (cleanQuery.includes('summarize headlines') || cleanQuery.includes('summarize today') || cleanQuery.includes('breaking news') || cleanQuery.includes('latest news')) {
            if (state.articles.length === 0) {
                return 'There are no articles available to summarize right now.';
            }
            let summary = 'Here is a quick digest of today\'s top stories:\n\n';
            const count = Math.min(state.articles.length, 4);
            for (let i = 0; i < count; i++) {
                const art = state.articles[i];
                summary += `📍 *${art.source}*: ${art.title}\n\n`;
            }
            return summary + 'Would you like more details on any of these topics? Just ask!';
        }

        // 5. Match keywords with specific articles
        let bestMatch = null;
        let highestScore = 0;

        state.articles.forEach(art => {
            let score = 0;
            const title = art.title.toLowerCase();
            const desc = art.description.toLowerCase();
            
            // Extract keyword terms
            const words = cleanQuery.split(' ');
            words.forEach(word => {
                if (word.length > 3) {
                    if (title.includes(word)) score += 3;
                    if (desc.includes(word)) score += 1;
                }
            });

            if (score > highestScore) {
                highestScore = score;
                bestMatch = art;
            }
        });

        if (bestMatch && highestScore > 1) {
            return `I found a matching story: *"${bestMatch.title}"* (${bestMatch.source}). Here is a summary of the key highlights:\n\n${bestMatch.description}\n\nWould you like me to explain this in more detail or search for related stories?`;
        }

        // Fallback responses
        if (cleanQuery.includes('weather')) {
            return 'I can see the weather summary widget in your sidebar! It shows updates based on your location if allowed, or displays fallback updates for Paris, NY, or Tokyo.';
        }
        if (cleanQuery.includes('market') || cleanQuery.includes('stock') || cleanQuery.includes('bitcoin') || cleanQuery.includes('btc')) {
            return 'Global financial markets are updating in your sidebar dashboard! Dow Jones, Nasdaq 100, and Bitcoin are tracked with micro-fluctuations every 6 seconds.';
        }

        return 'I couldn\'t find any articles directly matching that query. Try asking about:\n\n• "climate treaty"\n• "quantum computer api"\n• "interest rate cuts"\n• "cancer immunotherapy trials"\n• "deep sea coral reefs"';
    };

    const generateArticleSummary = (article) => {
        return `Here is a summary of *"${article.title}"* from *${article.source}*:\n\n` +
               `• **Key Event**: ${article.description}\n` +
               `• **Publisher Date**: ${article.publishedAt}\n` +
               `• **Implications**: The story details developments which could impact industries across ${article.category.toUpperCase()} and reshape future trends.\n\n` +
               `You can scroll the reader view to review the original, or ask me for more details!`;
    };

    // ----------------------------------------------------
    // 9. App Bootstrap
    // ----------------------------------------------------
    const bootstrap = async () => {
        initTheme();
        bindEvents();
        renderMarkets();
        renderWeather();
        initAura();
        
        // Initial Fetch
        await fetchLiveNews();
        renderFeed();
        renderBookmarks();
        initTicker();
    };

    bootstrap();
});
