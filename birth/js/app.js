/**
 * Main Application Controller for Shalini's Birthday Surprise
 * Handles page transitions, state machine, interactions, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
        currentPage: 1,
        maxPages: 5,
        isTransitioning: false,
        wishMade: false,
        soundInitialized: false,
        currentModalMemoryIndex: 0
    };

    // DOM Elements Cache
    const pages = document.querySelectorAll('.page-section');
    const progressText = document.getElementById('progress-text');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');

    // Page 1 Elements
    const giftBox = document.getElementById('gift-box');
    const openSurpriseBtn = document.getElementById('open-surprise-btn');
    const flashOverlay = document.getElementById('magical-flash-overlay');

    // Page 2 Elements
    const page2NextBtn = document.getElementById('page2-next-btn');
    const leftPopperTrigger = document.getElementById('popper-trigger-left');
    const rightPopperTrigger = document.getElementById('popper-trigger-right');
    const balloonsContainer = document.getElementById('balloons-container');

    // Page 3 Elements
    const memoriesGrid = document.getElementById('memories-grid');
    const page3NextBtn = document.getElementById('page3-next-btn');
    const memoryModal = document.getElementById('memory-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalTag = document.getElementById('modal-tag');
    const modalStory = document.getElementById('modal-story');
    const modalQuote = document.getElementById('modal-quote');
    const modalReactBtn = document.getElementById('modal-react-btn');

    // Page 4 Elements
    const page4Lines = document.querySelectorAll('.typewriter-line');
    const page4ActionContainer = document.getElementById('page4-actions');
    const page4NextBtn = document.getElementById('page4-next-btn');
    const emotionalHeart = document.getElementById('emotional-heart');

    // Page 5 Elements
    const cakeContainer = document.getElementById('birthday-cake');
    const makeWishBtn = document.getElementById('make-wish-btn');
    const candleFlames = document.querySelectorAll('.candle-flame');
    const candleSmokes = document.querySelectorAll('.candle-smoke');
    const wishRevealBox = document.getElementById('wish-reveal-box');
    const popMoreBtn = document.getElementById('pop-more-btn');
    const restartBtn = document.getElementById('restart-btn');

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    function init() {
        renderMemoriesGrid();
        setupEventListeners();
        updateProgress(1);
        spawnBackgroundStars();
        
        // Setup initial side poppers
        setupSidePoppers();
    }

    /* ==========================================================================
       PAGE NAVIGATION & TRANSITIONS
       ========================================================================== */
    function goToPage(targetPage, customDelay = 0) {
        if (state.isTransitioning || targetPage === state.currentPage || targetPage < 1 || targetPage > state.maxPages) {
            return;
        }

        state.isTransitioning = true;
        const currentPageEl = document.getElementById(`page-${state.currentPage}`);
        const targetPageEl = document.getElementById(`page-${targetPage}`);

        setTimeout(() => {
            // Trigger sound whoosh
            try {
                if (window.sound) window.sound.playWhoosh();
            } catch (e) {
                console.warn(e);
            }

            // Reset scroll on target page and activate it immediately so no blank gap occurs
            if (targetPageEl) {
                targetPageEl.scrollTop = 0;
                targetPageEl.classList.remove('exiting');
                targetPageEl.classList.add('active');
            }

            // Smoothly exit current page
            if (currentPageEl && currentPageEl !== targetPageEl) {
                currentPageEl.classList.remove('active');
                currentPageEl.classList.add('exiting');
            }

            state.currentPage = targetPage;
            updateProgress(targetPage);

            // Page entry hooks
            try {
                onPageEnter(targetPage);
            } catch (err) {
                console.error("Error in onPageEnter:", err);
            }

            // Cleanup exiting state after animation duration
            setTimeout(() => {
                if (currentPageEl && currentPageEl !== targetPageEl) {
                    currentPageEl.classList.remove('exiting');
                }
                state.isTransitioning = false;
            }, 550);
        }, customDelay);
    }

    function updateProgress(page) {
        if (progressText) {
            progressText.textContent = `✦ ${page} / ${state.maxPages} ✦`;
        }
    }

    function onPageEnter(page) {
        switch (page) {
            case 2:
                // Huge confetti explosion (Gold + Pink + Orange)
                try {
                    if (window.popperEngine) {
                        window.popperEngine.launch({ page: 2, origin: 'both', count: 110 });
                        setTimeout(() => window.popperEngine.launch({ page: 2, origin: 'bottom-corners', count: 80 }), 300);
                    }
                } catch (e) { console.warn(e); }
                generateBalloons();
                break;

            case 3:
                // Gentle cyan + lavender burst
                try {
                    if (window.popperEngine) {
                        window.popperEngine.launch({ page: 3, origin: 'both', count: 70 });
                    }
                } catch (e) { console.warn(e); }
                break;

            case 4:
                // Emotional page animation sequence
                startEmotionalSequence();
                break;

            case 5:
                // Grand Finale: Fireworks + Rainbow popper explosion!
                try {
                    if (window.fireworks) {
                        window.fireworks.start();
                    }
                } catch (e) { console.warn(e); }
                try {
                    if (window.popperEngine) {
                        window.popperEngine.launch({ page: 5, origin: 'all', count: 140 });
                        setTimeout(() => window.popperEngine.launch({ page: 5, origin: 'center', count: 100 }), 400);
                    }
                } catch (e) { console.warn(e); }
                try {
                    if (window.sound) {
                        window.sound.playFanfare();
                    }
                } catch (e) { console.warn(e); }
                break;
        }

        // Stop fireworks if leaving page 5
        if (page !== 5 && window.fireworks) {
            try {
                window.fireworks.stop();
            } catch (e) { console.warn(e); }
        }
    }

    /* ==========================================================================
       PAGE 1: THE MYSTERIOUS ENTRANCE
       ========================================================================== */
    function openGiftBox() {
        if (giftBox.classList.contains('opened')) return;

        giftBox.classList.add('opened');
        openSurpriseBtn.disabled = true;
        openSurpriseBtn.style.opacity = '0.5';

        // Play gift opening chime & pop
        try {
            if (window.sound) {
                window.sound.playGiftOpen();
            }
        } catch (e) { console.warn(e); }

        // Fire Pink + Purple poppers from both sides
        try {
            if (window.popperEngine) {
                window.popperEngine.launch({ page: 1, origin: 'both', count: 100 });
                setTimeout(() => window.popperEngine.launch({ page: 1, origin: 'center', count: 80 }), 250);
            }
        } catch (e) { console.warn(e); }

        // Soft screen flash
        if (flashOverlay) {
            flashOverlay.classList.add('active');
            setTimeout(() => {
                flashOverlay.classList.remove('active');
            }, 500);
        }

        // Transition smoothly to Page 2 after reveal animation
        setTimeout(() => {
            goToPage(2);
        }, 750);
    }

    /* ==========================================================================
       PAGE 2: THE BIG BIRTHDAY REVEAL
       ========================================================================== */
    function generateBalloons() {
        if (!balloonsContainer) return;
        balloonsContainer.innerHTML = '';
        const colors = [
            'linear-gradient(135deg, #ff758f, #ff4d6d)',
            'linear-gradient(135deg, #ffd166, #ffb703)',
            'linear-gradient(135deg, #c77dff, #9d4edd)',
            'linear-gradient(135deg, #ffb3c6, #fb6f92)',
            'linear-gradient(135deg, #a0c4ff, #70a6ff)',
            'linear-gradient(135deg, #ffcbf2, #f72585)'
        ];

        for (let i = 0; i < 14; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'floating-balloon';
            balloon.style.left = `${Math.random() * 92 + 4}%`;
            balloon.style.background = colors[i % colors.length];
            balloon.style.animationDuration = `${8 + Math.random() * 7}s`;
            balloon.style.animationDelay = `${Math.random() * 4}s`;
            balloon.style.transform = `scale(${0.7 + Math.random() * 0.6})`;

            balloonsContainer.appendChild(balloon);
        }
    }

    /* ==========================================================================
       PAGE 3: OUR COLLEGE MEMORIES & SCRAPBOOK
       ========================================================================== */
    function renderMemoriesGrid() {
        if (!memoriesGrid) return;
        memoriesGrid.innerHTML = '';

        const data = window.MEMORIES_DATA || [];
        data.forEach((mem, idx) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = idx;
            
            // Subtle rotation tilt for scrapbook look
            const rot = (idx % 2 === 0 ? 1 : -1) * (1.5 + (idx * 0.8) % 3);
            card.style.setProperty('--card-rot', `${rot}deg`);

            card.innerHTML = `
                <div class="polaroid-frame">
                    <div class="tape-sticker"></div>
                    <div class="polaroid-photo-wrapper">
                        <!-- REPLACE PHOTO: Change src in js/memories-data.js -->
                        <img src="${mem.image}" alt="${mem.title}" class="polaroid-img" loading="lazy">
                        <div class="photo-glow-tint" style="--tint-color: ${mem.color}"></div>
                    </div>
                    <div class="polaroid-meta">
                        <h4 class="polaroid-title">${mem.title}</h4>
                        <p class="polaroid-caption">${mem.caption}</p>
                    </div>
                </div>
            `;

            // 3D Card Tilt Interaction on mouse move
            card.addEventListener('mousemove', (e) => handleCardTilt(e, card));
            card.addEventListener('mouseleave', () => resetCardTilt(card));

            // Click to open modal
            card.addEventListener('click', () => openMemoryModal(idx));

            memoriesGrid.appendChild(card);
        });
    }

    function handleCardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;
    }

    function resetCardTilt(card) {
        card.style.transform = '';
    }

    function openMemoryModal(index) {
        const data = window.MEMORIES_DATA || [];
        if (!data[index]) return;

        state.currentModalMemoryIndex = index;
        const item = data[index];

        modalImage.src = item.image;
        modalTitle.textContent = item.title;
        modalTag.textContent = item.tag;
        modalStory.textContent = item.story;
        modalQuote.textContent = item.quote;

        memoryModal.classList.add('active');
        if (window.sound) window.sound.playSparkle();
    }

    function closeMemoryModal() {
        memoryModal.classList.remove('active');
    }

    function showNextModalMemory(step = 1) {
        const data = window.MEMORIES_DATA || [];
        state.currentModalMemoryIndex = (state.currentModalMemoryIndex + step + data.length) % data.length;
        openMemoryModal(state.currentModalMemoryIndex);
    }

    function triggerModalReaction() {
        if (window.sound) window.sound.playSparkle();
        createFloatingHearts(modalReactBtn);
    }

    function createFloatingHearts(anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        const colors = ['#f472b6', '#c084fc', '#fb7185', '#ffd166'];
        
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-reaction-heart';
            heart.innerHTML = '💜';
            heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
            heart.style.top = `${rect.top}px`;
            heart.style.fontSize = `${16 + Math.random() * 16}px`;
            heart.style.setProperty('--dx', `${(Math.random() * 80 - 40)}px`);
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 1200);
        }
    }

    /* ==========================================================================
       PAGE 4: THE EMOTIONAL MESSAGE
       ========================================================================== */
    function startEmotionalSequence() {
        // Reset lines
        page4Lines.forEach(line => line.classList.remove('revealed'));
        if (page4ActionContainer) page4ActionContainer.classList.remove('revealed');

        let delay = 600;
        page4Lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('revealed');
                if (window.sound && index % 2 === 0) {
                    window.sound.playSparkle();
                }
            }, delay);
            delay += 1100;
        });

        // Reveal final prompt & button after all lines
        setTimeout(() => {
            if (page4ActionContainer) page4ActionContainer.classList.add('revealed');
        }, delay + 400);
    }

    function proceedToGrandFinale() {
        // Dramatic suspense: screen goes pitch black for ~1 second
        const blackout = document.getElementById('cinematic-blackout');
        if (blackout) {
            blackout.classList.add('active');
        }

        setTimeout(() => {
            if (blackout) blackout.classList.remove('active');
            goToPage(5);
        }, 1100);
    }

    /* ==========================================================================
       PAGE 5: THE GRAND FINALE & BIRTHDAY CAKE WISH
       ========================================================================== */
    function makeAWish() {
        if (state.wishMade) return;
        state.wishMade = true;

        makeWishBtn.disabled = true;
        makeWishBtn.classList.add('hidden');

        // Play gentle breath blow + chime
        if (window.sound) {
            window.sound.playBlowCandle();
        }

        // Extinguish candle flames with gentle smoke
        candleFlames.forEach(flame => flame.classList.add('extinguished'));
        candleSmokes.forEach(smoke => smoke.classList.add('active'));

        // Dim background slightly for intimate wish moment
        const dimOverlay = document.getElementById('dim-wish-overlay');
        if (dimOverlay) dimOverlay.classList.add('active');

        // After 1 second: Wish granted burst!
        setTimeout(() => {
            if (window.sound) {
                window.sound.playWishChime();
            }

            // Launch huge fireworks and rainbow confetti
            if (window.popperEngine) {
                window.popperEngine.launch({ page: 5, origin: 'all', count: 180 });
                setTimeout(() => window.popperEngine.launch({ page: 5, origin: 'center', count: 120 }), 350);
            }

            if (window.fireworks) {
                window.fireworks.launch(window.innerWidth * 0.35, window.innerHeight * 0.25);
                window.fireworks.launch(window.innerWidth * 0.65, window.innerHeight * 0.25);
            }

            // Reveal wish message box
            if (wishRevealBox) {
                wishRevealBox.classList.add('revealed');
            }

            if (dimOverlay) dimOverlay.classList.remove('active');
        }, 1200);
    }

    function restartSurprise() {
        state.wishMade = false;
        if (makeWishBtn) {
            makeWishBtn.disabled = false;
            makeWishBtn.classList.remove('hidden');
        }
        candleFlames.forEach(flame => flame.classList.remove('extinguished'));
        candleSmokes.forEach(smoke => smoke.classList.remove('active'));
        if (wishRevealBox) wishRevealBox.classList.remove('revealed');

        if (giftBox) {
            giftBox.classList.remove('opened');
            openSurpriseBtn.disabled = false;
            openSurpriseBtn.style.opacity = '1';
        }

        const cards = document.querySelectorAll('.memory-card');
        cards.forEach((card) => {
            card.style.transition = '';
            card.style.transform = '';
            card.style.opacity = '1';
        });

        goToPage(1);
    }

    /* ==========================================================================
       BACKGROUND STARS
       ========================================================================== */
    function spawnBackgroundStars() {
        const starContainer = document.getElementById('stars-container');
        if (!starContainer) return;

        const count = 75;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.animationDuration = `${2 + Math.random() * 4}s`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
            starContainer.appendChild(star);
        }
    }

    /* ==========================================================================
       SIDE POPPERS INTERACTION
       ========================================================================== */
    function setupSidePoppers() {
        if (leftPopperTrigger) {
            leftPopperTrigger.addEventListener('click', () => {
                if (window.popperEngine) {
                    window.popperEngine.launch({ page: state.currentPage, origin: 'left', count: 70 });
                }
            });
        }
        if (rightPopperTrigger) {
            rightPopperTrigger.addEventListener('click', () => {
                if (window.popperEngine) {
                    window.popperEngine.launch({ page: state.currentPage, origin: 'right', count: 70 });
                }
            });
        }
    }

    /* ==========================================================================
       SOUND CONTROLS
       ========================================================================== */
    function handleSoundToggle() {
        if (!state.soundInitialized) {
            if (window.sound) {
                window.sound.init();
                window.sound.toggleMusic(true);
            }
            state.soundInitialized = true;
            updateSoundUI(true);
            return;
        }

        if (window.sound) {
            const isMuted = window.sound.toggleMute();
            updateSoundUI(!isMuted);
        }
    }

    function updateSoundUI(isOn) {
        if (soundIcon) soundIcon.textContent = isOn ? '🔊' : '🔇';
        if (soundLabel) soundLabel.textContent = isOn ? 'Music: ON' : 'Music: OFF';
        if (soundToggleBtn) soundToggleBtn.classList.toggle('active', isOn);
    }

    /* ==========================================================================
       EVENT LISTENERS BINDING
       ========================================================================== */
    function setupEventListeners() {
        // Page 1
        if (openSurpriseBtn) openSurpriseBtn.addEventListener('click', openGiftBox);
        if (giftBox) giftBox.addEventListener('click', openGiftBox);

        // Page 2
        if (page2NextBtn) page2NextBtn.addEventListener('click', () => {
            if (window.popperEngine) {
                window.popperEngine.launch({ page: 2, origin: 'both', count: 80 });
            }
            goToPage(3);
        });

        // Page 3
        if (page3NextBtn) page3NextBtn.addEventListener('click', () => {
            // Animate memory cards flying outward
            const cards = document.querySelectorAll('.memory-card');
            cards.forEach((card, idx) => {
                card.style.transition = 'transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.5s ease';
                const dirX = idx % 2 === 0 ? -120 : 120;
                card.style.transform = `translate(${dirX}vw, -60px) rotate(${dirX}deg) scale(0.4)`;
                card.style.opacity = '0';
            });

            if (window.popperEngine) {
                window.popperEngine.launch({ page: 3, origin: 'both', count: 90 });
            }

            setTimeout(() => {
                goToPage(4);
            }, 600);
        });

        // Memory Modal
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMemoryModal);
        if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => showNextModalMemory(-1));
        if (modalNextBtn) modalNextBtn.addEventListener('click', () => showNextModalMemory(1));
        if (modalReactBtn) modalReactBtn.addEventListener('click', triggerModalReaction);
        if (memoryModal) {
            memoryModal.addEventListener('click', (e) => {
                if (e.target === memoryModal) closeMemoryModal();
            });
        }

        // Page 4
        if (page4NextBtn) page4NextBtn.addEventListener('click', proceedToGrandFinale);
        if (emotionalHeart) {
            emotionalHeart.addEventListener('click', () => {
                if (window.sound) window.sound.playSparkle();
                createFloatingHearts(emotionalHeart);
            });
        }

        // Page 5
        if (makeWishBtn) makeWishBtn.addEventListener('click', makeAWish);
        if (popMoreBtn) popMoreBtn.addEventListener('click', () => {
            if (window.popperEngine) {
                window.popperEngine.launch({ page: 5, origin: 'both', count: 120 });
            }
            if (window.fireworks) {
                window.fireworks.launch(window.innerWidth * Math.random(), window.innerHeight * 0.3);
            }
        });
        if (restartBtn) restartBtn.addEventListener('click', restartSurprise);

        // Interactive click fireworks on Page 5
        const page5El = document.getElementById('page-5');
        if (page5El) {
            page5El.addEventListener('click', (e) => {
                // Ignore button clicks
                if (e.target.closest('button') || e.target.closest('.modal-content')) return;
                if (window.fireworks && window.fireworks.isRunning) {
                    window.fireworks.launch(e.clientX, e.clientY);
                }
            });
        }

        // Sound Toggle
        if (soundToggleBtn) soundToggleBtn.addEventListener('click', handleSoundToggle);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                if (state.currentPage === 1 && !giftBox.classList.contains('opened')) {
                    openGiftBox();
                } else if (state.currentPage === 4 && page4ActionContainer.classList.contains('revealed')) {
                    proceedToGrandFinale();
                } else if (state.currentPage === 5 && !state.wishMade) {
                    makeAWish();
                } else if (state.currentPage < state.maxPages && state.currentPage !== 1 && state.currentPage !== 4) {
                    goToPage(state.currentPage + 1);
                }
            } else if (e.key === 'ArrowLeft' && state.currentPage > 1) {
                goToPage(state.currentPage - 1);
            } else if (e.key === 'Escape' && memoryModal.classList.contains('active')) {
                closeMemoryModal();
            }
        });

        // First user gesture initializes audio context smoothly
        const firstGestureHandler = () => {
            if (!state.soundInitialized && window.sound) {
                window.sound.init();
            }
            window.removeEventListener('click', firstGestureHandler);
            window.removeEventListener('touchstart', firstGestureHandler);
        };
        window.addEventListener('click', firstGestureHandler, { once: true });
        window.addEventListener('touchstart', firstGestureHandler, { once: true });
    }

    // Start App
    init();
});
