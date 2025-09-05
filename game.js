// Brain Battle Game Logic
class BrainBattleGame {
    constructor() {
        this.gameState = {
            brainHealth: 0,
            currentTurn: 'thinking-traps',
            gameStarted: false,
            timeRemaining: 600, // 10 minutes in seconds
            timer: null,
            lastMove: null
        };
        
        // Sound system
        this.soundEnabled = true;
        this.sounds = {};
        this.initializeSounds();
        
        // Carousel state for hands
        this.carouselState = {
            thinkingTraps: { currentIndex: 0, visibleCards: 1 },
            alternativeThoughts: { currentIndex: 0, visibleCards: 1 }
        };
        
        this.initializeCards();
        this.initializeTrickyTechCards();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    // Initialize all cards with their properties
    initializeCards() {
        this.thinkingTrapsCards = [
            {
                name: 'All-or-Nothing',
                hp: 70,
                type: 'thinking-trap',
                imagePath: 'images/all-or-nothing.png', // Backend configurable
                description: 'All-or-Nothing makes you think in extremes. It\'s like saying "I always mess up my homework" or "Nobody likes my posts online."',
                moves: [
                    { name: 'Black-and-White', damage: -30, description: 'Makes you see things as all good or all bad, with no middle ground.' },
                    { name: 'Never/Always Blast', damage: -50, description: 'Uses words like "never" or "always" to make problems seem bigger.' }
                ]
            },
            {
                name: 'Labeler',
                hp: 70,
                type: 'thinking-trap',
                imagePath: 'images/labeler.png', // Backend configurable
                description: 'Labeler makes you put mean names on yourself. Instead of saying "I lost this game level," you might think "I\'m a terrible gamer."',
                moves: [
                    { name: 'Bad Name Tag', damage: -25, description: 'Puts a mean label on yourself, instead of just on your mistake.' },
                    { name: 'Failure Flurry', damage: -45, description: 'Makes you think one bad grade means you\'re bad at everything.' }
                ]
            },
            {
                name: 'Mind Reader',
                hp: 65,
                type: 'thinking-trap',
                imagePath: 'images/mind-reader.png', // Backend configurable
                description: 'Mind Reader makes you think you know what others are thinking, even though you haven\'t asked. If your friend doesn\'t respond to your message right away, you might think "They don\'t want to be my friend anymore."',
                moves: [
                    { name: 'Friend Guesser', damage: -30, description: 'Makes you think you know why your friend isn\'t talking to you.' },
                    { name: 'Thought Reader', damage: -40, description: 'Assumes others are thinking bad things about you.' }
                ]
            },
            {
                name: 'Negative Filter',
                hp: 75,
                type: 'thinking-trap',
                imagePath: 'images/negative-filter.png', // Backend configurable
                description: 'Negative Filter only lets you see the bad stuff. It\'s like wearing sunglasses that block out all the good things that happen.',
                moves: [
                    { name: 'Good Stuff Eraser', damage: -25, description: 'Makes all the nice comments disappear from your mind.' },
                    { name: 'Bad Comment Focus', damage: -45, description: 'Zooms in on one mean comment and ignores 10 nice ones.' }
                ]
            },
            {
                name: 'Should Monster',
                hp: 65,
                type: 'thinking-trap',
                imagePath: 'images/should-monster.png', // Backend configurable
                description: 'Should Monster makes too many rules about how things "should" be. It says things like "I should win every game I play" or "I should get more followers than my friends."',
                moves: [
                    { name: 'Should-a, Would-a, Could-a', damage: -35, description: 'Drops "should" and "shouldn\'t" words that make you feel bad.' },
                    { name: 'Perfect Student', damage: -50, description: 'Makes you think you should never make mistakes on homework.' }
                ]
            },
            {
                name: 'Personalizer',
                hp: 60,
                type: 'thinking-trap',
                imagePath: 'images/personalizer.png', // Backend configurable
                description: 'Personalizer makes you think everything is about you or your fault. If your group chat gets quiet, you might think "They stopped talking because of something I said," when maybe everyone just got busy.',
                moves: [
                    { name: '\'My Fault\' Magnet', damage: -30, description: 'Pulls blame toward you for things you didn\'t do.' },
                    { name: 'Mood Blamer', damage: -40, description: 'Makes you think your friend\'s bad mood is because of you.' }
                ]
            },
            {
                name: 'Fortune Teller',
                hp: 70,
                type: 'thinking-trap',
                imagePath: 'images/fortune-teller.png', // Backend configurable
                description: 'Fortune Teller makes you think you can see the future—but only bad futures! If you make a mistake while recording a video, you think "Everyone will laugh at me" instead of "I can just edit that or try again."',
                moves: [
                    { name: 'Test Disaster', damage: -35, description: 'Makes you sure that you\'ll fail tomorrow\'s test.' },
                    { name: 'Future Fail', damage: -55, description: 'Convinces you that bad things will definitely happen at school.' }
                ]
            }
        ];

        this.alternativeThoughtsCards = [
            {
                name: 'Middle Path Finder',
                hp: 90,
                type: 'alternative-thought',
                imagePath: 'images/middle-path-finder.png', // Backend configurable
                description: 'Middle Path Finder helps you see the in-between spaces. When you get some likes on your art but not as many as you hoped, it reminds you "Some people liked it, and I can keep improving."',
                moves: [
                    { name: 'Gray Area Reveal', damage: 45, description: 'Shows that most things aren\'t all bad or all good.' },
                    { name: '\'Sometimes\' Shield', damage: 65, description: 'Replaces "always" and "never" with "sometimes" to see new pathways.' }
                ],
                counter: 'All-or-Nothing'
            },
            {
                name: 'Growth Mindset',
                hp: 85,
                type: 'alternative-thought',
                imagePath: 'images/growth-mindset.png', // Backend configurable
                description: 'Growth Mindset transforms negative labels into opportunities. Instead of saying "I\'m bad at making videos," it helps you think "I\'m still learning."',
                moves: [
                    { name: 'Second Chance', damage: 50, description: 'Turns mistakes into chances to learn and grow.' },
                    { name: 'More Than Mistakes', damage: 70, description: 'Reminds you that you just might not be good at something YET.' }
                ],
                counter: 'Labeler'
            },
            {
                name: 'Fact Checker',
                hp: 85,
                type: 'alternative-thought',
                imagePath: 'images/fact-checker.png', // Backend configurable
                description: 'Fact Checker stops mind reading in its tracks! When your friend doesn\'t respond to your message right away, it helps you think of all the things they might be doing, instead of assuming they\'re mad at you.',
                moves: [
                    { name: 'Curious Question', damage: 45, description: 'Asks what\'s really happening instead of jumping to conclusions.' },
                    { name: 'Evidence Collection', damage: 65, description: 'Gathers facts before deciding what others are thinking.' }
                ],
                counter: 'Mind Reader'
            },
            {
                name: 'Balanced Viewer',
                hp: 90,
                type: 'alternative-thought',
                imagePath: 'images/balanced-viewer.png', // Backend configurable
                description: 'Balanced Viewer helps you see the bigger picture. When someone leaves a critical comment on your video that got 50 likes, it reminds you to notice both the feedback and the 50 people who enjoyed your work.',
                moves: [
                    { name: 'Full Picture', damage: 45, description: 'Helps you see both the good and challenging parts of a situation.' },
                    { name: 'Positive Spotlight', damage: 70, description: 'Shines light on the good things that negative filters try to hide.' }
                ],
                counter: 'Negative Filter'
            },
            {
                name: 'Flexible Thinker',
                hp: 95,
                type: 'alternative-thought',
                imagePath: 'images/flexible-thinker.png', // Backend configurable
                description: 'Flexible Thinker transforms inflexible rules into helpful guidelines. Instead of "I should win every game," it suggests "I\'d like to improve at this."',
                moves: [
                    { name: 'Preference Shift', damage: 55, description: 'Changes rigid "shoulds" into gentler preferences and goals.' },
                    { name: 'Effort Champion', damage: 75, description: 'Celebrates trying hard and making progress instead of "perfection."' }
                ],
                counter: 'Should Monster'
            },
            {
                name: 'Reality Checker',
                hp: 80,
                type: 'alternative-thought',
                imagePath: 'images/reality-checker.png', // Backend configurable
                description: 'Reality Checker helps you see that not everything is about you. When your group chat goes quiet, it reminds you "Everyone might be busy with other things," that most situations involve many factors beyond just you.',
                moves: [
                    { name: 'Other Explanations', damage: 50, description: 'Finds different reasons why things might be happening.' },
                    { name: 'Not About Me', damage: 65, description: 'Reminds you that most things aren\'t personal or about you at all.' }
                ],
                counter: 'Personalizer'
            },
            {
                name: 'Possibility Explorer',
                hp: 100,
                type: 'alternative-thought',
                imagePath: 'images/possibility-explorer.png', // Backend configurable
                description: 'Possibility Explorer reveals that the future isn\'t set in stone. When you make a mistake in your video, it helps you think "Maybe viewers will still enjoy it," and that good outcomes are just as possible as difficult ones.',
                moves: [
                    { name: 'Maybe Maker', damage: 60, description: 'Replaces \'definitely will happen\' with \'maybe\' to open up new possibilities.' },
                    { name: 'Future Path', damage: 80, description: 'Discovers multiple possible futures instead of just one negative one.' }
                ],
                counter: 'Fortune Teller'
            }
        ];

        this.eventCards = {
            'thinking-traps': [
                { 
                    name: 'Social Media Storm', 
                    imagePath: 'images/social-media-storm.png', // Backend configurable
                    effect: -25, 
                    description: 'Be careful! This card can activate automatically when you spend too much time on devices or social media without breaks. If you notice Thinking Traps getting stronger while online, it might be time to take a break.',
                    specialEffect: 'All Thinking Traps gain 25 HP and their moves do double damage for 2 turns. Reduces all active Alternative Thought cards\' HP by 15.'
                },
                { 
                    name: 'Distraction Overload', 
                    imagePath: 'images/distraction-overload.png', // Backend configurable
                    effect: -30, 
                    description: 'This can happen when you have too many tabs open, keep checking different apps, or try to do homework while watching videos. If you notice your thoughts getting jumbled, try focusing on just one thing at a time.',
                    specialEffect: 'All Alternative Thoughts lose 20 HP and their healing is reduced by half for 2 turns. Prevents one opponent card from making moves for 1 turn.'
                }
            ],
            'alternative-thoughts': [
                { 
                    name: 'Rest & Recharge', 
                    imagePath: 'images/rest-and-recharge.png', // Backend configurable
                    effect: 25, 
                    description: 'Play this card when you notice you\'re feeling overwhelmed or tired. Take a short break, get some rest, or do something relaxing before returning to the situation.',
                    specialEffect: 'When played, reduces the power of all Thinking Traps by 20 HP for 3 turns. Alternative Thoughts gain 10 HP. Also restores 20 HP to one of your active cards.'
                },
                { 
                    name: 'Friend Support', 
                    imagePath: 'images/friend-support.png', // Backend configurable
                    effect: 30, 
                    description: 'Play this card when you find yourself stuck in a Thinking Trap. Reach out to a friend, parent, teacher, or counselor and tell them what you\'re thinking and feeling.',
                    specialEffect: 'When played, you can defeat one active Thinking Trap immediately OR protect one of your cards from opposing team moves for 1 turn. Also boost one Alternative Thought by 30 HP.'
                }
            ]
        };

        // Initialize hands and game areas
        this.thinkingTrapsHand = [...this.thinkingTrapsCards];
        this.alternativeThoughtsHand = [...this.alternativeThoughtsCards];
        this.battleZone = []; // Single battle zone for all cards
        this.thinkingTrapsActive = null;
        this.alternativeThoughtsActive = null;
        this.thinkingTrapsEventCards = [...this.eventCards['thinking-traps']];
        this.alternativeThoughtsEventCards = [...this.eventCards['alternative-thoughts']];
        
        console.log('Event cards initialized:', {
            thinkingTraps: this.thinkingTrapsEventCards.length,
            alternativeThoughts: this.alternativeThoughtsEventCards.length
        });
        this.removedCards = []; // Track removed cards
        
        // Create references to original card data for resetting
        this.originalThinkingTrapsCards = [...this.thinkingTrapsCards];
        this.originalAlternativeThoughtsCards = [...this.alternativeThoughtsCards];
        this.originalThinkingTrapsEventCards = [...this.thinkingTrapsEventCards];
        this.originalAlternativeThoughtsEventCards = [...this.alternativeThoughtsEventCards];
    }

    // Initialize Tricky Tech cards
    initializeTrickyTechCards() {
        // Design Trick cards (equivalent to Thinking Traps)
        this.designTrickCards = [
            {
                name: 'Infinite Scroller',
                imagePath: 'images/tricky-tech/infinity-scroller.png',
                hp: 75,
                moves: [
                    { name: 'Bottomless Feed', damage: -35, description: 'Makes you keep scrolling through content without noticing time passing.' },
                    { name: 'Just One More', damage: -55, description: 'Convinces you to keep watching way past bedtime.' }
                ],
                description: 'Infinite Scroller is a design trick that removes natural stopping points from your online experience. When you finish reading one post, another automatically appears, and then another, and another.',
                usedMoves: []
            },
            {
                name: 'Notifier',
                imagePath: 'images/tricky-tech/notifier.png',
                hp: 65,
                moves: [
                    { name: 'Red Alert', damage: -30, description: 'Uses bright colors and numbers to make you check your phone quickly.' },
                    { name: 'FOMO Blast', damage: -45, description: 'Creates fear of missing out if you don\'t check notifications right away.' }
                ],
                description: 'Notifier bombards you with notifications designed to grab your attention. Those little red dots, numbers, and sounds are specifically designed to make your brain worry that you\'re missing something important.',
                usedMoves: []
            },
            {
                name: 'Autoplayer',
                imagePath: 'images/tricky-tech/autoplayer.png',
                hp: 70,
                moves: [
                    { name: 'Next Episode', damage: -40, description: 'Automatically plays the next video or episode before you can decide to stop.' },
                    { name: 'Recommendation Rabbit Hole', damage: -50, description: 'Pulls you into watching related content for hours.' }
                ],
                description: 'Autoplayer takes away your chance to decide if you want to keep watching. When one video ends, the next one starts automatically. Your brain doesn\'t get time to consider "Is there something better I could be doing?"',
                usedMoves: []
            },
            {
                name: 'Engagementer',
                imagePath: 'images/tricky-tech/engagementer.png',
                hp: 80,
                moves: [
                    { name: 'Like Checker', damage: -35, description: 'Makes you check constantly to see how many likes you\'ve got.' },
                    { name: 'Fire Streak', damage: -60, description: 'Forces you to open the app daily to maintain your streak, even when busy.' }
                ],
                description: 'Engagementer uses rewards to keep you coming back to apps and platforms. It turns social interactions into a game with points, likes, and streaks that your brain starts to crave.',
                usedMoves: []
            }
        ];

        // Healthy Habit cards (equivalent to Alternative Thoughts)
        this.healthyHabitCards = [
            {
                name: 'Touch Grass',
                imagePath: 'images/tricky-tech/touch-grass.png',
                hp: 95,
                moves: [
                    { name: 'Reality Check', damage: 50, description: 'Reminds you there\'s a whole world outside your screen.' },
                    { name: 'Nature Reset', damage: 75, description: 'Uses time outdoors to reset your brain\'s attention.' }
                ],
                description: 'Touch Grass helps you reconnect with the physical world around you. When you\'re caught in an infinite scroll or notification loop, it reminds you to put down your device and spend time outside.',
                usedMoves: []
            },
            {
                name: 'Time Limiter',
                imagePath: 'images/tricky-tech/time-limiter.png',
                hp: 85,
                moves: [
                    { name: 'Screen Time Alert', damage: 45, description: 'Reminds you exactly how much time you\'re spending on different apps.' },
                    { name: 'App Settings', damage: 65, description: 'Sets healthy time limits on apps.' }
                ],
                description: 'Time Limiter helps you create healthy boundaries with tech. It uses tools already built into your device to show how much time you spend on apps, and can even lock apps after a set amount of time.',
                usedMoves: []
            },
            {
                name: 'Silencer',
                imagePath: 'images/tricky-tech/silencer.png',
                hp: 90,
                moves: [
                    { name: 'Do Not Disturb', damage: 55, description: 'Blocks notifications during important activities like homework or sleep.' },
                    { name: 'Push Away Notifications', damage: 70, description: 'Turns off non-essential alerts to prevent constant interruptions.' }
                ],
                description: 'Silencer protects your focus and attention by controlling when and how apps can interrupt you. It helps you turn off notifications during homework time, family meals, or bedtime.',
                usedMoves: []
            },
            {
                name: 'Mindful Moment',
                imagePath: 'images/tricky-tech/mindful-moment.png',
                hp: 100,
                moves: [
                    { name: 'Attention Anchor', damage: 60, description: 'Brings your focus back to the present moment.' },
                    { name: 'Purpose Pause', damage: 80, description: 'Helps you pause and ask "Why am I using this app right now?"' }
                ],
                description: 'Mindful Moment teaches you to notice when you\'re reaching for your device, and why. When you feel the urge to check social media, it helps you pause and ask, "Am I bored? Anxious? Avoiding something?"',
                usedMoves: []
            }
        ];

        // Tricky Tech Event Cards
        this.trickyTechEventCards = {
            'design-tricks': [
                { 
                    name: 'Late Night Scroll', 
                    imagePath: 'images/tricky-tech/late-night-scroll.png',
                    effect: -25, 
                    description: 'This card can activate automatically when you use devices within an hour of bedtime. It gets stronger the later it gets. Creating a "device curfew" for yourself can prevent this card from activating.',
                    specialEffect: 'All Design Trick cards gain 30 HP and their moves do double damage for 2 turns. Healthy Habit cards lose 20 HP and their healing is reduced by half.'
                },
                { 
                    name: 'Mini-Game Distractor', 
                    imagePath: 'images/tricky-tech/mini-game-distractor.png',
                    effect: -15, 
                    description: 'This card activates when you open an app for one purpose but get distracted by its games, quizzes, or interactive features. Being aware of this trick can help you notice when it\'s happening and return to your original task.',
                    specialEffect: 'Select one Healthy Habit card currently in play and block it from performing moves for 2 turns. Brain Health decreases by 15 points immediately.'
                }
            ],
            'healthy-habits': [
                { 
                    name: 'Flow Hobby', 
                    imagePath: 'images/tricky-tech/flow-hobby.png',
                    effect: 40, 
                    description: 'Play this card by dedicating regular time to activities you enjoy that don\'t involve screens. Having a variety of hobbies gives you powerful alternatives when you feel the urge to mindlessly scroll.',
                    specialEffect: 'All Healthy Habit cards gain 40 HP and their healing effects double for 3 turns. All Design Trick cards lose 15 HP immediately.'
                },
                { 
                    name: 'Phone Policy', 
                    imagePath: 'images/tricky-tech/phone-policy.png',
                    effect: 30, 
                    description: 'Play this card by establishing clear boundaries for technology use. Examples include "no phones during meals," "devices charge overnight outside the bedroom," or "social media only after homework is complete."',
                    specialEffect: 'Choose one Design Trick card and remove it from play for two turns. Healthy Habit cards get +10 HP for the remainder of the game.'
                }
            ]
        };

        // Initialize hands for Tricky Tech
        this.designTrickHand = [...this.designTrickCards];
        this.healthyHabitHand = [...this.healthyHabitCards];
        this.designTrickEventCards = [...this.trickyTechEventCards['design-tricks']];
        this.healthyHabitEventCards = [...this.trickyTechEventCards['healthy-habits']];

        // Create references to original card data for resetting
        this.originalDesignTrickCards = [...this.designTrickCards];
        this.originalHealthyHabitCards = [...this.healthyHabitCards];
        this.originalDesignTrickEventCards = [...this.designTrickEventCards];
        this.originalHealthyHabitEventCards = [...this.healthyHabitEventCards];
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Menu event listeners
        document.getElementById('playGame').addEventListener('click', () => this.startGameFromMenu());
        document.getElementById('showRulesMenu').addEventListener('click', () => this.showRules());
        document.getElementById('backToMenu').addEventListener('click', () => this.backToMenu());
        
        // Game event listeners
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        
        // Initialize individual hand shuffle buttons
        this.initializeHandShuffleButtons();
        
        // Initialize drag and drop functionality
        this.initializeDragAndDrop();
        
        // Initialize carousel navigation
        this.initializeCarouselNavigation();
        
        // Initialize game mode selection
        this.initializeGameModeSelection();
        
        // Initialize sound toggle
        this.initializeSoundToggle();
        
        // Close modal when clicking outside or on close button
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
    }

    // Initialize custom drag and drop functionality using mouse events
    initializeDragAndDrop() {
        console.log('=== INITIALIZING CUSTOM DRAG AND DROP ===');
        
        // Store drag state
        this.dragState = {
            isDragging: false,
            draggedCard: null,
            dragOffset: { x: 0, y: 0 },
            originalPosition: { x: 0, y: 0 }
        };

        // Add mouse event listeners to document
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        console.log('Custom drag and drop initialized');
    }

    // Handle mouse down - start drag
    handleMouseDown(e) {
        // Check if clicking on a draggable card
        const card = e.target.closest('.card');
        console.log('Mouse down on:', e.target, 'Card found:', card);
        console.log('Card dataset:', card?.dataset);
        
        if (!card || !card.dataset.cardIndex || card.dataset.team === undefined) {
            console.log('Not a draggable card - returning');
            return;
        }

        // Check if it's a draggable card (not active, not event card)
        if (card.classList.contains('active') || card.querySelector('.event-status')) {
            return;
        }

        console.log('=== CUSTOM DRAG START ===');
        console.log('Starting drag for card:', card.dataset);

        // Set drag state
        this.dragState.isDragging = true;
        this.dragState.draggedCard = card;
        
        // Get the card's current position
        const rect = card.getBoundingClientRect();
        
        // Calculate offset from mouse to card position
        this.dragState.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        // Store original position for potential return
        this.dragState.originalPosition = {
            x: rect.left,
            y: rect.top
        };

        // Style the dragged card
        card.style.position = 'fixed';
        card.style.zIndex = '1000';
        card.style.pointerEvents = 'none';
        card.style.transform = 'rotate(5deg)';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        card.style.opacity = '0.8';
        
        // Set initial position to match current position
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';

        // Prevent default to avoid text selection
        e.preventDefault();
    }

    // Handle mouse move - update drag position
    handleMouseMove(e) {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) {
            return;
        }

        // Update card position
        const card = this.dragState.draggedCard;
        card.style.left = (e.clientX - this.dragState.dragOffset.x) + 'px';
        card.style.top = (e.clientY - this.dragState.dragOffset.y) + 'px';

        // Check for drop zones and highlight them
        this.updateDropZoneHighlighting(e);
    }

