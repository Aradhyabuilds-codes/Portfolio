// Celestia Kitchen - Dynamic Logic & Aura AI Concierge

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Menu Database
    // ----------------------------------------------------
    const MENU_DATABASE = [
        {
            id: 'starter-1',
            title: 'Astral Beetroot Carpaccio',
            price: '₹750',
            description: 'Paper-thin roasted heirloom beetroots, whipped goat cheese, candied walnuts, organic arugula, and honey-lavender celestial dressing.',
            category: 'starters',
            tags: ['gf'],
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Chef Vance recommends pairing with a glass of organic Sauvignon Blanc.'
        },
        {
            id: 'starter-2',
            title: 'Harvest Moon Burrata',
            price: '₹890',
            description: 'Creamy burrata sphere, sun-ripened astronomical tomatoes, dark balsamic drops, and fresh micro-basil on toasted artisanal sourdough.',
            category: 'starters',
            tags: ['nf'],
            image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Vegan option available upon request (substituting cashew cheese cream).'
        },
        {
            id: 'main-1',
            title: 'Solar Flare Smoked Duck',
            price: '₹1,650',
            description: 'Pan-seared maple leaf duck breast glazed with spiced orange and blood plum reductions, served over parsnip puree and charred Romanesco.',
            category: 'mains',
            tags: ['gf', 'nf'],
            image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Our signature entrée, smoked under cherrywood cloches at your table.'
        },
        {
            id: 'main-2',
            title: 'Cosmic Mushroom Risotto',
            price: '₹1,250',
            description: 'Creamy Arborio rice folded with wild forest chanterelles, black truffle shavings, aged parmesan, and micro-herbs.',
            category: 'mains',
            tags: ['vegan', 'gf', 'nf'],
            image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Made vegan using cold-press olive oil and nutritional yeast.'
        },
        {
            id: 'main-3',
            title: 'Galaxy Glazed Salmon',
            price: '₹1,580',
            description: 'Wild-caught salmon fillet baked with a sweet miso-mirin glaze, served with purple sweet potato mash and sesame-ginger asparagus.',
            category: 'mains',
            tags: ['gf', 'nf'],
            image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Rich in omega-3 fats, symbolizing ocean constellations.'
        },
        {
            id: 'dessert-1',
            title: 'Supernova Chocolate Melt',
            price: '₹680',
            description: 'Decadent dark chocolate lava cake with a molten core, served with gold-dusted vanilla bean ice cream and raspberry craters.',
            category: 'desserts',
            tags: ['nf'],
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Tear open the sponge to reveal the molten lava cascade.'
        },
        {
            id: 'dessert-2',
            title: 'Stardust Matcha Panna Cotta',
            price: '₹590',
            description: 'Silky ceremonial-grade green tea panna cotta, topped with edible stardust, wild berries, and a yuzu jelly layer.',
            category: 'desserts',
            tags: ['gf'],
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Extremely light, refreshing, and clean.'
        },
        {
            id: 'drink-1',
            title: 'Meteorite Smoked Old Fashioned',
            price: '₹750',
            description: 'Premium bourbon stirred with bitters and maple syrup, infused with hickory smoke and presented under glass domes.',
            category: 'libations',
            tags: ['vegan', 'gf', 'nf'],
            image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Garnished with a single giant ice sphere.'
        },
        {
            id: 'drink-2',
            title: 'Eclipse Blackberry Sour',
            price: '₹620',
            description: 'Muddled fresh blackberries, organic gin, elderflower liqueur, lemon, egg white foam, and a cosmic paint swirl.',
            category: 'libations',
            tags: ['gf', 'nf'],
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
            chefNote: 'Can be ordered non-alcoholic (using seedlip spice extract).'
        }
    ];

    // ----------------------------------------------------
    // 2. Events Database
    // ----------------------------------------------------
    const EVENTS_DATABASE = [
        {
            id: 'event-1',
            title: 'Solstice Wine Pairing Masterclass',
            description: 'Explore a custom 5-course tasting menu paired with exclusive organic and biodynamic vintages. Led by lead sommelier Clara Vance.',
            date: '2026-06-21',
            displayDate: '21',
            displayMonth: 'Jun',
            time: '7:00 PM - 10:00 PM',
            price: '₹3,500',
            image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'event-2',
            title: 'Celestial Jazz & Cocktails Night',
            description: 'A stellar night featuring live ambient jazz by the Blue Nebula Trio. Special molecular cocktail menus and patio dining packages.',
            date: '2026-06-27',
            displayDate: '27',
            displayMonth: 'Jun',
            time: '8:30 PM - 11:30 PM',
            price: '₹1,200',
            image: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&w=800&q=80'
        }
    ];

    // ----------------------------------------------------
    // 3. State Management
    // ----------------------------------------------------
    let state = {
        activeCategory: 'all',
        dietaryFilters: [],
        searchQuery: '',
        selectedDate: '',
        selectedTime: '',
        activeBooking: JSON.parse(localStorage.getItem('celestia_active_booking')) || null
    };

    // ----------------------------------------------------
    // 4. Initialization & Bootstrap
    // ----------------------------------------------------
    const initNavbarScroll = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    };

    // Setup active links on scroll for nav link highlight
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 120) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    };

    // Initialize Date picker boundaries
    const initDatePicker = () => {
        const dateInput = document.getElementById('book-date');
        if (!dateInput) return;

        // Set min date to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;

        // Listen for changes
        dateInput.addEventListener('change', (e) => {
            state.selectedDate = e.target.value;
            generateTimeSlots(e.target.value);
        });

        // Set default to today
        dateInput.value = `${yyyy}-${mm}-${dd}`;
        state.selectedDate = dateInput.value;
        generateTimeSlots(dateInput.value);
    };

    // ----------------------------------------------------
    // 5. Menu & Events Renderers
    // ----------------------------------------------------
    const renderMenuGrid = () => {
        const grid = document.getElementById('menu-grid');
        if (!grid) return;

        let filtered = MENU_DATABASE;

        // Category filter
        if (state.activeCategory !== 'all') {
            filtered = filtered.filter(item => item.category === state.activeCategory);
        }

        // Dietary filters
        if (state.dietaryFilters.length > 0) {
            filtered = filtered.filter(item => {
                return state.dietaryFilters.every(filter => item.tags.includes(filter));
            });
        }

        // Search query filter
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px 0; color: var(--text-muted);">
                    <p style="font-size: 16px;">No dishes match your dietary quadrants.</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(item => {
            const tagsHTML = item.tags.map(t => `<span class="menu-tag">${t}</span>`).join(' ');
            html += `
                <div class="menu-card" data-id="${item.id}">
                    <div class="menu-card-img-wrap">
                        <img src="${item.image}" alt="${item.title}" class="menu-card-img" loading="lazy">
                        <div class="menu-card-tags">${tagsHTML}</div>
                    </div>
                    <div class="menu-card-content">
                        <div class="menu-card-header">
                            <h4 class="menu-card-title">${item.title}</h4>
                            <span class="menu-card-price">${item.price}</span>
                        </div>
                        <p class="menu-card-desc">${item.description}</p>
                        <div class="menu-card-footer">
                            <span class="chef-note">${item.chefNote}</span>
                            <button class="btn-order-direct" onclick="triggerMenuAuraPrompt('${item.title}')">
                                Ask Aura Pairings &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    };

    const renderEvents = () => {
        const grid = document.getElementById('events-grid');
        if (!grid) return;

        let html = '';
        EVENTS_DATABASE.forEach(evt => {
            html += `
                <div class="event-card">
                    <div class="event-img-wrap">
                        <img src="${evt.image}" alt="${evt.title}" class="event-img">
                        <div class="event-date-badge">
                            <span class="event-date-day">${evt.displayDate}</span>
                            <span class="event-date-month">${evt.displayMonth}</span>
                        </div>
                    </div>
                    <div class="event-content">
                        <span class="event-time">${evt.time}</span>
                        <h4 class="event-title">${evt.title}</h4>
                        <p class="event-desc">${evt.description}</p>
                        <div class="event-footer">
                            <div class="event-price">${evt.price}<span>/guest</span></div>
                            <button class="btn-rsvp" onclick="triggerRSVPEngine('${evt.date}', '${evt.title}')">RSVP Experience</button>
                        </div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    };

    // ----------------------------------------------------
    // 6. Reservation Booking Logic
    // ----------------------------------------------------
    const generateTimeSlots = (dateString) => {
        const grid = document.getElementById('time-slots-grid');
        if (!grid) return;

        // Reset selected time slot in state
        state.selectedTime = '';

        // Generate standard time slots
        const baseSlots = ['5:30 PM', '6:30 PM', '7:30 PM', '8:30 PM', '9:30 PM', '10:30 PM'];
        
        let html = '';
        baseSlots.forEach((slot, index) => {
            // Seed dynamic parameters based on selected date to make scheduler feel alive
            const dateNum = new Date(dateString).getDate() || 1;
            const seed = (dateNum + index) % 3; // 0 = Avail, 1 = Fast, 2 = Sold

            let statusClass = '';
            let note = '';

            if (seed === 1) {
                statusClass = 'filling-fast';
            } else if (seed === 2) {
                statusClass = 'sold-out';
            }

            html += `
                <button type="button" class="time-slot-btn ${statusClass}" data-time="${slot}">
                    ${slot}
                </button>
            `;
        });

        grid.innerHTML = html;

        // Attach event listeners to newly generated slots
        grid.querySelectorAll('.time-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                grid.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.selectedTime = btn.getAttribute('data-time');
            });
        });
    };

    // Handle RSVP event click triggers
    window.triggerRSVPEngine = (dateStr, eventName) => {
        // Find fields
        const dateInput = document.getElementById('book-date');
        const seatingLabels = document.querySelectorAll('.seating-option-label');
        const scrollTarget = document.getElementById('reservations');

        if (dateInput) {
            dateInput.value = dateStr;
            state.selectedDate = dateStr;
            generateTimeSlots(dateStr);
        }

        // Set Seating quadrant preference automatically to Chef Observatory
        seatingLabels.forEach(lbl => {
            const radio = lbl.querySelector('input');
            lbl.classList.remove('active');
            if (radio && radio.value === 'Chef\'s Observatory Table') {
                radio.checked = true;
                lbl.classList.add('active');
            }
        });

        // Scroll to reservation
        if (scrollTarget) {
            scrollTarget.scrollIntoView({ behavior: 'smooth' });
        }

        showToast(`Selected date and seating for ${eventName}. Complete details to confirm!`, 'info');
    };

    // Form submission
    const handleBookingForm = () => {
        const form = document.getElementById('booking-form');
        if (!form) return;

        // Handle seating quadrant active styles
        const seatingLabels = document.querySelectorAll('.seating-option-label');
        seatingLabels.forEach(lbl => {
            lbl.addEventListener('click', () => {
                seatingLabels.forEach(l => l.classList.remove('active'));
                lbl.classList.add('active');
                const radio = lbl.querySelector('input');
                if (radio) radio.checked = true;
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('book-name').value.trim();
            const email = document.getElementById('book-email').value.trim();
            const guestsSelect = document.getElementById('book-guests');
            const guests = guestsSelect ? guestsSelect.options[guestsSelect.selectedIndex].text : '2 Guests';
            const selectedSeating = form.querySelector('input[name="seating"]:checked').value;

            // Input validations
            if (!state.selectedDate) {
                showToast('Please select a dining date.', 'warning');
                return;
            }
            if (!state.selectedTime) {
                showToast('Please select an available dining time slot.', 'warning');
                return;
            }

            // Generate Booking code pass
            const codeNum = Math.floor(1000 + Math.random() * 9000);
            const passID = `CEL-${codeNum}`;

            // Save reservation to local state and local storage
            const reservationDetails = {
                id: passID,
                name,
                email,
                guests,
                date: state.selectedDate,
                time: state.selectedTime,
                seating: selectedSeating
            };

            state.activeBooking = reservationDetails;
            localStorage.setItem('celestia_active_booking', JSON.stringify(reservationDetails));

            // Launch modal display
            launchConfirmationModal(reservationDetails);
            
            // Send toast notification
            showToast('Celestial Pass created. Check booking ticket!', 'success');
            
            form.reset();
            // Re-render date / slots
            initDatePicker();
        });
    };

    const launchConfirmationModal = (details) => {
        const modal = document.getElementById('confirm-modal');
        if (!modal) return;

        // Render ticket details
        document.getElementById('ticket-id-val').innerText = details.id;
        document.getElementById('ticket-guest-name').innerText = details.name;
        document.getElementById('ticket-party-details').innerHTML = `${details.guests} &bull; ${details.seating}`;
        
        // Format date beautifully
        const dateObj = new Date(details.date);
        const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        document.getElementById('ticket-schedule-details').innerText = `${formattedDate} at ${details.time}`;

        modal.classList.add('active');
    };

    // ----------------------------------------------------
    // 7. Aura AI Dining Concierge
    // ----------------------------------------------------
    let auraState = {
        messages: JSON.parse(localStorage.getItem('celestia_aura_chat')) || [
            {
                sender: 'ai',
                text: 'Greetings! I am Aura, your Celestia Dining Concierge. How can I assist your culinary journey today? I can recommend dishes, describe our wines, details event schedules, or pull up your active table reservation pass.',
                time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            }
        ]
    };

    const initAura = () => {
        const trigger = document.getElementById('aura-trigger');
        const panel = document.getElementById('aura-panel');
        const closeBtn = document.getElementById('aura-close');
        const form = document.getElementById('aura-form');
        const input = document.getElementById('aura-input');
        const suggestions = document.getElementById('aura-suggestions');

        if (!trigger || !panel) return;

        trigger.addEventListener('click', () => {
            panel.classList.toggle('active');
            trigger.classList.toggle('active');

            if (panel.classList.contains('active')) {
                renderAuraMessages();
                setTimeout(() => input.focus(), 300);
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.classList.remove('active');
                trigger.classList.remove('active');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = input.value.trim();
                if (!query) return;

                input.value = '';
                handleAuraQuery(query);
            });
        }

        if (suggestions) {
            suggestions.addEventListener('click', (e) => {
                const chip = e.target.closest('.aura-chip');
                if (!chip) return;
                const prompt = chip.getAttribute('data-prompt');
                handleAuraQuery(prompt);
            });
        }

        renderAuraMessages();
    };

    const renderAuraMessages = () => {
        const container = document.getElementById('aura-messages');
        if (!container) return;

        container.innerHTML = '';
        auraState.messages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = `aura-msg ${msg.sender}`;
            msgEl.innerHTML = `
                ${msg.text}
                <span class="aura-msg-time">${msg.time}</span>
            `;
            container.appendChild(msgEl);
        });

        container.scrollTop = container.scrollHeight;
    };

    const addAuraMessage = (sender, text) => {
        const msg = {
            sender,
            text,
            time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
        auraState.messages.push(msg);
        localStorage.setItem('celestia_aura_chat', JSON.stringify(auraState.messages));
        renderAuraMessages();
    };

    const handleAuraQuery = async (query) => {
        addAuraMessage('user', query);

        const msgContainer = document.getElementById('aura-messages');
        if (!msgContainer) return;

        const typingEl = document.createElement('div');
        typingEl.className = 'aura-typing';
        typingEl.id = 'aura-typing-indicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        msgContainer.appendChild(typingEl);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Process response text based on keywords
        const replyText = await generateAuraConciergeResponse(query);

        setTimeout(() => {
            const indicator = document.getElementById('aura-typing-indicator');
            if (indicator) indicator.remove();

            // Word-by-word streaming effect
            const aiMsgEl = document.createElement('div');
            aiMsgEl.className = 'aura-msg ai';
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'aura-msg-time';
            timeSpan.innerText = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            aiMsgEl.appendChild(timeSpan);
            msgContainer.appendChild(aiMsgEl);

            const words = replyText.split(' ');
            let idx = 0;
            let runningText = '';

            const stream = () => {
                if (idx < words.length) {
                    runningText += (idx === 0 ? '' : ' ') + words[idx];
                    aiMsgEl.innerHTML = `${runningText} <span class="aura-msg-time">${timeSpan.innerText}</span>`;
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                    idx++;
                    setTimeout(stream, 35 + Math.random() * 30);
                } else {
                    // Save to local storage message history
                    const finalMsg = {
                        sender: 'ai',
                        text: replyText,
                        time: timeSpan.innerText
                    };
                    auraState.messages.push(finalMsg);
                    localStorage.setItem('celestia_aura_chat', JSON.stringify(auraState.messages));
                }
            };
            stream();
        }, 1000 + Math.random() * 500);
    };

    const generateAuraConciergeResponse = async (query) => {
        const clean = query.toLowerCase();

        // 1. Recall Booking pass
        if (clean.includes('pass') || clean.includes('ticket') || clean.includes('my reservation') || clean.includes('my booking')) {
            if (state.activeBooking) {
                const bk = state.activeBooking;
                return `Here is your active dining pass details:\n\n` + 
                       `🎫 **Pass ID**: ${bk.id}\n` +
                       `👤 **Guest**: ${bk.name}\n` +
                       `👥 **Size**: ${bk.guests}\n` +
                       `📍 **Quadrant**: ${bk.seating}\n` +
                       `📅 **Schedule**: ${bk.date} at ${bk.time}\n\n` +
                       `Feel free to present this pass to our host on arrival! Let me know if you would like me to cancel or modify bookings.`;
            } else {
                return 'I checked our active session records, but I couldn\'t find any table bookings under your name. Select a date, time, and seating quadrant in the booking form to secure your table!';
            }
        }

        // 2. Clear Active booking
        if (clean.includes('cancel my booking') || clean.includes('cancel reservation')) {
            if (state.activeBooking) {
                const oldCode = state.activeBooking.id;
                state.activeBooking = null;
                localStorage.removeItem('celestia_active_booking');
                return `Your booking pass *${oldCode}* has been successfully removed from local storage. The quadrant availability has been updated. Feel free to schedule a new dinner anytime!`;
            } else {
                return 'There are no active reservations in your local profile session to cancel.';
            }
        }

        // 3. Greeting
        if (clean === 'hi' || clean === 'hello' || clean === 'hey' || clean.startsWith('greetings')) {
            return 'Greetings! Welcome to Celestia Kitchen. I can help recommend appetizers, check wine pairings, list event dates, or manage your reservation receipt. What celestial details interest you today?';
        }

        // 4. Chef Recommendations
        if (clean.includes('recommend') || clean.includes('specialties') || clean.includes('specialty') || clean.includes('chef recommended')) {
            return 'Chef Julian Vance highly recommends starting with our *Harvest Moon Burrata* ( burrata with fresh basil oils). For the main course, our *Solar Flare Smoked Duck* (cherrywood smoked blood plum duck) is an absolute must-try experience. If you prefer vegetarian, our *Cosmic Mushroom Risotto* with black truffles is superb!';
        }

        // 5. Dietary options
        if (clean.includes('vegan')) {
            return 'For our vegan guests, we offer the *Cosmic Mushroom Risotto* (using cold-press olive oil and nutritional yeast) and a selection of fresh mocktails. Our *Harvest Moon Burrata* starter can also be crafted vegan on request using cashew cheese burrata. Let our kitchen know about your allergen profiles!';
        }
        if (clean.includes('gluten') || clean.includes('gf')) {
            return 'Gluten-Free constellations on our current menu include: *Astral Beetroot Carpaccio* (starter), *Solar Flare Smoked Duck* (main), *Cosmic Mushroom Risotto* (main), *Galaxy Glazed Salmon* (main), *Stardust Matcha Panna Cotta* (dessert), and all of our Signature Libations!';
        }

        // 6. Events check
        if (clean.includes('event') || clean.includes('experience') || clean.includes('jazz') || clean.includes('wine')) {
            return 'We have two exclusive experiences scheduled this month:\n\n' + 
                   '1. 🍷 **Solstice Wine Pairing Masterclass** (June 21, 7 PM) – A 5-course tasting menu paired with biodynamic vintages.\n' +
                   '2. 🎷 **Celestial Jazz & Cocktails** (June 27, 8:30 PM) – Live ambient jazz and molecular signature mixology.\n\n' + 
                   'Click the "RSVP Experience" button under your preferred event card to automatically populate the booking engine!';
        }

        // 7. Context pairings for specific menu items
        if (clean.startsWith('pair') || clean.includes('pairing')) {
            return 'Our signature *Solar Flare Smoked Duck* pairs beautifully with our heavy, dry *Meteorite Smoked Old Fashioned*. For lighter starters like *Harvest Moon Burrata*, we recommend our crisp *Eclipse Blackberry Sour* or a vintage Sauvignon Blanc. Ask our host sommelier for direct cellar lists!';
        }

        // Fallback info
        return 'I\'m not sure about that detail. You can ask me things like:\n\n• "Recommend a starter"\n• "Is there a vegan option?"\n• "Tell me about the Solstice Wine Tasting"\n• "Show my active reservation pass"\n• "Can you recommend a wine pairing?"';
    };

    // Global utility to allow menu card click button to prompt Aura
    window.triggerMenuAuraPrompt = (dishTitle) => {
        const trigger = document.getElementById('aura-trigger');
        const panel = document.getElementById('aura-panel');

        if (!trigger || !panel) return;

        // Open chat if closed
        if (!panel.classList.contains('active')) {
            trigger.click();
        }

        // Submit query immediately
        handleAuraQuery(`Tell me about the pairing for ${dishTitle}`);
    };

    // ----------------------------------------------------
    // 8. Event Listeners & Binding
    // ----------------------------------------------------
    const bindEvents = () => {
        // Mobile Navigation Toggle
        const toggleBtn = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                if (navMenu.classList.contains('active')) {
                    navMenu.style.display = 'flex';
                    navMenu.style.flexDirection = 'column';
                    navMenu.style.position = 'absolute';
                    navMenu.style.top = '85px';
                    navMenu.style.left = '0';
                    navMenu.style.width = '100%';
                    navMenu.style.backgroundColor = 'var(--bg-surface)';
                    navMenu.style.padding = '24px';
                    navMenu.style.borderBottom = '1px solid var(--border-color)';
                } else {
                    navMenu.style.display = '';
                }
            });
        }

        // Close mobile nav on links click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navMenu.style.display = '';
                }
            });
        });

        // Menu search input
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.trim();
                renderMenuGrid();
            });
        }

        // Menu category tab buttons
        const tabContainer = document.getElementById('menu-tabs');
        if (tabContainer) {
            tabContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.menu-tab-btn');
                if (!btn) return;

                tabContainer.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                state.activeCategory = btn.getAttribute('data-category');
                renderMenuGrid();
            });
        }

        // Dietary checkbox filters
        const dietaryWrap = document.getElementById('dietary-filters');
        if (dietaryWrap) {
            dietaryWrap.addEventListener('change', () => {
                const checkboxes = dietaryWrap.querySelectorAll('.dietary-checkbox');
                state.dietaryFilters = [];
                checkboxes.forEach(cb => {
                    if (cb.checked) {
                        state.dietaryFilters.push(cb.value);
                    }
                });
                renderMenuGrid();
            });
        }

        // Print Reservation ticket pass helper
        const printBtn = document.getElementById('print-ticket-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                const ticket = document.getElementById('ticket-pass-receipt');
                if (!ticket) return;

                // Simple custom print window
                const printWin = window.open('', '_blank');
                printWin.document.write(`
                    <html>
                    <head>
                        <title>Celestia Kitchen Ticket Pass</title>
                        <style>
                            body { font-family: 'Playfair Display', serif; background: #070a13; color: #fff; padding: 40px; text-align: center; }
                            .ticket { border: 2px solid #d4af37; padding: 40px; border-radius: 14px; max-width: 500px; margin: 0 auto; background: #070a13; box-shadow: 0 0 20px rgba(212,175,55,0.2); }
                            h2 { color: #d4af37; font-size: 32px; margin-bottom: 20px; }
                            .divider { border-top: 2px dashed rgba(212,175,55,0.3); margin: 24px 0; }
                            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
                            .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; }
                            .val { font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="ticket">
                            <h2>Celestia Kitchen Pass</h2>
                            <div class="row">
                                <span class="label">Pass ID</span>
                                <span class="val">${details = document.getElementById('ticket-id-val').innerText}</span>
                            </div>
                            <div class="divider"></div>
                            <div class="row">
                                <span class="label">Guest</span>
                                <span class="val">${document.getElementById('ticket-guest-name').innerText}</span>
                            </div>
                            <div class="row">
                                <span class="label">Party Details</span>
                                <span class="val">${document.getElementById('ticket-party-details').innerText}</span>
                            </div>
                            <div class="row">
                                <span class="label">Date & Time</span>
                                <span class="val">${document.getElementById('ticket-schedule-details').innerText}</span>
                            </div>
                        </div>
                        <script>window.print();</script>
                    </body>
                    </html>
                `);
                printWin.document.close();
            });
        }

        // Close Confirm reservation modal
        const closeModalBtn = document.getElementById('close-modal-btn');
        const okModalBtn = document.getElementById('ok-modal-btn');
        const confirmModal = document.getElementById('confirm-modal');

        const hideModal = () => {
            if (confirmModal) confirmModal.classList.remove('active');
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
        if (okModalBtn) okModalBtn.addEventListener('click', hideModal);
        if (confirmModal) {
            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) hideModal();
            });
        }
    };

    // ----------------------------------------------------
    // 9. Toast Notification
    // ----------------------------------------------------
    const showToast = (message, type = 'info') => {
        // Reuse weather / news aggregator toast container pattern if present, or create dynamically
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.position = 'fixed';
            container.style.bottom = '24px';
            container.style.left = '24px';
            container.style.zIndex = '300';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        // Setup direct style mapping since container is created dynamically
        toast.style.background = 'hsl(224, 50%, 8%)';
        toast.style.color = 'hsl(210, 40%, 98%)';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '6px';
        toast.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
        toast.style.borderLeft = '4px solid var(--primary)';
        toast.style.fontSize = '13.5px';
        toast.style.fontWeight = '500';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '12px';
        toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';

        if (type === 'success') toast.style.borderLeftColor = 'hsl(150, 84%, 37%)';
        if (type === 'warning') toast.style.borderLeftColor = 'hsl(35, 90%, 50%)';

        toast.innerText = message;
        container.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3200);
    };

    // ----------------------------------------------------
    // 10. Bootstrap App
    // ----------------------------------------------------
    const bootstrap = () => {
        initNavbarScroll();
        initScrollSpy();
        initDatePicker();
        
        renderMenuGrid();
        renderEvents();
        
        handleBookingForm();
        initAura();
    };

    bootstrap();
});