    // Handle mouse up - end drag
    handleMouseUp(e) {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) {
            return;
        }

        console.log('=== CUSTOM DRAG END ===');

        const card = this.dragState.draggedCard;
        const dropZone = this.getDropZoneAtPosition(e.clientX, e.clientY);
        
        if (dropZone) {
            console.log('Dropped on:', dropZone.id);
            this.handleDrop(card, dropZone);
        } else {
            console.log('Dropped outside drop zone - returning card');
            this.returnCardToOriginalPosition(card);
        }

        // Reset drag state
        this.dragState.isDragging = false;
        this.dragState.draggedCard = null;
        
        // Clear all drop zone highlighting
        this.clearDropZoneHighlighting();
    }

    // Update drop zone highlighting during drag
    updateDropZoneHighlighting(e) {
        const dropZone = this.getDropZoneAtPosition(e.clientX, e.clientY);
        
        // Clear all highlighting first
        this.clearDropZoneHighlighting();
        
        // Highlight the current drop zone
        if (dropZone) {
            dropZone.style.backgroundColor = 'rgba(72, 187, 120, 0.3)';
            dropZone.style.border = '3px dashed #48bb78';
            dropZone.style.transform = 'scale(1.02)';
        }
    }

    // Clear all drop zone highlighting
    clearDropZoneHighlighting() {
        const dropZones = [
            document.getElementById('thinkingTrapsActive'),
            document.getElementById('alternativeThoughtsActive'),
            document.getElementById('battleZone')
        ];
        
        dropZones.forEach(zone => {
            if (zone) {
                zone.style.backgroundColor = '';
                zone.style.border = '';
                zone.style.transform = '';
            }
        });
    }

    // Get drop zone at mouse position
    getDropZoneAtPosition(x, y) {
        const dropZones = [
            document.getElementById('thinkingTrapsActive'),
            document.getElementById('alternativeThoughtsActive'),
            document.getElementById('battleZone')
        ];
        
        for (const zone of dropZones) {
            if (zone) {
                const rect = zone.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    return zone;
                }
            }
        }
        return null;
    }

    // Handle the actual drop
    handleDrop(card, dropZone) {
        const cardIndex = parseInt(card.dataset.cardIndex);
        const team = card.dataset.team;
        const isBattleZone = card.dataset.isBattleZone === 'true';
        
        console.log('Handling drop:', { cardIndex, team, dropZone: dropZone.id, isBattleZone, gameMode: this.selectedGameMode });
        
        // Validate the drop based on game mode
        let isValidDrop = false;
        
        if (this.selectedGameMode === 'tricky-tech') {
            // Tricky Tech mode: design-tricks vs healthy-habits
            isValidDrop = (team === 'design-tricks' && dropZone.id === 'thinkingTrapsActive') ||
                         (team === 'healthy-habits' && dropZone.id === 'alternativeThoughtsActive') ||
                         dropZone.id === 'battleZone';
        } else {
            // Brain Battle mode: thinking-traps vs alternative-thoughts
            isValidDrop = (team === 'thinking-traps' && dropZone.id === 'thinkingTrapsActive') ||
                         (team === 'alternative-thoughts' && dropZone.id === 'alternativeThoughtsActive') ||
                         dropZone.id === 'battleZone';
        }
        
        if (isValidDrop) {
            console.log('✅ Valid drop - playing card');
            if (isBattleZone) {
                // Find the card in battle zone
                const battleZoneCard = this.battleZone[cardIndex];
                if (battleZoneCard) {
                    this.playBattleZoneCard(battleZoneCard, team);
                }
            } else {
                this.playCard(cardIndex, team);
            }
        } else {
            console.log('❌ Invalid drop - returning card');
            this.returnCardToOriginalPosition(card);
        }
    }

    // Return card to original position
    returnCardToOriginalPosition(card) {
        // Reset card styles
        card.style.position = '';
        card.style.zIndex = '';
        card.style.pointerEvents = '';
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.opacity = '';
        card.style.left = '';
        card.style.top = '';
    }


    // Initialize hand shuffle buttons
    initializeHandShuffleButtons() {
        const shuffleThinkingTraps = document.getElementById('shuffleThinkingTraps');
        const shuffleAlternativeThoughts = document.getElementById('shuffleAlternativeThoughts');
        
        if (shuffleThinkingTraps) {
            shuffleThinkingTraps.addEventListener('click', () => this.shuffleOneCard('thinking-traps'));
        }
        
        if (shuffleAlternativeThoughts) {
            shuffleAlternativeThoughts.addEventListener('click', () => this.shuffleOneCard('alternative-thoughts'));
        }
    }

    // Initialize carousel navigation
    initializeCarouselNavigation() {
        // Thinking Traps carousel navigation
        const thinkingTrapsPrev = document.getElementById('thinkingTrapsPrev');
        const thinkingTrapsNext = document.getElementById('thinkingTrapsNext');
        
        if (thinkingTrapsPrev) {
            thinkingTrapsPrev.addEventListener('click', () => this.navigateCarousel('thinkingTraps', 'prev'));
        }
        
        if (thinkingTrapsNext) {
            thinkingTrapsNext.addEventListener('click', () => this.navigateCarousel('thinkingTraps', 'next'));
        }
        
        // Alternative Thoughts carousel navigation
        const alternativeThoughtsPrev = document.getElementById('alternativeThoughtsPrev');
        const alternativeThoughtsNext = document.getElementById('alternativeThoughtsNext');
        
        if (alternativeThoughtsPrev) {
            alternativeThoughtsPrev.addEventListener('click', () => this.navigateCarousel('alternativeThoughts', 'prev'));
        }
        
        if (alternativeThoughtsNext) {
            alternativeThoughtsNext.addEventListener('click', () => this.navigateCarousel('alternativeThoughts', 'next'));
        }
    }

    // Initialize game mode selection
    initializeGameModeSelection() {
        const gameModeCards = document.querySelectorAll('.game-mode-card');
        const menuButtons = document.getElementById('menuButtons');
        
        gameModeCards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                
                // Only allow selection of available modes
                if (!card.classList.contains('coming-soon')) {
                    // Remove active class from all cards
                    gameModeCards.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked card
                    card.classList.add('active');
                    
                    // Show menu buttons
                    if (menuButtons) {
                        menuButtons.style.display = 'flex';
                    }
                    
                    // Update play button text
                    const playButton = document.getElementById('playGame');
                    if (playButton) {
                        switch (mode) {
                            case 'brain-battle':
                                playButton.textContent = '🎮 Play Brain Battle';
                                break;
                            case 'tricky-tech':
                                playButton.textContent = '🎮 Play Tricky Tech';
                                break;
                            case 'brain-battle-ultimate':
                                playButton.textContent = '🎮 Play Brain Battle Ultimate';
                                break;
                        }
                    }
                    
                    // Store selected mode
                    this.selectedGameMode = mode;
                }
            });
        });
        
        // Set default mode and show buttons for Brain Battle
        this.selectedGameMode = 'brain-battle';
        if (menuButtons) {
            menuButtons.style.display = 'flex';
        }
    }

    // Initialize sound system
    initializeSounds() {
        // Create audio contexts for different sound effects
        this.sounds = {
            // Game events
            cardPlay: this.createSound(800, 0.1, 'sine'), // High pitch for card play
            cardAttack: this.createSound(400, 0.2, 'square'), // Medium pitch for attacks
            cardDefeat: this.createSound(200, 0.3, 'sawtooth'), // Low pitch for defeats
            win: this.createSoundSequence([523, 659, 784, 1047], 0.2), // Victory fanfare
            lose: this.createSound(150, 0.5, 'triangle'), // Defeat sound
            
            // UI sounds
            buttonClick: this.createSound(1000, 0.05, 'sine'), // Button click
            modalOpen: this.createSound(600, 0.1, 'sine'), // Modal open
            modalClose: this.createSound(400, 0.1, 'sine'), // Modal close
            turnSwitch: this.createSound(500, 0.1, 'sine'), // Turn switch
            
            // Event card sounds
            eventCard: this.createSound(700, 0.15, 'sine'), // Event card play
            effectApply: this.createSound(900, 0.1, 'sine'), // Effect applied
            
            // Brain health sounds
            brainHealthUp: this.createSound(600, 0.1, 'sine'), // Positive brain health
            brainHealthDown: this.createSound(300, 0.1, 'sine'), // Negative brain health
            
            // Timer sounds
            timerTick: this.createSound(800, 0.05, 'sine'), // Timer tick
            timerWarning: this.createSound(1000, 0.2, 'square'), // Timer warning
            timerEnd: this.createSound(200, 0.5, 'sawtooth') // Timer end
        };
    }

    // Create a simple sound using Web Audio API
    createSound(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = waveType;
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.log('Audio not supported:', error);
            }
        };
    }

    // Create a sequence of sounds (for fanfare)
    createSoundSequence(frequencies, duration) {
        return () => {
            if (!this.soundEnabled) return;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createSound(freq, duration, 'sine')();
                }, index * duration * 1000);
            });
        };
    }

    // Play a sound effect
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    // Initialize sound toggle button
    initializeSoundToggle() {
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                this.updateSoundButton();
                this.playSound('buttonClick');
            });
        }
    }

    // Update sound button appearance
    updateSoundButton() {
        const soundToggle = document.getElementById('soundToggle');
        const soundIcon = document.querySelector('.sound-icon');
        
        if (soundToggle && soundIcon) {
            if (this.soundEnabled) {
                soundToggle.classList.remove('muted');
                soundIcon.textContent = '🔊';
                soundToggle.title = 'Sound On - Click to Mute';
            } else {
                soundToggle.classList.add('muted');
                soundIcon.textContent = '🔇';
                soundToggle.title = 'Sound Off - Click to Unmute';
            }
        }
    }

    // Start the game from menu
    startGameFromMenu() {
        // Hide menu and show game
        document.getElementById('initialMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Initialize game based on selected mode
        this.initializeGameMode();
        
        // Auto-start the game
        this.startGame();
        this.playSound('buttonClick');
    }

    // Initialize game mode based on selection
    initializeGameMode() {
        if (this.selectedGameMode === 'tricky-tech') {
            // Switch to Tricky Tech mode
            this.gameState.currentTurn = 'design-tricks';
            this.thinkingTrapsHand = [...this.designTrickCards];
            this.alternativeThoughtsHand = [...this.healthyHabitCards];
            this.thinkingTrapsEventCards = [...this.designTrickEventCards];
            this.alternativeThoughtsEventCards = [...this.healthyHabitEventCards];
            
            // Update team names in UI
            this.updateTeamNames('Design Tricks', 'Healthy Habits', '📱', '🌱');
        } else {
            // Default to Brain Battle mode
            this.gameState.currentTurn = 'thinking-traps';
            this.thinkingTrapsHand = [...this.thinkingTrapsCards];
            this.alternativeThoughtsHand = [...this.alternativeThoughtsCards];
            this.thinkingTrapsEventCards = [...this.originalThinkingTrapsEventCards];
            this.alternativeThoughtsEventCards = [...this.originalAlternativeThoughtsEventCards];
            
            // Update team names in UI
            this.updateTeamNames('Thinking Traps', 'Alternative Thoughts', '🧠', '💡');
        }
        
        // Reset game state
        this.resetGame();
    }

    // Update team names in the UI
    updateTeamNames(leftTeam, rightTeam, leftIcon, rightIcon) {
        // Update turn indicator
        const turnIndicator = document.getElementById('turnIndicator');
        if (turnIndicator) {
            const currentTeam = this.gameState.currentTurn === 'thinking-traps' || this.gameState.currentTurn === 'design-tricks' ? leftTeam : rightTeam;
            const currentIcon = this.gameState.currentTurn === 'thinking-traps' || this.gameState.currentTurn === 'design-tricks' ? leftIcon : rightIcon;
            turnIndicator.innerHTML = `<span class="turn-text">${currentIcon} ${currentTeam}'s Turn</span>`;
        }
        
        // Update hand labels
        const leftHandLabel = document.querySelector('.hand-label.left');
        const rightHandLabel = document.querySelector('.hand-label.right');
        if (leftHandLabel) leftHandLabel.textContent = `Hand of ${leftTeam}`;
        if (rightHandLabel) rightHandLabel.textContent = `Hand of ${rightTeam}`;
        
        // Update event card labels
        const leftEventLabel = document.querySelector('.event-cards.left .event-cards-label');
        const rightEventLabel = document.querySelector('.event-cards.right .event-cards-label');
        if (leftEventLabel) leftEventLabel.textContent = `${leftIcon} ${leftTeam} Event Cards`;
        if (rightEventLabel) rightEventLabel.textContent = `${rightIcon} ${rightTeam} Event Cards`;
    }

    // Start the game
    startGame() {
        if (this.gameState.gameStarted) return;
        
        this.gameState.gameStarted = true;
        this.gameState.timeRemaining = 600;
        
        // Clear any existing timer first
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
        }
        
        this.startTimer();
        this.updateDisplay();
        this.logGameEvent('Game started! Thinking Traps go first.');
        this.playSound('buttonClick');
    }

    // Back to menu
    backToMenu() {
        // Stop timer if running
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
        }
        
        // Reset game state
        this.resetGame();
        
        // Hide game and show menu
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('initialMenu').style.display = 'flex';
    }

    // Start the timer
    startTimer() {
        console.log('Starting timer with', this.gameState.timeRemaining, 'seconds');
        this.gameState.timer = setInterval(() => {
            this.gameState.timeRemaining--;
            console.log('Timer tick:', this.gameState.timeRemaining);
            this.updateTimer();
            
            if (this.gameState.timeRemaining <= 0) {
                this.endGame('time');
            }
        }, 1000);
    }

    // Update timer display
    updateTimer() {
        const minutes = Math.floor(this.gameState.timeRemaining / 60);
        const seconds = this.gameState.timeRemaining % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Reset the game
    resetGame() {
        clearInterval(this.gameState.timer);
        this.gameState = {
            brainHealth: 0,
            currentTurn: this.selectedGameMode === 'tricky-tech' ? 'design-tricks' : 'thinking-traps',
            gameStarted: false,
            timeRemaining: 600,
            timer: null,
            lastMove: null
        };
        
        // Reset cards to original state
        this.thinkingTrapsCards = this.originalThinkingTrapsCards.map(card => ({
            ...card,
            hp: card.hp, // Reset to original HP
            usedMoves: [] // Clear used moves
        }));
        this.alternativeThoughtsCards = this.originalAlternativeThoughtsCards.map(card => ({
            ...card,
            hp: card.hp, // Reset to original HP
            usedMoves: [] // Clear used moves
        }));
        
        // Reset hands and game areas based on game mode
        if (this.selectedGameMode === 'tricky-tech') {
            this.thinkingTrapsHand = [...this.designTrickCards];
            this.alternativeThoughtsHand = [...this.healthyHabitCards];
        } else {
            this.thinkingTrapsHand = [...this.thinkingTrapsCards];
            this.alternativeThoughtsHand = [...this.alternativeThoughtsCards];
        }
        this.battleZone = [];
        this.thinkingTrapsActive = null;
        this.alternativeThoughtsActive = null;
        this.removedCards = [];
        
        // Clear event card effects
        this.eventCardEffects = {};
        
        // Reset event cards
        this.thinkingTrapsEventCards = [...this.eventCards['thinking-traps']];
        this.alternativeThoughtsEventCards = [...this.eventCards['alternative-thoughts']];
        
        // Reset carousel positions
        this.carouselState.thinkingTraps.currentIndex = 0;
        this.carouselState.alternativeThoughts.currentIndex = 0;
        this.updateDisplay();
        this.clearGameLog();
        
        this.logGameEvent('Game reset. Ready to start!');
    }

    // Show rules modal
    showRules() {
        document.getElementById('rulesModal').style.display = 'block';
    }

    // Shuffle all cards in hands
    shuffleCards() {
        // Shuffle Thinking Traps hand
        for (let i = this.thinkingTrapsHand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.thinkingTrapsHand[i], this.thinkingTrapsHand[j]] = [this.thinkingTrapsHand[j], this.thinkingTrapsHand[i]];
        }
        
        // Shuffle Alternative Thoughts hand
        for (let i = this.alternativeThoughtsHand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.alternativeThoughtsHand[i], this.alternativeThoughtsHand[j]] = [this.alternativeThoughtsHand[j], this.alternativeThoughtsHand[i]];
        }
        
        // Reset carousel positions after shuffling
        this.carouselState.thinkingTraps.currentIndex = 0;
        this.carouselState.alternativeThoughts.currentIndex = 0;
        
        // Update display to show shuffled cards
        this.updateDisplay();
        this.logGameEvent('🔀 Cards have been shuffled!');
    }

    // Shuffle one card at a time
    shuffleOneCard(team) {
        const hand = team === 'thinking-traps' ? this.thinkingTrapsHand : this.alternativeThoughtsHand;
        const availableCards = hand.filter(card => !this.removedCards.includes(card));
        
        if (availableCards.length <= 1) return; // Can't shuffle if only one available card
        
        // Find the first available card and move it to the end
        const firstAvailableIndex = hand.findIndex(card => !this.removedCards.includes(card));
        if (firstAvailableIndex !== -1) {
            const firstCard = hand.splice(firstAvailableIndex, 1)[0];
            hand.push(firstCard);
        }
        
        // Update display
        this.updateDisplay();
        this.logGameEvent(`🔀 ${team === 'thinking-traps' ? '🧠' : '💡'} One card shuffled!`);
    }

    // Navigate carousel left
    navigateCarousel(team, direction) {
        const state = this.carouselState[team];
        const hand = team === 'thinkingTraps' ? this.thinkingTrapsHand : this.alternativeThoughtsHand;
        const availableCards = hand.filter(card => !this.removedCards.includes(card));
        
        if (direction === 'prev' && state.currentIndex > 0) {
            state.currentIndex--;
        } else if (direction === 'next' && state.currentIndex + state.visibleCards < availableCards.length) {
            state.currentIndex++;
        }
        
        this.updateHand(team === 'thinkingTraps' ? 'thinkingTrapsHand' : 'alternativeThoughtsHand', hand, team === 'thinkingTraps' ? 'thinking-trap' : 'alternative-thought');
        this.updateCarouselIndicators(team);
    }

    // Update carousel indicators
    updateCarouselIndicators(team) {
        console.log(`updateCarouselIndicators called for team: ${team}`);
        const state = this.carouselState[team];
        const hand = team === 'thinkingTraps' ? this.thinkingTrapsHand : this.alternativeThoughtsHand;
        const availableCards = hand.filter(card => !this.removedCards.includes(card));
        const indicatorsId = team === 'thinkingTraps' ? 'thinkingTrapsIndicators' : 'alternativeThoughtsIndicators';
        const indicatorsElement = document.getElementById(indicatorsId);
        console.log(`Indicators element found: ${!!indicatorsElement}, available cards: ${availableCards.length}`);
        
        if (!indicatorsElement) return;
        
        console.log(`Clearing indicators and creating ${Math.ceil(availableCards.length / state.visibleCards)} indicators`);
        indicatorsElement.innerHTML = '';
        const totalPages = Math.ceil(availableCards.length / state.visibleCards);
        console.log(`Total pages: ${totalPages}, current index: ${state.currentIndex}, visible cards: ${state.visibleCards}`);
        
        for (let i = 0; i < totalPages; i++) {
            console.log(`Creating indicator ${i}`);
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${i === Math.floor(state.currentIndex / state.visibleCards) ? 'active' : ''}`;
            indicator.onclick = () => {
                console.log(`Indicator ${i} clicked, updating carousel`);
                state.currentIndex = i * state.visibleCards;
                this.updateHand(team === 'thinkingTraps' ? 'thinkingTrapsHand' : 'alternativeThoughtsHand', hand, team === 'thinkingTraps' ? 'thinking-trap' : 'alternative-thought');
                this.updateCarouselIndicators(team);
            };
            indicatorsElement.appendChild(indicator);
        }
        console.log(`updateCarouselIndicators complete for ${team}`);
    }

    // Play a card
    playCard(cardIndex, team) {
        console.log('=== PLAY CARD CALLED ===');
        console.log('Card index:', cardIndex, 'Team:', team, 'Game mode:', this.selectedGameMode);
        console.log('Game started:', this.gameState.gameStarted, 'Current turn:', this.gameState.currentTurn);
        
        if (!this.gameState.gameStarted) {
            console.log('Game not started - returning');
            return;
        }
        
        // Handle both game modes for turn checking
        const isCurrentTurn = this.selectedGameMode === 'tricky-tech' 
            ? (team === 'design-tricks' && this.gameState.currentTurn === 'design-tricks') || 
              (team === 'healthy-habits' && this.gameState.currentTurn === 'healthy-habits')
            : (team === 'thinking-traps' && this.gameState.currentTurn === 'thinking-traps') || 
              (team === 'alternative-thoughts' && this.gameState.currentTurn === 'alternative-thoughts');
              
        console.log('Is current turn:', isCurrentTurn);
        if (!isCurrentTurn) {
            console.log('Not current turn - returning');
            return;
        }
        
        // Get the correct hand based on game mode and team
        let hand;
        if (this.selectedGameMode === 'tricky-tech') {
            hand = team === 'design-tricks' ? this.thinkingTrapsHand : this.alternativeThoughtsHand;
        } else {
            hand = team === 'thinking-traps' ? this.thinkingTrapsHand : this.alternativeThoughtsHand;
        }
        
        // Filter out removed cards to get available cards
        const availableCards = hand.filter(card => !this.removedCards.includes(card));
        const card = availableCards[cardIndex];
        
        console.log('Play card called:', { cardIndex, team, availableCards: availableCards.length, card: card?.name }); // Debug logging
        
        if (!card) {
            console.error('No card found at index:', cardIndex);
            return;
        }
        
        // Check if card is already removed
        if (this.removedCards.includes(card)) {
            this.logGameEvent('❌ This card has been removed from the game!');
            return;
        }
        
        // Find the actual index in the original hand array
        const actualIndex = hand.indexOf(card);
        if (actualIndex === -1) return;
        
        // Remove card from hand
        hand.splice(actualIndex, 1);
        
        // Add to active slot or battle zone
        const isLeftTeam = this.selectedGameMode === 'tricky-tech' 
            ? team === 'design-tricks' 
            : team === 'thinking-traps';
            
        if (isLeftTeam) {
            if (this.thinkingTrapsActive) {
                // Only move to battle zone if the card is not removed
                if (!this.removedCards.includes(this.thinkingTrapsActive)) {
                    this.battleZone.push(this.thinkingTrapsActive);
                }
            }
            this.thinkingTrapsActive = card;
        } else {
            if (this.alternativeThoughtsActive) {
                // Only move to battle zone if the card is not removed
                if (!this.removedCards.includes(this.alternativeThoughtsActive)) {
                    this.battleZone.push(this.alternativeThoughtsActive);
                }
            }
            this.alternativeThoughtsActive = card;
        }
        
        // Get appropriate icon and team name for logging
        let icon, teamName;
        if (this.selectedGameMode === 'tricky-tech') {
            icon = team === 'design-tricks' ? '📱' : '🌱';
            teamName = team === 'design-tricks' ? 'Design Tricks' : 'Healthy Habits';
        } else {
            icon = team === 'thinking-traps' ? '🧠' : '💡';
            teamName = team === 'thinking-traps' ? 'Thinking Traps' : 'Alternative Thoughts';
        }
        
        this.logGameEvent(`${icon} ${card.name} played!`);
        console.log('Card played successfully, updating display...');
        this.updateDisplay();
        console.log('Display updated successfully');
    }

    // Play a card from battle zone
    playBattleZoneCard(card, team) {
        if (!this.gameState.gameStarted) return;
        
        // Handle both game modes for turn checking
        const isCurrentTurn = this.selectedGameMode === 'tricky-tech' 
            ? (team === 'design-tricks' && this.gameState.currentTurn === 'design-tricks') || 
              (team === 'healthy-habits' && this.gameState.currentTurn === 'healthy-habits')
            : (team === 'thinking-traps' && this.gameState.currentTurn === 'thinking-traps') || 
              (team === 'alternative-thoughts' && this.gameState.currentTurn === 'alternative-thoughts');
              
        if (!isCurrentTurn) return;
        
        // Check if card is already removed
        if (this.removedCards.includes(card)) {
            this.logGameEvent('❌ This card has been removed from the game!');
            return;
        }
        
        // Remove card from battle zone
        const battleZoneIndex = this.battleZone.indexOf(card);
        if (battleZoneIndex === -1) return;
        this.battleZone.splice(battleZoneIndex, 1);
        
        // Add to active slot or battle zone
        const isLeftTeam = this.selectedGameMode === 'tricky-tech' 
            ? team === 'design-tricks' 
            : team === 'thinking-traps';
            
        if (isLeftTeam) {
            if (this.thinkingTrapsActive) {
                // Only move to battle zone if the card is not removed
                if (!this.removedCards.includes(this.thinkingTrapsActive)) {
                    this.battleZone.push(this.thinkingTrapsActive);
                }
            }
            this.thinkingTrapsActive = card;
        } else {
            if (this.alternativeThoughtsActive) {
                // Only move to battle zone if the card is not removed
                if (!this.removedCards.includes(this.alternativeThoughtsActive)) {
                    this.battleZone.push(this.alternativeThoughtsActive);
                }
            }
            this.alternativeThoughtsActive = card;
        }
        
        // Get appropriate icon for logging
        let icon;
        if (this.selectedGameMode === 'tricky-tech') {
            icon = team === 'design-tricks' ? '📱' : '🌱';
        } else {
            icon = team === 'thinking-traps' ? '🧠' : '💡';
        }
        this.logGameEvent(`${icon} ${card.name} moved from battle zone to active!`);
        this.updateDisplay();
        this.playSound('cardPlay');
    }

    // Use a move from an active card
    useMove(moveIndex, team, target = 'brain-health') {
        if (!this.gameState.gameStarted) return;
        
        // Handle both game modes for turn checking
        const isCurrentTurn = this.selectedGameMode === 'tricky-tech' 
            ? (team === 'design-tricks' && this.gameState.currentTurn === 'design-tricks') || 
              (team === 'healthy-habits' && this.gameState.currentTurn === 'healthy-habits')
            : (team === 'thinking-traps' && this.gameState.currentTurn === 'thinking-traps') || 
              (team === 'alternative-thoughts' && this.gameState.currentTurn === 'alternative-thoughts');
              
        if (!isCurrentTurn) return;
        
        // Get the correct active card based on game mode and team
        const isLeftTeam = this.selectedGameMode === 'tricky-tech' 
            ? team === 'design-tricks' 
            : team === 'thinking-traps';
        const activeCard = isLeftTeam ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
        if (!activeCard) return;
        
        const move = activeCard.moves[moveIndex];
        if (!move) return;
        
        // Check if this move has already been used this turn
        if (activeCard.usedMoves && activeCard.usedMoves.includes(moveIndex)) {
            this.logGameEvent('❌ This move has already been used this turn.');
            return;
        }
        
        // Show targeting menu instead of immediately applying the move
        this.showTargetingMenu(moveIndex, team, activeCard, move);
    }
    
    // Show targeting menu for move selection
    showTargetingMenu(moveIndex, team, activeCard, move) {
        const targetingModal = document.getElementById('targetingModal');
        const targetingContent = document.getElementById('targetingContent');
        
        if (!targetingModal || !targetingContent) return;
        
        // Clear previous content
        targetingContent.innerHTML = '';
        
        // Create targeting options
        const title = document.createElement('h3');
        title.textContent = `Choose Target for ${move.name}`;
        title.style.marginBottom = '20px';
        title.style.color = '#2d3748';
        targetingContent.appendChild(title);
        
        // Brain Health option
        const brainHealthOption = document.createElement('div');
        brainHealthOption.className = 'targeting-option';
        brainHealthOption.innerHTML = `
            <div class="targeting-icon">🧠</div>
            <div class="targeting-text">
                <div class="targeting-title">Brain Health</div>
                <div class="targeting-description">Apply ${move.damage > 0 ? '+' : ''}${move.damage} to Brain Health</div>
            </div>
        `;
        brainHealthOption.onclick = () => {
            this.executeMove(moveIndex, team, 'brain-health');
            targetingModal.style.display = 'none';
        };
        targetingContent.appendChild(brainHealthOption);
        
        // Check if there are opponent cards to target
        let opponentTeam, opponentActive, opponentCards;
        
        if (this.selectedGameMode === 'tricky-tech') {
            opponentTeam = team === 'design-tricks' ? 'healthy-habits' : 'design-tricks';
            opponentActive = opponentTeam === 'design-tricks' ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
            opponentCards = this.battleZone.filter(card => 
                card.type === (opponentTeam === 'design-tricks' ? 'design-trick' : 'healthy-habit')
            );
        } else {
            opponentTeam = team === 'thinking-traps' ? 'alternative-thoughts' : 'thinking-traps';
            opponentActive = opponentTeam === 'thinking-traps' ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
            opponentCards = this.battleZone.filter(card => 
                card.type === (opponentTeam === 'thinking-traps' ? 'thinking-trap' : 'alternative-thought')
            );
        }
        
        // Opponent's active card option
        if (opponentActive) {
            const activeCardOption = document.createElement('div');
            activeCardOption.className = 'targeting-option';
            const attackDamage = -Math.abs(move.damage); // Both teams do negative damage to opponent cards
            activeCardOption.innerHTML = `
                <div class="targeting-icon">⚔️</div>
                <div class="targeting-text">
                    <div class="targeting-title">${opponentActive.name}</div>
                    <div class="targeting-description">Attack opponent's active card (HP: ${opponentActive.hp}) - ${attackDamage} damage</div>
                </div>
            `;
            activeCardOption.onclick = () => {
                this.executeMove(moveIndex, team, 'active');
                targetingModal.style.display = 'none';
            };
            targetingContent.appendChild(activeCardOption);
        }
        
        // Battle zone cards option
        if (opponentCards.length > 0) {
            const battleZoneOption = document.createElement('div');
            battleZoneOption.className = 'targeting-option';
            battleZoneOption.innerHTML = `
                <div class="targeting-icon">🏰</div>
                <div class="targeting-text">
                    <div class="targeting-title">Battle Zone</div>
                    <div class="targeting-description">Attack cards in opponent's battle zone</div>
                </div>
            `;
            battleZoneOption.onclick = () => {
                this.showBattleZoneTargeting(moveIndex, team, opponentCards);
                targetingModal.style.display = 'none';
            };
            targetingContent.appendChild(battleZoneOption);
        }
        
        // Cancel option
        const cancelOption = document.createElement('div');
        cancelOption.className = 'targeting-option cancel';
        cancelOption.innerHTML = `
            <div class="targeting-icon">❌</div>
            <div class="targeting-text">
                <div class="targeting-title">Cancel</div>
                <div class="targeting-description">Choose a different move</div>
            </div>
        `;
        cancelOption.onclick = () => {
            targetingModal.style.display = 'none';
        };
        targetingContent.appendChild(cancelOption);
        
        // Show the modal
        targetingModal.style.display = 'block';
    }
    
    // Show battle zone targeting for specific cards
    showBattleZoneTargeting(moveIndex, team, opponentCards) {
        const targetingModal = document.getElementById('targetingModal');
        const targetingContent = document.getElementById('targetingContent');
        
        if (!targetingModal || !targetingContent) return;
        
        // Clear previous content
        targetingContent.innerHTML = '';
        
        const title = document.createElement('h3');
        title.textContent = 'Choose Battle Zone Target';
        title.style.marginBottom = '20px';
        title.style.color = '#2d3748';
        targetingContent.appendChild(title);
        
        // Show each opponent card as a target option
        opponentCards.forEach(card => {
            const cardOption = document.createElement('div');
            cardOption.className = 'targeting-option';
            const attackDamage = -Math.abs(move.damage); // Both teams do negative damage to opponent cards
            cardOption.innerHTML = `
                <div class="targeting-icon">🎯</div>
                <div class="targeting-text">
                    <div class="targeting-title">${card.name}</div>
                    <div class="targeting-description">HP: ${card.hp} - ${attackDamage} damage</div>
                </div>
            `;
            cardOption.onclick = () => {
                this.executeMove(moveIndex, team, 'battle-zone', card);
                targetingModal.style.display = 'none';
            };
            targetingContent.appendChild(cardOption);
        });
        
        // Back option
        const backOption = document.createElement('div');
        backOption.className = 'targeting-option back';
        backOption.innerHTML = `
            <div class="targeting-icon">⬅️</div>
            <div class="targeting-text">
                <div class="targeting-title">Back</div>
                <div class="targeting-description">Return to main targeting</div>
            </div>
        `;
        backOption.onclick = () => {
            this.showTargetingMenu(moveIndex, team, 
                team === 'thinking-traps' ? this.thinkingTrapsActive : this.alternativeThoughtsActive,
                team === 'thinking-traps' ? this.thinkingTrapsActive.moves[moveIndex] : this.alternativeThoughtsActive.moves[moveIndex]
            );
        };
        targetingContent.appendChild(backOption);
        
        // Show the modal
        targetingModal.style.display = 'block';
    }
    
    // Execute the selected move with the chosen target
    executeMove(moveIndex, team, target, specificCard = null) {
        // Get the correct active card based on game mode and team
        const isLeftTeam = this.selectedGameMode === 'tricky-tech' 
            ? team === 'design-tricks' 
            : team === 'thinking-traps';
        const activeCard = isLeftTeam ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
        const move = activeCard.moves[moveIndex];
        
        // Check if move has already been used
        if (activeCard.usedMoves && activeCard.usedMoves.includes(moveIndex)) {
            this.logGameEvent('❌ This move has already been used this turn.');
            return;
        }
        
        let damage = move.damage;
        let targetCard = specificCard;
        
        // Debug logging
        console.log(`Attack: ${activeCard.name} (${team}) attacks with ${move.name} for ${damage} damage to ${target}`);
        
        // Apply counter bonus if targeting corresponding card
        // Temporarily disabled to test damage calculation
        /*
        if (target !== 'brain-health' && activeCard.counter) {
            if (target === 'active') {
                const targetTeam = team === 'thinking-traps' ? 'alternative-thoughts' : 'thinking-traps';
                const targetActive = targetTeam === 'thinking-traps' ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
                if (targetActive && targetActive.name === activeCard.counter) {
                    // Counter bonus: +10 damage (more effective against counter cards)
                    damage += 10;
                    this.logGameEvent(`🎯 Counter bonus! +10 damage against ${targetActive.name}!`);
                }
            } else if (target === 'battle-zone' && specificCard && specificCard.name === activeCard.counter) {
                // Counter bonus: +10 damage (more effective against counter cards)
                damage += 10;
                this.logGameEvent(`🎯 Counter bonus! +10 damage against ${specificCard.name}!`);
            }
        }
        */
        
        // Apply the move
        if (target === 'brain-health') {
            this.gameState.brainHealth += damage;
            // Get appropriate icon for logging
            let icon;
            if (this.selectedGameMode === 'tricky-tech') {
                icon = team === 'design-tricks' ? '📱' : '🌱';
            } else {
                icon = team === 'thinking-traps' ? '🧠' : '💡';
            }
            this.logGameEvent(`${icon} ${activeCard.name} uses ${move.name}: ${damage > 0 ? '+' : ''}${damage} to Brain Health`);
            
            // Play appropriate brain health sound
            if (damage > 0) {
                this.playSound('brainHealthUp');
            } else {
                this.playSound('brainHealthDown');
            }
            
            // Check win condition
            console.log(`Brain Health after move: ${this.gameState.brainHealth}`);
            if (this.gameState.brainHealth <= -100) {
                const winner = this.selectedGameMode === 'tricky-tech' ? 'design-tricks' : 'thinking-traps';
                console.log(`${this.selectedGameMode === 'tricky-tech' ? 'Design Tricks' : 'Thinking Traps'} win condition triggered!`);
                this.playSound('lose');
                this.endGame(winner);
                return;
            } else if (this.gameState.brainHealth >= 100) {
                const winner = this.selectedGameMode === 'tricky-tech' ? 'healthy-habits' : 'alternative-thoughts';
                console.log(`${this.selectedGameMode === 'tricky-tech' ? 'Healthy Habits' : 'Alternative Thoughts'} win condition triggered!`);
                this.playSound('win');
                this.endGame(winner);
                return;
            }
        } else {
            // Target opponent's card - but Alternative Thoughts still affect Brain Health
            // Healthy Habits/Alternative Thoughts always add to Brain Health, even when attacking opponent cards
            const isRightTeam = this.selectedGameMode === 'tricky-tech' 
                ? team === 'healthy-habits' 
                : team === 'alternative-thoughts';
                
            if (isRightTeam) {
                this.gameState.brainHealth += damage;
                const icon = this.selectedGameMode === 'tricky-tech' ? '🌱' : '💡';
                this.logGameEvent(`${icon} ${activeCard.name} uses ${move.name}: ${damage > 0 ? '+' : ''}${damage} to Brain Health (while attacking opponent)`);
            }
            
            if (target === 'active') {
                // Get the opponent team
                const targetTeam = this.selectedGameMode === 'tricky-tech' 
                    ? (team === 'design-tricks' ? 'healthy-habits' : 'design-tricks')
                    : (team === 'thinking-traps' ? 'alternative-thoughts' : 'thinking-traps');
                    
                const isTargetLeftTeam = this.selectedGameMode === 'tricky-tech' 
                    ? targetTeam === 'design-tricks' 
                    : targetTeam === 'thinking-traps';
                const targetActive = isTargetLeftTeam ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
                if (targetActive) {
                    const originalHP = targetActive.hp;
                    // For opponent cards, subtract the damage (harm them)
                    targetActive.hp -= Math.abs(damage);
                    
                    if (targetActive.hp <= 0) {
                        this.logGameEvent(`💀 ${targetActive.name} defeated! (HP: ${originalHP} - ${Math.abs(damage)} = ${targetActive.hp})`);
                        this.removedCards.push(targetActive);
                        // Clear the active slot
                        if (targetTeam === 'thinking-traps') {
                            this.thinkingTrapsActive = null;
                        } else {
                            this.alternativeThoughtsActive = null;
                        }
                        this.playSound('cardDefeat');
                    } else {
                        // Get appropriate icon for logging
                        let icon;
                        if (this.selectedGameMode === 'tricky-tech') {
                            icon = team === 'design-tricks' ? '📱' : '🌱';
                        } else {
                            icon = team === 'thinking-traps' ? '🧠' : '💡';
                        }
                        this.logGameEvent(`${icon} ${activeCard.name} attacks ${targetActive.name}: -${Math.abs(damage)} damage (HP: ${originalHP} → ${targetActive.hp})`);
                        this.playSound('cardAttack');
                    }
                }
            } else if (target === 'battle-zone' && specificCard) {
                const originalHP = specificCard.hp;
                // For opponent cards, subtract the damage (harm them)
                specificCard.hp -= Math.abs(damage);
                
                if (specificCard.hp <= 0) {
                    this.logGameEvent(`💀 ${specificCard.name} defeated! (HP: ${originalHP} - ${Math.abs(damage)} = ${specificCard.hp})`);
                    this.removedCards.push(specificCard);
                    const index = this.battleZone.indexOf(specificCard);
                    if (index > -1) this.battleZone.splice(index, 1);
                    this.playSound('cardDefeat');
                } else {
                    // Get appropriate icon for logging
                    let icon;
                    if (this.selectedGameMode === 'tricky-tech') {
                        icon = team === 'design-tricks' ? '📱' : '🌱';
                    } else {
                        icon = team === 'thinking-traps' ? '🧠' : '💡';
                    }
                    this.logGameEvent(`${icon} ${activeCard.name} attacks ${specificCard.name}: -${Math.abs(damage)} damage (HP: ${originalHP} → ${specificCard.hp})`);
                    this.playSound('cardAttack');
                }
            }
        }
        
        // Mark move as used
        if (!activeCard.usedMoves) {
            activeCard.usedMoves = [];
        }
        activeCard.usedMoves.push(moveIndex);
        
        // Check if both moves have been used, then reset
        if (activeCard.usedMoves.length >= 2) {
            activeCard.usedMoves = [];
            this.logGameEvent(`🔄 ${activeCard.name} has used both moves - moves reset for next turn!`);
        }
        
        // Check win condition after any move (not just Brain Health moves)
        console.log(`Brain Health after any move: ${this.gameState.brainHealth}`);
        if (this.gameState.brainHealth <= -100) {
            console.log('Thinking Traps win condition triggered after move!');
            this.endGame('thinking-traps');
            return;
        } else if (this.gameState.brainHealth >= 100) {
            console.log('Alternative Thoughts win condition triggered after move!');
            this.endGame('alternative-thoughts');
            return;
        }
        
        // Record last move and switch turns
        this.gameState.lastMove = move.name;
        this.switchTurn();
        this.updateDisplay();
    }

    // Show event card details and ask for confirmation
    useEventCard(team) {
        console.log('useEventCard called:', { team, gameStarted: this.gameState.gameStarted, currentTurn: this.gameState.currentTurn });
        
        if (!this.gameState.gameStarted) {
            console.log('Game not started, cannot use event card');
            return;
        }
        // Handle both game modes for turn checking
        const isCurrentTurn = this.selectedGameMode === 'tricky-tech' 
            ? (team === 'design-tricks' && this.gameState.currentTurn === 'design-tricks') || 
              (team === 'healthy-habits' && this.gameState.currentTurn === 'healthy-habits')
            : (team === 'thinking-traps' && this.gameState.currentTurn === 'thinking-traps') || 
              (team === 'alternative-thoughts' && this.gameState.currentTurn === 'alternative-thoughts');
              
        if (!isCurrentTurn) {
            console.log('Not your turn, cannot use event card');
            return;
        }
        
        // Get the correct event cards based on game mode and team
        const eventCards = this.selectedGameMode === 'tricky-tech' 
            ? (team === 'design-tricks' ? this.thinkingTrapsEventCards : this.alternativeThoughtsEventCards)
            : (team === 'thinking-traps' ? this.thinkingTrapsEventCards : this.alternativeThoughtsEventCards);
        console.log('Event cards available:', eventCards.length);
        
        if (eventCards.length === 0) {
            console.log('No event cards available');
            return;
        }
        
        // Show the event card details
        this.showEventCardDetails(eventCards[0], team);
    }
    
    // Show event card details modal
    showEventCardDetails(eventCard, team) {
        const targetingModal = document.getElementById('targetingModal');
        const targetingContent = document.getElementById('targetingContent');
        
        if (!targetingModal || !targetingContent) return;
        
        // Clear previous content
        targetingContent.innerHTML = '';
        
        // Create event card display
        const title = document.createElement('h3');
        title.textContent = `🎭 ${eventCard.name}`;
        title.style.marginBottom = '20px';
        title.style.color = '#2d3748';
        targetingContent.appendChild(title);
        
        // Event card image (if available)
        if (eventCard.imagePath) {
            const imageContainer = document.createElement('div');
            imageContainer.style.textAlign = 'center';
            imageContainer.style.marginBottom = '20px';
            const img = document.createElement('img');
            img.src = eventCard.imagePath;
            img.alt = eventCard.name;
            img.style.maxWidth = '200px';
            img.style.maxHeight = '150px';
            img.style.borderRadius = '10px';
            img.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            img.onerror = () => img.style.display = 'none';
            imageContainer.appendChild(img);
            targetingContent.appendChild(imageContainer);
        }
        
        // Effect description
        const effectDiv = document.createElement('div');
        effectDiv.style.marginBottom = '15px';
        effectDiv.style.padding = '15px';
        effectDiv.style.backgroundColor = '#f7fafc';
        effectDiv.style.borderRadius = '10px';
        effectDiv.style.border = '2px solid #e2e8f0';
        
        const effectTitle = document.createElement('div');
        effectTitle.style.fontWeight = 'bold';
        effectTitle.style.marginBottom = '10px';
        effectTitle.style.color = '#2d3748';
        effectTitle.textContent = `Effect: ${eventCard.effect > 0 ? '+' : ''}${eventCard.effect} Brain Health`;
        effectDiv.appendChild(effectTitle);
        
        const effectDesc = document.createElement('div');
        effectDesc.style.color = '#4a5568';
        effectDesc.style.lineHeight = '1.5';
        effectDesc.textContent = eventCard.description;
        effectDiv.appendChild(effectDesc);
        
        targetingContent.appendChild(effectDiv);
        
        // Special effect (if available)
        if (eventCard.specialEffect) {
            const specialDiv = document.createElement('div');
            specialDiv.style.marginBottom = '20px';
            specialDiv.style.padding = '15px';
            specialDiv.style.backgroundColor = '#fff5f5';
            specialDiv.style.borderRadius = '10px';
            specialDiv.style.border = '2px solid #fed7d7';
            
            const specialTitle = document.createElement('div');
            specialTitle.style.fontWeight = 'bold';
            specialTitle.style.marginBottom = '10px';
            specialTitle.style.color = '#c53030';
            specialTitle.textContent = '⚡ Special Effect:';
            specialDiv.appendChild(specialTitle);
            
            const specialDesc = document.createElement('div');
            specialDesc.style.color = '#742a2a';
            specialDesc.style.lineHeight = '1.5';
            specialDesc.textContent = eventCard.specialEffect;
            specialDiv.appendChild(specialDesc);
            
            targetingContent.appendChild(specialDiv);
        }
        
        // Action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '15px';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginTop = '20px';
        
        // Use card button
        const useButton = document.createElement('button');
        useButton.className = 'btn btn-primary';
        useButton.textContent = `Use ${eventCard.name}`;
        useButton.style.padding = '12px 24px';
        useButton.style.fontSize = '16px';
        useButton.onclick = () => {
            this.executeEventCard(eventCard, team);
            targetingModal.style.display = 'none';
        };
        buttonContainer.appendChild(useButton);
        
        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-secondary';
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '12px 24px';
        cancelButton.style.fontSize = '16px';
        cancelButton.onclick = () => {
            targetingModal.style.display = 'none';
        };
        buttonContainer.appendChild(cancelButton);
        
        targetingContent.appendChild(buttonContainer);
        
        // Show the modal
        targetingModal.style.display = 'block';
    }
    
    // Get the number of turns an event card should last
    getEventCardTurns(eventCardName) {
        switch (eventCardName) {
            case 'Social Media Storm':
                return 2; // "for 2 turns"
            case 'Distraction Overload':
                return 2; // "for 2 turns"
            case 'Rest & Recharge':
                return 3; // "for 3 turns"
            case 'Friend Support':
                return 1; // "for 1 turn"
            default:
                return 1; // Default to 1 turn
        }
    }

    // Execute the event card after confirmation
    executeEventCard(eventCard, team) {
        const eventCards = team === 'thinking-traps' ? this.thinkingTrapsEventCards : this.alternativeThoughtsEventCards;
        
        // Remove the card from the deck
        const cardIndex = eventCards.findIndex(card => card.name === eventCard.name);
        if (cardIndex !== -1) {
            eventCards.splice(cardIndex, 1);
        }
        
        // Create a copy of the event card for the battle zone
        const eventCardCopy = {
            ...eventCard,
            type: 'event-card',
            isEventCard: true,
            usedThisTurn: true,
            hp: 1, // Give it 1 HP so it shows in battle zone
            turnsRemaining: this.getEventCardTurns(eventCard.name) // Track remaining turns
        };
        
        // Add to battle zone to show its impact
        this.battleZone.push(eventCardCopy);
        
        // Apply the effect
        const originalBrainHealth = this.gameState.brainHealth;
        this.gameState.brainHealth += eventCard.effect;
        
        // Log the event with detailed information
        this.logGameEvent(`🎭 ${team === 'thinking-traps' ? '🧠' : '💡'} uses ${eventCard.name}: ${eventCard.effect > 0 ? '+' : ''}${eventCard.effect} to Brain Health (${originalBrainHealth} → ${this.gameState.brainHealth})`);
        this.logGameEvent(`📝 ${eventCard.description}`);
        if (eventCard.specialEffect) {
            this.logGameEvent(`⚡ Special Effect: ${eventCard.specialEffect}`);
        }
        
        // Apply special effects based on the card
        this.applyEventCardSpecialEffects(eventCard, team);
        this.playSound('eventCard');
        
        // Check win condition
        console.log(`Brain Health after event card: ${this.gameState.brainHealth}`);
        if (this.gameState.brainHealth <= -100) {
            console.log('Thinking Traps win condition triggered by event card!');
            this.endGame('thinking-traps');
            return;
        } else if (this.gameState.brainHealth >= 100) {
            console.log('Alternative Thoughts win condition triggered by event card!');
            this.endGame('alternative-thoughts');
            return;
        }
        
        this.switchTurn();
        this.updateDisplay();
        
        // Close the modal
        document.getElementById('targetingModal').style.display = 'none';
    }
    
    // Apply special effects from event cards
    applyEventCardSpecialEffects(eventCard, team) {
        // Store original HP values for reversal
        if (!this.eventCardEffects) {
            this.eventCardEffects = {};
        }
        
        const effectKey = `${eventCard.name}_${Date.now()}`;
        this.eventCardEffects[effectKey] = {
            eventCard: eventCard,
            team: team,
            originalHPs: {}
        };
        
        switch (eventCard.name) {
            case 'Social Media Storm':
                // All Thinking Traps gain 25 HP and their moves do double damage for 2 turns
                // Reduces all active Alternative Thought cards' HP by 15
                this.thinkingTrapsCards.forEach((card, index) => {
                    if (card.hp > 0) {
                        this.eventCardEffects[effectKey].originalHPs[`thinking_${index}`] = card.hp;
                        card.hp += 25;
                    }
                });
                this.alternativeThoughtsCards.forEach((card, index) => {
                    if (card.hp > 0) {
                        this.eventCardEffects[effectKey].originalHPs[`alternative_${index}`] = card.hp;
                        card.hp = Math.max(0, card.hp - 15);
                    }
                });
                this.logGameEvent(`⚡ Social Media Storm: All Thinking Traps +25 HP, Alternative Thoughts -15 HP`);
                break;
                
            case 'Distraction Overload':
                // All Alternative Thoughts lose 20 HP and their healing is reduced by half for 2 turns
                // Prevents one opponent card from making moves for 1 turn
                this.alternativeThoughtsCards.forEach((card, index) => {
                    if (card.hp > 0) {
                        this.eventCardEffects[effectKey].originalHPs[`alternative_${index}`] = card.hp;
                        card.hp = Math.max(0, card.hp - 20);
                    }
                });
                this.logGameEvent(`⚡ Distraction Overload: All Alternative Thoughts -20 HP`);
                break;
                
            case 'Rest & Recharge':
                // Reduces the power of all Thinking Traps by 20 HP for 3 turns
                // Alternative Thoughts gain 10 HP
                // Also restores 20 HP to one of your active cards
                this.thinkingTrapsCards.forEach((card, index) => {
                    if (card.hp > 0) {
                        this.eventCardEffects[effectKey].originalHPs[`thinking_${index}`] = card.hp;
                        card.hp = Math.max(0, card.hp - 20);
                    }
                });
                this.alternativeThoughtsCards.forEach((card, index) => {
                    if (card.hp > 0) {
                        this.eventCardEffects[effectKey].originalHPs[`alternative_${index}`] = card.hp;
                        card.hp += 10;
                    }
                });
                
                // Restore HP to active card
                const activeCard = team === 'thinking-traps' ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
                if (activeCard && activeCard.hp > 0) {
                    this.eventCardEffects[effectKey].originalHPs[`active_${team}`] = activeCard.hp;
                    activeCard.hp += 20;
                    this.logGameEvent(`⚡ Rest & Recharge: Active card ${activeCard.name} +20 HP`);
                }
                
                this.logGameEvent(`⚡ Rest & Recharge: Thinking Traps -20 HP, Alternative Thoughts +10 HP`);
                break;
                
            case 'Friend Support':
                // Can defeat one active Thinking Trap immediately OR protect one of your cards
                // Also boost one Alternative Thought by 30 HP
                this.alternativeThoughtsCards.forEach(card => {
                    if (card.hp > 0) card.hp += 30;
                });
                this.logGameEvent(`⚡ Friend Support: All Alternative Thoughts +30 HP`);
                break;
        }
    }
    

    // Switch turns
    switchTurn() {
        // Discard event cards that were used this turn
        this.discardUsedEventCards();
        
        // Handle turn switching for both game modes
        if (this.selectedGameMode === 'tricky-tech') {
            this.gameState.currentTurn = this.gameState.currentTurn === 'design-tricks' ? 'healthy-habits' : 'design-tricks';
        } else {
            this.gameState.currentTurn = this.gameState.currentTurn === 'thinking-traps' ? 'alternative-thoughts' : 'thinking-traps';
        }
        
        this.updateTurnIndicator();
        this.playSound('turnSwitch');
    }
    
    // Discard event cards that were used this turn
    discardUsedEventCards() {
        const eventCardsInBattle = this.battleZone.filter(card => card.isEventCard);
        
        eventCardsInBattle.forEach(eventCard => {
            // Apply ongoing effects for multi-turn event cards
            this.applyOngoingEventEffects(eventCard);
            
            // Decrease turns remaining
            if (eventCard.turnsRemaining > 0) {
                eventCard.turnsRemaining--;
                this.logGameEvent(`⏰ ${eventCard.name} effect continues (${eventCard.turnsRemaining} turns remaining)`);
            }
            
            // Only discard if turns are complete
            if (eventCard.turnsRemaining <= 0) {
                // Reverse the effects before discarding
                this.reverseEventCardEffects(eventCard);
                
                // Remove from battle zone
                const index = this.battleZone.indexOf(eventCard);
                if (index > -1) {
                    this.battleZone.splice(index, 1);
                }
                
                // Add to removed cards (discard pile)
                this.removedCards.push(eventCard);
                
                this.logGameEvent(`🗑️ ${eventCard.name} effect complete - discarded`);
            }
        });
    }

    // Apply ongoing effects for multi-turn event cards
    applyOngoingEventEffects(eventCard) {
        switch (eventCard.name) {
            case 'Social Media Storm':
                // Apply ongoing effects each turn
                this.logGameEvent(`⚡ Social Media Storm ongoing effect: Thinking Traps strengthened, Alternative Thoughts weakened`);
                break;
                
            case 'Distraction Overload':
                // Apply ongoing effects each turn
                this.logGameEvent(`⚡ Distraction Overload ongoing effect: Alternative Thoughts weakened`);
                break;
                
            case 'Rest & Recharge':
                // Apply ongoing effects each turn
                this.logGameEvent(`⚡ Rest & Recharge ongoing effect: Thinking Traps weakened, Alternative Thoughts strengthened`);
                break;
                
            case 'Friend Support':
                // Single turn effect, no ongoing
                break;
        }
    }

    // Reverse event card effects when they end
    reverseEventCardEffects(eventCard) {
        if (!this.eventCardEffects) return;
        
        // Find the effect data for this event card
        const effectKey = Object.keys(this.eventCardEffects).find(key => 
            this.eventCardEffects[key].eventCard.name === eventCard.name
        );
        
        if (!effectKey) return;
        
        const effectData = this.eventCardEffects[effectKey];
        
        switch (eventCard.name) {
            case 'Social Media Storm':
                // Reverse: Thinking Traps lose 25 HP, Alternative Thoughts gain 15 HP
                this.thinkingTrapsCards.forEach((card, index) => {
                    const originalHP = effectData.originalHPs[`thinking_${index}`];
                    if (originalHP !== undefined) {
                        card.hp = Math.max(0, card.hp - 25);
                    }
                });
                this.alternativeThoughtsCards.forEach((card, index) => {
                    const originalHP = effectData.originalHPs[`alternative_${index}`];
                    if (originalHP !== undefined) {
                        card.hp = Math.min(card.hp + 15, originalHP);
                    }
                });
                this.logGameEvent(`🔄 Social Media Storm effect reversed: Thinking Traps -25 HP, Alternative Thoughts +15 HP`);
                break;
                
            case 'Distraction Overload':
                // Reverse: Alternative Thoughts gain 20 HP
                this.alternativeThoughtsCards.forEach((card, index) => {
                    const originalHP = effectData.originalHPs[`alternative_${index}`];
                    if (originalHP !== undefined) {
                        card.hp = Math.min(card.hp + 20, originalHP);
                    }
                });
                this.logGameEvent(`🔄 Distraction Overload effect reversed: Alternative Thoughts +20 HP`);
                break;
                
            case 'Rest & Recharge':
                // Reverse: Thinking Traps gain 20 HP, Alternative Thoughts lose 10 HP
                this.thinkingTrapsCards.forEach((card, index) => {
                    const originalHP = effectData.originalHPs[`thinking_${index}`];
                    if (originalHP !== undefined) {
                        card.hp = Math.min(card.hp + 20, originalHP);
                    }
                });
                this.alternativeThoughtsCards.forEach((card, index) => {
                    const originalHP = effectData.originalHPs[`alternative_${index}`];
                    if (originalHP !== undefined) {
                        card.hp = Math.max(0, card.hp - 10);
                    }
                });
                
                // Reverse active card HP boost
                const activeCard = effectData.team === 'thinking-traps' ? this.thinkingTrapsActive : this.alternativeThoughtsActive;
                if (activeCard && effectData.originalHPs[`active_${effectData.team}`] !== undefined) {
                    activeCard.hp = Math.max(0, activeCard.hp - 20);
                }
                
                this.logGameEvent(`🔄 Rest & Recharge effect reversed: Thinking Traps +20 HP, Alternative Thoughts -10 HP`);
                break;
                
            case 'Friend Support':
                // Single turn effect, no reversal needed
                break;
        }
        
        // Clean up the effect data
        delete this.eventCardEffects[effectKey];
    }

    // End the game
    endGame(reason) {
        clearInterval(this.gameState.timer);
        this.gameState.gameStarted = false;
        
        let winner = '';
        let message = '';
        let icon = '🏆';
        
        if (this.selectedGameMode === 'tricky-tech') {
            if (reason === 'design-tricks') {
                winner = 'Design Tricks';
                message = '📱 Design Tricks win! Brain Health reached -100.';
                icon = '📱';
            } else if (reason === 'healthy-habits') {
                winner = 'Healthy Habits';
                message = '🌱 Healthy Habits win! Brain Health reached +100.';
                icon = '🌱';
            } else if (reason === 'time') {
                if (this.gameState.brainHealth < 0) {
                    winner = 'Design Tricks';
                    message = '📱 Design Tricks win! Time\'s up and they were closest to their goal.';
                    icon = '📱';
                } else {
                    winner = 'Healthy Habits';
                    message = '🌱 Healthy Habits win! Time\'s up and they were closest to their goal.';
                    icon = '🌱';
                }
            }
        } else {
            if (reason === 'thinking-traps') {
                winner = 'Thinking Traps';
                message = '🧠 Thinking Traps win! Brain Health reached -100.';
                icon = '🧠';
            } else if (reason === 'alternative-thoughts') {
                winner = 'Alternative Thoughts';
                message = '💡 Alternative Thoughts win! Brain Health reached +100.';
                icon = '💡';
            } else if (reason === 'time') {
                if (this.gameState.brainHealth < 0) {
                    winner = 'Thinking Traps';
                    message = '🧠 Thinking Traps win! Time\'s up and they were closest to their goal.';
                    icon = '🧠';
                } else {
                    winner = 'Alternative Thoughts';
                    message = '💡 Alternative Thoughts win! Time\'s up and they were closest to their goal.';
                    icon = '💡';
                }
            }
        }
        
        this.logGameEvent(`🏆 ${message}`);
        this.logGameEvent(`Game Over! ${winner} are the winners!`);
        
        // Show win modal
        this.showWinModal(winner, message, icon);
    }

    // Show win modal
    showWinModal(winner, message, icon) {
        const winModal = document.getElementById('winModal');
        const winIcon = document.getElementById('winIcon');
        const winTitle = document.getElementById('winTitle');
        const winMessage = document.getElementById('winMessage');
        
        if (winModal && winIcon && winTitle && winMessage) {
            winIcon.textContent = icon;
            winTitle.textContent = `${winner} Win!`;
            winMessage.textContent = message;
            
            // Show the modal
            winModal.style.display = 'block';
            this.playSound('modalOpen');
            
            // Add event listeners for buttons
            const playAgainBtn = document.getElementById('playAgainBtn');
            const backToMenuBtn = document.getElementById('backToMenuBtn');
            
            if (playAgainBtn) {
                playAgainBtn.onclick = () => {
                    winModal.style.display = 'none';
                    this.resetGame();
                    this.startGame();
                };
            }
            
            if (backToMenuBtn) {
                backToMenuBtn.onclick = () => {
                    winModal.style.display = 'none';
                    this.backToMenu();
                };
            }
        }
    }

    // Update the display
    updateDisplay() {
        console.log('=== UPDATE DISPLAY START ===');
        try {
            console.log('Updating brain health...');
            this.updateBrainHealth();
            console.log('Updating hands...');
            this.updateHands();
            console.log('Updating battle zone...');
            this.updateBattleZone();
            console.log('Updating active cards...');
            this.updateActiveCards();
            console.log('Updating event cards...');
            this.updateEventCards();
            console.log('Updating removed cards...');
            this.updateRemovedCards();
            console.log('Updating turn indicator...');
            this.updateTurnIndicator();
            console.log('=== UPDATE DISPLAY COMPLETE ===');
        } catch (error) {
            console.error('Error in updateDisplay:', error);
        }
    }

    // Update brain health display
    updateBrainHealth() {
        const health = this.gameState.brainHealth;
        document.getElementById('currentHealth').textContent = health;
        
        // Update health bar
        const percentage = ((health + 100) / 200) * 100;
        document.getElementById('healthFill').style.width = `${percentage}%`;
        
        // Update health marker position
        const markerPosition = ((health + 100) / 200) * 100;
        document.getElementById('healthMarker').style.left = `${markerPosition}%`;
        
        // Update health bar color based on value
        const healthBar = document.getElementById('healthFill');
        if (health < -50) {
            healthBar.style.background = '#e53e3e';
        } else if (health < 0) {
            healthBar.style.background = '#f6ad55';
        } else if (health < 50) {
            healthBar.style.background = '#48bb78';
        } else {
            healthBar.style.background = '#38a169';
        }
    }

    // Update hands display
    updateHands() {
        this.updateHand('thinkingTrapsHand', this.thinkingTrapsHand, 'thinking-trap');
        this.updateHand('alternativeThoughtsHand', this.alternativeThoughtsHand, 'alternative-thought');
    }

    // Update a specific hand
    updateHand(handId, cards, cardType) {
        console.log(`Updating hand: ${handId}, cardType: ${cardType}, cards length: ${cards.length}`);
        const handElement = document.getElementById(handId);
        if (!handElement) {
            console.error(`Hand element not found: ${handId}`);
            return;
        }
        handElement.innerHTML = '';
        
        // Filter out removed cards from the hand
        const availableCards = cards.filter(card => !this.removedCards.includes(card));
        console.log(`Available cards after filtering: ${availableCards.length}`);
        
        // Determine which team this hand belongs to
        const team = handId === 'thinkingTrapsHand' ? 'thinkingTraps' : 'alternativeThoughts';
        const state = this.carouselState[team];
        console.log(`Team: ${team}, carousel state:`, state);
        
        // Calculate which cards to show based on carousel position
        const startIndex = state.currentIndex;
        const endIndex = Math.min(startIndex + state.visibleCards, availableCards.length);
        const visibleCards = availableCards.slice(startIndex, endIndex);
        
        // Show only visible cards
        console.log(`Creating ${visibleCards.length} visible cards for ${handId}`);
        visibleCards.forEach((card, displayIndex) => {
            const actualIndex = startIndex + displayIndex;
            console.log(`Creating card element for: ${card.name}, index: ${actualIndex}`);
            const cardElement = this.createCardElement(card, actualIndex, cardType);
            handElement.appendChild(cardElement);
        });
        
        // Update carousel indicators
        console.log(`Updating carousel indicators for ${team}`);
        this.updateCarouselIndicators(team);
        
        // Update navigation button states
        console.log(`Updating carousel navigation for ${team}`);
        this.updateCarouselNavigation(team);
        console.log(`Hand update complete for ${handId}`);
    }

    // Update carousel navigation button states
    updateCarouselNavigation(team) {
        console.log(`updateCarouselNavigation called for team: ${team}`);
        const state = this.carouselState[team];
        console.log(`Got state for ${team}:`, state);
        const hand = team === 'thinkingTraps' ? this.thinkingTrapsHand : this.alternativeThoughtsHand;
        console.log(`Got hand for ${team}, length: ${hand.length}`);
        console.log(`Removed cards:`, this.removedCards);
        console.log(`About to filter hand...`);
        const availableCards = hand.filter(card => !this.removedCards.includes(card));
        console.log(`Filter complete! Available cards for navigation: ${availableCards.length}`);
        console.log(`State object:`, state);
        console.log(`Hand object:`, hand);
        console.log(`Available cards array:`, availableCards);
        
        console.log(`Looking for buttons: ${team}Prev, ${team}Next`);
        const prevButton = document.getElementById(`${team}Prev`);
        const nextButton = document.getElementById(`${team}Next`);
        console.log(`Buttons found - prev: ${!!prevButton}, next: ${!!nextButton}`);
        
        if (prevButton) {
            try {
                console.log(`Setting prev button disabled: ${state.currentIndex === 0}`);
                if (state.currentIndex === 0) {
                    prevButton.classList.add('disabled');
                    prevButton.style.pointerEvents = 'none';
                    prevButton.style.opacity = '0.5';
                } else {
                    prevButton.classList.remove('disabled');
                    prevButton.style.pointerEvents = 'auto';
                    prevButton.style.opacity = '1';
                }
                console.log(`Prev button disabled set successfully`);
            } catch (error) {
                console.error(`Error setting prev button disabled:`, error);
            }
        }
        
        if (nextButton) {
            try {
                console.log(`Setting next button disabled: ${state.currentIndex + state.visibleCards >= availableCards.length}`);
                if (state.currentIndex + state.visibleCards >= availableCards.length) {
                    nextButton.classList.add('disabled');
                    nextButton.style.pointerEvents = 'none';
                    nextButton.style.opacity = '0.5';
                } else {
                    nextButton.classList.remove('disabled');
                    nextButton.style.pointerEvents = 'auto';
                    nextButton.style.opacity = '1';
                }
                console.log(`Next button disabled set successfully`);
            } catch (error) {
                console.error(`Error setting next button disabled:`, error);
            }
        }
        console.log(`updateCarouselNavigation complete for ${team}`);
    }

    // Update battle zone
    updateBattleZone() {
        const zoneElement = document.getElementById('battleZone');
        zoneElement.innerHTML = '';
        
        this.battleZone.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index, card.type, false, true); // isBattleZone = true
            zoneElement.appendChild(cardElement);
        });
    }

    // Update active cards
    updateActiveCards() {
        this.updateActiveCard('thinkingTrapsActive', this.thinkingTrapsActive, 'thinking-trap');
        this.updateActiveCard('alternativeThoughtsActive', this.alternativeThoughtsActive, 'alternative-thought');
    }

    // Update a specific active card
    updateActiveCard(activeId, card, cardType) {
        const activeElement = document.getElementById(activeId);
        activeElement.innerHTML = '';
        
        if (card) {
            const cardElement = this.createCardElement(card, null, cardType, true);
            activeElement.appendChild(cardElement);
        } else {
            activeElement.innerHTML = '<div class="empty-slot">No active card</div>';
        }
    }

    // Update event cards
    updateEventCards() {
        const thinkingTrapsEventElement = document.getElementById('thinkingTrapsEvent');
        const alternativeThoughtsEventElement = document.getElementById('alternativeThoughtsEvent');
        
        console.log('Updating event cards:', {
            thinkingTraps: this.thinkingTrapsEventCards.length,
            alternativeThoughts: this.alternativeThoughtsEventCards.length,
            thinkingTrapsElement: !!thinkingTrapsEventElement,
            alternativeThoughtsElement: !!alternativeThoughtsEventElement
        });
        
        if (thinkingTrapsEventElement) {
            thinkingTrapsEventElement.textContent = `🎭 Event (${this.thinkingTrapsEventCards.length})`;
            thinkingTrapsEventElement.onclick = () => this.useEventCard(this.selectedGameMode === 'tricky-tech' ? 'design-tricks' : 'thinking-traps');
        }
        
        if (alternativeThoughtsEventElement) {
            alternativeThoughtsEventElement.textContent = `🎭 Event (${this.alternativeThoughtsEventCards.length})`;
            alternativeThoughtsEventElement.onclick = () => this.useEventCard(this.selectedGameMode === 'tricky-tech' ? 'healthy-habits' : 'alternative-thoughts');
        }
    }

    // Update removed cards display
    updateRemovedCards() {
        const removedCardsElement = document.getElementById('removedCards');
        if (!removedCardsElement) return;
        
        removedCardsElement.innerHTML = '';
        
        if (this.removedCards.length === 0) {
            removedCardsElement.innerHTML = '<div class="empty-slot">No cards removed yet</div>';
            return;
        }
        
        this.removedCards.forEach(card => {
            const cardElement = this.createCardElement(card, null, card.type, false);
            cardElement.style.opacity = '0.6';
            cardElement.style.cursor = 'default';
            removedCardsElement.appendChild(cardElement);
        });
    }

    // Update turn indicator
    updateTurnIndicator() {
        const indicator = document.getElementById('turnIndicator');
        indicator.className = 'turn-indicator';
        
        if (this.selectedGameMode === 'tricky-tech') {
            if (this.gameState.currentTurn === 'design-tricks') {
                indicator.classList.add('thinking-traps-turn'); // Reuse existing CSS class
                indicator.querySelector('.turn-text').textContent = '📱 Design Tricks\' Turn';
            } else {
                indicator.classList.add('alternative-thoughts-turn'); // Reuse existing CSS class
                indicator.querySelector('.turn-text').textContent = '🌱 Healthy Habits\' Turn';
            }
        } else {
            if (this.gameState.currentTurn === 'thinking-traps') {
                indicator.classList.add('thinking-traps-turn');
                indicator.querySelector('.turn-text').textContent = '🧠 Thinking Traps\' Turn';
            } else {
                indicator.classList.add('alternative-thoughts-turn');
                indicator.querySelector('.turn-text').textContent = '💡 Alternative Thoughts\' Turn';
            }
        }
    }

    // Create a card element
    createCardElement(card, index, cardType, isActive = false, isBattleZone = false) {
        const cardElement = document.createElement('div');
        
        // Handle event cards differently
        if (card.isEventCard) {
            cardElement.className = 'card event-card';
            cardElement.style.border = '3px solid #805ad5';
            cardElement.style.backgroundColor = '#f7fafc';
        } else {
            cardElement.className = `card ${cardType}`;
        }
        
        // Make cards draggable if they're in hand (not active) and not event cards
        // OR if they're in battle zone (not event cards)
        if (!isActive && !card.isEventCard && (index !== null || isBattleZone)) {
            cardElement.dataset.cardIndex = index;
            // Set team based on game mode
            if (this.selectedGameMode === 'tricky-tech') {
                cardElement.dataset.team = cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits';
            } else {
                cardElement.dataset.team = cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts';
            }
            cardElement.dataset.isBattleZone = isBattleZone ? 'true' : 'false';
            
            console.log('Created draggable card:', {
                name: card.name,
                index: index,
                team: cardElement.dataset.team,
                isBattleZone: isBattleZone,
                isActive: isActive,
                isEventCard: card.isEventCard
            });
            
            // Add a visual indicator that the card is draggable
            cardElement.style.cursor = 'grab';
            if (isBattleZone) {
                cardElement.title = `${card.description}\n\nDrag to active slot to replace current card`;
            } else {
                cardElement.title = `${card.description}\n\nDrag to play or click to play`;
            }
            
            console.log('Created draggable card:', {
                name: card.name,
                index: index,
                team: cardElement.dataset.team,
                isBattleZone: isBattleZone,
                element: cardElement
            });
        }
        
        // Create HP bubble
        const hpBubble = document.createElement('div');
        hpBubble.className = 'card-hp-bubble';
        hpBubble.textContent = card.hp;
        this.updateHPBubbleStyle(hpBubble, card.hp);
        
        // Handle event cards differently
        if (card.isEventCard) {
            // Event card display
            cardElement.innerHTML = `
                <div class="card-image">
                    <img src="${card.imagePath}" alt="${card.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="card-text-fallback" style="display: none;">
                        <div class="card-name">${card.name}</div>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-name">🎭 ${card.name}</div>
                    <div class="event-effect">Effect: ${card.effect > 0 ? '+' : ''}${card.effect} Brain Health</div>
                    <div class="event-status">${card.turnsRemaining > 0 ? `⏰ ${card.turnsRemaining} turns remaining` : '✅ Effect Complete'}</div>
                </div>
            `;
        } else {
            // Regular card display
            if (card.imagePath) {
                cardElement.innerHTML = `
                    <div class="card-image">
                        <img src="${card.imagePath}" alt="${card.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="card-text-fallback" style="display: none;">
                            <div class="card-name">${card.name}</div>
                        </div>
                    </div>
                    ${isActive ? `
                        <div class="card-moves">
                            ${card.moves.map((move, moveIndex) => `
                                <div class="move ${card.usedMoves && card.usedMoves.includes(moveIndex) ? 'used' : ''}" 
                                     onclick="game.useMove(${moveIndex}, '${this.selectedGameMode === 'tricky-tech' ? (cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits') : (cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts')}')">
                                    ${move.name}: ${move.damage > 0 ? '+' : ''}${move.damage}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="card-info">
                            <div class="card-name">${card.name}</div>
                        </div>
                    `}
                `;
            } else {
                // Fallback to text-only cards
                cardElement.innerHTML = `
                    <div class="card-name">${card.name}</div>
                    ${isActive ? `
                        <div class="card-moves">
                            ${card.moves.map((move, moveIndex) => `
                                <div class="move ${card.usedMoves && card.usedMoves.includes(moveIndex) ? 'used' : ''}" 
                                     onclick="game.useMove(${moveIndex}, '${this.selectedGameMode === 'tricky-tech' ? (cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits') : (cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts')}')">
                                    ${move.name}: ${move.damage > 0 ? '+' : ''}${move.damage}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                `;
            }
        }
        
        // Add HP bubble to card
        cardElement.appendChild(hpBubble);
        
        // Add click handlers
        if (!isActive && (index !== null || isBattleZone)) {
            // Single click for playing cards (only if not dragging)
            cardElement.onclick = (e) => {
                // Only handle click if we're not in the middle of a drag operation
                if (!this.dragState.isDragging) {
                    if (isBattleZone) {
                        this.playBattleZoneCard(card, this.selectedGameMode === 'tricky-tech' ? (cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits') : (cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts'));
                    } else {
                        this.playCard(index, this.selectedGameMode === 'tricky-tech' ? (cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits') : (cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts'));
                    }
                }
            };
            
            // Double click for playing cards (alternative to single click)
            cardElement.ondblclick = (e) => {
                e.preventDefault();
                if (!this.dragState.isDragging) {
                    if (isBattleZone) {
                        this.playBattleZoneCard(card, this.selectedGameMode === 'tricky-tech' ? (cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits') : (cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts'));
                    } else {
                        this.playCard(index, this.selectedGameMode === 'tricky-tech' ? (cardType === 'thinking-trap' ? 'design-tricks' : 'healthy-habits') : (cardType === 'thinking-trap' ? 'thinking-traps' : 'alternative-thoughts'));
                    }
                }
            };
        }

        // Add hover effect to show description
        cardElement.title = card.description;
        
        return cardElement;
    }
    
    // Update HP bubble style based on HP value
    updateHPBubbleStyle(bubble, hp) {
        bubble.textContent = hp;
        bubble.className = 'card-hp-bubble';
        
        if (hp <= 0) {
            bubble.classList.add('critical-hp');
        } else if (hp <= 30) {
            bubble.classList.add('low-hp');
        }
        // Cards with HP > 30 get default green styling
    }

    // Log game events
    logGameEvent(message) {
        const logElement = document.getElementById('gameLog');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        if (message.includes('🧠')) {
            logEntry.classList.add('thinking-trap');
        } else if (message.includes('💡')) {
            logEntry.classList.add('alternative-thought');
        }
        
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logElement.appendChild(logEntry);
        logElement.scrollTop = logElement.scrollHeight;
    }

    // Clear game log
    clearGameLog() {
        document.getElementById('gameLog').innerHTML = '';
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new BrainBattleGame();
});

