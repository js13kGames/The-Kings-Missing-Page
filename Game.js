class Game {

    actors = [];

    inventory = {};
    
    verb = 'Walk to';
    
    command = 'Walk to';   // Current constructed command, either full or partial
    
    thing = '';

    score = 0;

    itemsLeft = 0;

    // // TODO: Decide whether we need this, or whether everything will be in emojis.
    // itemIcons = {
    //     'tulip'         : '🌷',
    //     'rose'          : '🌹',
    //     'bouquet'       : '💐',
    //     'lipstick'      : '💄',
    //     'ticket'        : '🎟',
    //     'coconut'       : '🥥',
    //     'peanut'        : '🥜',
    //     'mask'          : '👹',
    //     'water pistol'  : '🔫',
    //     'candy'         : '🍬',
    //     'amulet'        : '🧿',
    //     'cheese'        : '🧀',
    //     'bank card'     : '💳',
    //     'cash'          : '💵',
    //     'map'           : '🗺',
    //     'compass'       : '🧭',
    //     'wastebasket'   : '🗑',
    //     'explosive'     : '🧨',
    //     'test tube'     : '🧪',
    //     'axe'           : '🪓',
    //     'pill'          : '💊',
    //     'syringe'       : '💉',
    //     'blood'         : '🩸',
    //     'briefcase'     : '💼', 
    //     'bricks'        : '🧱',
    //     'barrier'       : '🚧',
    //     'paperclip'      : '📎',
    //     'envelope'       : '✉',
    //     'letter'         : '📄',
    //     'bellhop'       : '🛎',
    //     'broom'          : '🧹',
    //     'crystal ball'  : '🔮',
    // };

    /**
     * The rooms map is essentially the game map.
     */
    rooms = [
        // Room type, room width, left crossing, left path, centre crossing, right path, right crossing
        // room 9 = special room for country side, but used in multiple places.
        // Room types:
        //  bit 0: 1 = has wall, 0 = no wall
        //  bit 1: 1 = tree row, 0 = no tree row
        //  bit 2: 1 = smaller trees, 0 = normal trees (if bit 1 is set)
        //  bit 3: 1 = big trees at bottom of screen, 0 = no big trees
        // Negative value for room applies to left/right path only. Negative means down, Position means up.

        // Main street north.
        [7, 4800,  5, 3, 2, 3, 6],

        // Main street south.
        [3, 4800, 9, 50, 1, 50, 10],

        // House row
        [7, 4800,  0, 1, 4, 1, 0],

        // Park, school, farm
        [2, 6720,  8, -5, 3, -6, 0, 7],

        // Church
        [7, 2880,  50, 0, 10, 4, 1],

        // Petrol station
        [7, 2880,  1, 4, 9, 0, 50], 

        // Castle gates
        [3, 960,   0, -4, 4, -4, 0, , 4],

        // Woods
        [10, 1440, 0, 0, 0, 0, 4],

        // Main street south east
        [3, 2880, 50, 0, 6, 50, 2],

        // Main street south west
        [3, 2880, 2, 50, 5, 0, 50], 
    ];

    props = [
        // Room#, type, name, content, width, height, x, y, radius override, z-index override, element reference
        // bit 0-1:  00 = actor, 01 = item, 10 = prop, 11 = not used.
        // bit 2:    0  = shadow, 1 = no shadow
        // bit 3:    0  = observe objs, 1 = ignore objs
        // bit 4:    0  = not building, 1 = building
        // bit 5-6:  00 = normal, 01 = light, 10 = dark
        // bit 7:    0 = normal, 1 = horizontal flip

        // Room 1 - Main street north
        [ 1,  30, 'office',            '🏢', 400, 400,   280,  700, , , 11 ],
        [ 1,   2, 'tree',              '🌴', 300, 300,   50,   825, 30 ],
        [ 1,   2, 'tree',              '🌴', 300, 300,   810,  825, 30 ],
        [ 1,   2, 'tree',              '🌴', 300, 300,   1770, 825, 30 ],
        [ 1,   2, 'tree',              '🌴', 300, 300,   2730, 825, 30 ],
        [ 1,   2, 'tree',              '🌴', 300, 300,   3690, 825, 30 ],
        [ 1,   2, 'ambulance',         '🚑', 200, 200,   1500, 950 ],
        [ 1,  30, 'hospital',          '🏥', 400, 400,   1240, 700, , , 12 ],
        [ 1,   2, 'police_car',        '🚓', 200, 200,   2000, 950 ],
        [ 1,   2, 'police_car',        '🚓', 200, 200,   2600, 950 ],
        [ 1,  30, 'courthouse',        '🏛',  400, 400,   2200, 700, , , 13 ],
        [ 1,  30, 'bank',              '🏦', 400, 400,   3160, 700, , , 14 ],
        [ 1,   2, 'lorry',             '🚛', 200, 200,   4040, 950 ],
        [ 1,   2, 'lorry',             '🚚', 200, 200,   4460, 950 ],
        [ 1,  30, 'building_site',     '🏗',  400, 400,   4120, 700, , , 15 ],

        // Room 11 - In office
        [ 11,  0, 'office_worker',     '👨‍💼', 200, 150, 380, 450, , 1002 ],
        [ 11,  1, 'ticket',            '🎟', 40,  40,  380, 670, , 1002 ],

        // Room 12 - In hospital
        [ 12,  0, 'doctor',            '👩‍⚕️', 200, 150, 1340, 450, , 1002 ],
        [ 12,  1, 'wastebasket',       '🗑', 40,  40,  1340, 670, , 1002 ],

        // Room 13 - In courthouse
        [ 13,  0, 'judge',             '👩‍⚖️', 200, 150, 2300, 450, , 1002 ],

        // Room 14 - In bank
        [ 14,  0, 'bank_teller',       '👩‍💼', 200, 150, 3260, 450, , 1002 ],
        [ 14,  1, 'cash',              '💵', 40,  40, 3260,  670, , 1002 ],

        // Room 15 - In building site
        [ 15,  0, 'builder',           '👷', 200, 150, 4220, 450, , 1002 ],
        [ 15,  1, 'explosive',         '🧨', 40,  40,  4220, 670, , 1002 ],

        // Room 2 - Main street south
        [ 2,  2, 'tree',               '🌴', 300, 300,   50,    825, 30 ],
        [ 2,  2, 'tree',               '🌴', 300, 300,   810,   825, 30 ],
        [ 2,  2, 'tree',               '🌴', 300, 300,   1770,  825, 30 ],
        [ 2,  2, 'tree',               '🌴', 300, 300,   2730,  825, 30 ],
        [ 2,  2, 'tree',               '🌴', 300, 300,   3690,  825, 30 ],
        [ 2, 30, 'department_store',   '🏬', 400, 400,   280,   700, , , 16 ],
        [ 2,  1, 'shopping_cart',      '🛒', 100, 100,   720,   650 ],
        [ 2, 30, 'store',              '🏪', 400, 400,   1240,  700, , , 17 ],
        [ 2, 30, 'post_office',        '🏤', 400, 400,   2200,  700, , , 18 ],
        [ 2, 30, 'hotel',              '🏨', 400, 400,   3160,  700, , , 19 ],
        [ 2, 30, 'house',              '🏠', 400, 400,   4120,  700, , , 20 ],

        // Room 16 - In department store
        [ 16, 0, 'salesperson',        '🙎‍♂️', 200, 150,   380,   450, , 1002 ], 
        [ 16, 1, 'map',                '🗺', 40,  40,    380,   670, , 1002 ],
        [ 16, 1, 'compass',            '🧭', 40,  40,    455,   670, , 1002 ],

        // Room 17 - In store
        [ 17, 0, 'cashier',            '🧕', 200, 150,   1340,  450, , 1002 ],
        [ 17, 1, 'cheese',             '🧀', 40,  40,    1340,  670, , 1002 ], 

        // Room 18 - In post office
        [ 18, 0, 'selfservice',        '🖥',  200, 150,   2300,  450, , 1002 ], 

        // Room 19 - In hotel
        [ 19, 0, 'hotel_clerk',        '🤵', 200,  150,   3260,  450, , 1002 ], 
        [ 19, 1, 'bellhop',            '🛎',  40,  40,    3260,  670, , 1002 ],

        // Room 3 - House row
        [ 3, 30, 'house',              '🏠', 400, 400,   330, 700, , , 20 ],
        [ 3,  2, 'tree',               '🌲', 300, 300,   80, 825 ],
        [ 3,  2, 'tree',               '🌳', 300, 300,   810, 650 ],
        [ 3,  2, 'tree',               '🌳', 300, 300,   1770, 650 ],
        [ 3,  2, 'tree',               '🌳', 300, 300,   2730, 650 ],
        [ 3,  2, 'tree',               '🌲', 300, 300,   3690, 650 ],
        [ 3,  2, 'car',                '🚙', 200, 200,   800, 950 ],
        [ 3, 30, 'house',              '🏡', 400, 400,   1240, 700, , , 20 ],
        [ 3,  1, 'tulip',              '🌷', 30,  30,    1190, 680 ],
        [ 3,  2, 'car',                '🚗', 200, 200,   1900, 950 ],
        [ 3,  2, 'minivan',            '🚐', 200, 200,   3000, 950 ],
        [ 3,  2, 'jack-o-lantern',     '🎃', 50,  50,    2140, 690 ],
        [ 3, 30, 'halloween_house',    '🏠', 400, 400,   2200, 700, , , 21 ],
        [ 3,  2, 'jack-o-lantern',     '🎃', 50,  50,    2610, 690 ],
        [ 3, 30, 'house',              '🏡', 400, 400,   3160, 700, , , 20 ],
        [ 3,  1, 'rose',               '🌹',  30, 30,     3600, 680 ],
        [ 3,  2, 'scooter',            '🛵', 150, 150,   4460, 950 ],
        [ 3, 30, 'house',              '🏠', 400, 400,   4120, 700, , , 20 ],
        
        // Room 21 - In halloween house
        [ 21, 0, 'family',             '👨‍👩‍👦', 200, 150,  2300, 450, , 1002 ],
        [ 21, 1, 'candy',              '🍬', 40,  40,   2300, 670, , 1002 ],

        // Room 4 - Park, school, farm
        [ 4,  14, 'woods',              null, 300, 300,   -50, 650 ],
        [ 4,   2, 'tree',              '🌲', 300, 300,   -150, 650 ],
        [ 4,   2, 'tree',              '🌲', 300, 300,   350, 600 ],
        [ 4,  66, 'tree',              '🌲', 300, 300,   150, 550 ],
        [ 4, 130, 'elephant',          '🐘', 200, 200,   875, 600 ],
        [ 4,  30, 'circus',            '🎪', 400, 400,   1240, 650, , , 22 ],
        [ 4,   2, 'fountain',          '⛲', 200, 200,   2300, 550 ],
        [ 4,  14, 'mountain',          '⛰',  350, 350,   3160, 350, , 99 ],
        [ 4,  14, 'castle_path',       null,  300, 300,   3160, 700, , 100 ],
        [ 4,   2, 'bus',               '🚌', 250, 250,   4900, 950 ],
        [ 4,   2, 'bus_stop',          '🚏',  50, 200,    4800, 825 ],
        [ 4,   1, 'briefcase',         '💼', 40, 40,     4790, 820 ],
        [ 4,   2, 'bicyle',            '🚲', 100, 100,   4450, 600 ],
        [ 4,   2, 'bicyle',            '🚲', 100, 100,   4500, 650 ],
        [ 4,   2, 'goal_net',          '🥅', 100, 100,   4200, 500 ],
        [ 4,   2, 'moai_statue',       '🗿',  100, 200,   3500, 650 ],
        [ 4, 130, 'moai_statue',       '🗿',  100, 200,   3025, 650 ],
        [ 4,  30, 'school',            '🏫', 400, 400,   5080, 700, , , 23 ],
        [ 4,   2, 'tractor',           '🚜', 200, 200,   5900, 950 ],
        [ 4,  30, 'barn',              '🏚',  400, 400,   6100, 540, , , 24 ],
        [ 4,   2, 'cow',               '🐄', 100, 100,   5800, 500 ],
        [ 4,   2, 'cow',               '🐄', 100, 100,   6500, 500 ],
        [ 4,   2, 'sheep',             '🐏', 100, 100,   6000, 620 ],
        [ 4,   2, 'sheep',             '🐑', 100, 100,   6350, 620 ],
        [ 4,   2, 'sheep',             '🐑', 100, 100,   5600, 560 ],

        // Room 22 - In cirus
        [ 22, 0, 'clown',              '🤡', 200, 150,   1340, 450, , 1002 ],
        [ 22, 1, 'mask',               '👹', 40,  40,    1340, 670, , 1002 ],

        // Room 23 - In school
        [ 23, 0, 'scientist',          '👩‍🔬', 200, 150,   5180, 450, , 1002 ], 

        // Room 24 - In barn
        [ 24, 0, 'farmer',             '👨‍🌾', 200, 150,   6200, 450, , 1002 ], 

        // Room 5 - Church
        [ 5,   2, 'tree',              '🌴', 300, 300,   50,   825, 30 ],
        [ 5,   2, 'tree',              '🌴', 300, 300,   810,  825, 30 ],
        [ 5,   2, 'tree',              '🌴', 300, 300,   1770, 825, 30 ],
        [ 5,   2, 'tree',              '🌴', 300, 300,   2730, 825, 30 ],
        [ 5,  30, 'church',            '⛪', 350, 350,   1240, 700, , , 25 ],
        [ 5,   2, 'car',               '🚙', 200, 200,   2100, 950 ],
        [ 5,  30, 'house',             '🏠', 400, 400,   2200, 700, , , 20 ],

        // Room 25 - In church
        [ 25, 0, 'bride',              '👰', 200, 150,   1340, 450, , 1002 ],
        [ 25, 1, 'lipstick',           '💄', 40,   40,    1340, 670, , 1002 ],

        // Room 6 - Petrol station
        [ 6,   2, 'pump',              '⛽', 120, 120,   150,  825 ],
        [ 6,   2, 'pump',              '⛽', 120, 120,   620,  825 ],
        [ 6,   2, 'pump',              '⛽', 120, 120,   1090, 825 ],
        [ 6,  30, 'factory',           '🏭', 350, 350,   350,  600, , 499, 26 ],
        [ 6,  30, 'factory',           '🏭', 350, 350,   800,  600, , 499, 26 ],
        [ 6,   6, 'oil_drum',          '🛢', 100, 100,   600,  680 ],
        [ 6,   6, 'oil_drum',          '🛢', 100, 100,   710,  680 ],
        [ 6,   6, 'oil_drum',          '🛢', 100, 100,   820,  680 ],
        [ 6,   6, 'oil_drum',          '🛢', 100, 100,   930,  680 ],
        [ 6,   2, 'car',               '🚙', 200, 200,  350,   950 ],
        [ 6,  30, 'garage',            '🏚', 400, 400,   1240,  700, , , 27 ],

        // Room 26 - In factory
        [ 26,  0, 'factory_worker',    '👨‍🏭', 200, 150,  450,  450, , 1002 ],

        // Room 27 - In garage
        [ 27,  0, 'mechanic',          '👩‍🔧', 200, 150,  1340, 450, , 1002 ],

        // Room 7 - Castle gates
        [ 7,  30, 'castle',            '🏰', 600, 600,   180,  620, , , 28 ],
        [ 7,   2, 'tree',              '🌲', 300, 300,   -150, 650 ],
        [ 7,   2, 'tree',              '🌲', 300, 300,   810,  650 ],

        // Room 28 - In castle
        [ 28,  0, 'guard',             '💂', 200, 150,   280, 450, , 1004 ],

        // Room 8 - Woods
        [ 8,  22, 'coffin',            '⚰', 100, 100,   180,  660, , , 29 ],
        [ 8,   2, 'tree',              '🌲', 300, 300,   -150, 650 ],
        [ 8,   2, 'tree',              '🌲', 300, 300,   350,  650 ],
        [ 8,  66, 'tree',              '🌲', 300, 300,   250,  550 ],
        [ 8,   2, 'tree',              '🌲', 350, 350,   -150, 850 ],
        [ 8,   2, 'tree',              '🌳', 400, 400,   800,  600 ],
        [ 8,  18, 'door',              '🚪', 100, 200,   1250, 500, , , 30 ],

        // Room 29 - In coffin
        [ 29, 0, 'vampire',            '🧛', 200, 150,   280,  450, , 1002 ],

        // Room 30 - In wizard's house
        [ 30, 0, 'wizard',             '🧙', 200, 150,   1350, 450, , 1002 ],
        [ 30, 1, 'crystal_ball',       '🔮', 40,  40,    1350, 670, , 1002 ],

        // Room 9 - Main street south east
        [ 9,   2, 'tree',              '🌴', 300, 300,   50,   825, 30 ],
        [ 9,   2, 'tree',              '🌴', 300, 300,   810,  825, 30 ],
        [ 9,   2, 'tree',              '🌴', 300, 300,   1770, 825, 30 ],
        [ 9,   2, 'mailbox',           '📫', 80, 80,     1150, 680 ],
        [ 9,  30, 'my_house',          '🏠', 400, 400,   1240, 700, , , 31 ],
        [ 9,  30, 'house',             '🏡', 400, 400,   2200, 700, , , 20 ],

        // Room 31 - In my house
        [ 31,  1, 'bank_card',         '💳', 40, 40,   1340, 670, , 1002 ],

        // Room 10 - Main street south west
        [ 10,  2, 'tree',              '🌴', 300, 300,   50,   825, 30 ],
        [ 10,  2, 'tree',              '🌴', 300, 300,   810,  825, 30 ],
        [ 10,  2, 'tree',              '🌴', 300, 300,   1770, 825, 30 ],
        [ 10,  1, 'coconut',           '🥥', 30, 30,     2000, 825 ],
        [ 10, 30, 'house',             '🏡', 400, 400,   280,  700, , , 20 ],
        [ 10, 30, 'derelict_house',    '🏚',  400, 400,   1240, 700, , , 20 ],

        // Room 50 - Countryside
        // No items. Ego just walks back into the previous room, as there is nothing in that direction.

        // Room 0 - All rooms
        [ 0,  14, 'wall',               null, 6720,  114, 0,    620, , 500 ],
        [ 0,  14, 'road',               null, 6720,  50,  0,    985, , 100 ],
        [ 0,  14, 'left_path',          null, 200,   305, null, 866, , 501 ],
        [ 0,  14, 'right_path',         null, 200,   305, null, 866, , 501 ],
        [ 0,  14, 'cloud',              '☁', 200,    50, 50,   130 ],
        [ 0,  14, 'cloud',              '☁', 200,    50, 450,  130 ],

    ];

    // 1 = mailbox open
    // 2 = water pistol filled
    flags = [];

    _gameOver = true;

    inputEnabled = false;

    /**
     * Constructor for Game.
     */
    constructor() {
        this.screen = document.getElementById('screen');
        this.wrap = document.getElementById('wrap');
        this.overlay = document.getElementById('overlay');
        this.scoreEl = document.getElementById('score');
        this.items = document.getElementById('itemlist');
        this.sentence = document.getElementById('sentence');
        this.commands = document.getElementById('commands');
        this.msg = document.getElementById('msg');
        this.defineCustomElements();
        this.userInput = new UserInput(this, screen);
        this.logic = new Logic(this);
        this.sound = new Sound();
        this.emojiMap = new Map();
        this.unicodeVersion = this.detectEmojiVersion();
        console.log('UNICODE VERSION: ' + this.unicodeVersion);
        this.start();
    }

    /**
     * Detects what Emoji Unicode version is available by default.
     */
    detectEmojiVersion() {
        // These chars are from different Unicode version, starting at 6.
        return [...'🐄🙂🧀🥕🧛🧪🪓🛖'].reduce((a, c) =>  a + (Util.renderEmoji(c, 50, 50)[2]? 1 : 0), 5);
    }

    /**
     * Defines the custom HTML elements that we use in the game.
     */
    defineCustomElements() {
        customElements.define('x-sprite', Sprite);
        customElements.define('x-ego', Ego);
        customElements.define('x-shadow', class Shadow extends HTMLElement {});
        customElements.define('x-wall', class Shadow extends HTMLElement {});
    }

    /**
     * Starts the game.
     */
    start() {
        this.resizeScreen();
        window.onresize = e => this.resizeScreen(e);

        this.userInput.enableInput();

        // Register click event listeners for item list arrow buttons.
        document.getElementById("up").onclick = e => this.scrollInv(1);
        document.getElementById("down").onclick = e => this.scrollInv(-1);

        this.commands.querySelectorAll('*').forEach(verb => {
            verb.onclick = e => this.command = this.verb = e.target.dataset.name;
        });

        // The sound generation might be a bit time consuming on slower machines.
        // TODO: Fix how sound is initialised.
        setTimeout(() => this.sound.init(), 1);

        // Initalise the mouse cursor.
        // TODO: Build the hour glass emoji for wait moments.
        let cursorImgUrl = Util.renderEmoji('➕', 20, 20)[0].toDataURL();
        document.body.style.cursor = `url(${cursorImgUrl}) 10 10, auto`;

        this.gameOver();
    }

    /**
     * @param {string} msg The message to display, optional.
     */
    gameOver(msg) {
        this.fadeOut(this.wrap);
        if (msg) {
          this.msg.innerHTML = msg;
        }
        window.onclick = e => {
            this.fadeOut(this.msg);
            setTimeout(() => this.msg.style.display = 'none', 200);
            setTimeout(() => {
                this.sound.play('music');
                this.init();
                this.loop();
            }, 500);
        }
    }

    /**
     * Initialised the parts of the game that need initialising on both
     * the initial start and then subsequent restarts. 
     */
    init() {
        this._gameOver = false;
        this.inputEnabled = true;
        
        window.onclick = null;

        this.screen.onclick = e => this.processCommand(e);
  
        // For restarts, we'll need to remove the objects from the screen.
        if (this.objs) {
            this.obj.forEach(obj => obj.remove());
        }
        
        // Set the room back to the start, and clear the object map.
        this.objs = [];
        this.room = 3;//9;//10;//7;//6;//1; //4; //7; //6;//1; // 4; //6; //1;

        // Create Ego (the main character) and add it to the screen.
        this.ego = document.createElement('x-ego');
        this.ego.init(this, 50, 150);
        this.ego.setPosition(350, 0, 750);
        this.ego.nesw = 1;
        this.ego.id = 'me';
        this.screen.appendChild(this.ego);
  
        // Enter the starting room.
        this.newRoom();
        
        // Fade in the whole screen at the start.
        this.fadeIn(this.wrap);
    }

    /**
     * Adds a Sprite to the game.
     * 
     * @param {Sprite} obj The Sprite to add to the game.
     */
    add(obj) {
        this.screen.appendChild(obj);
        this.objs.push(obj);
    }

    /**
     * Removes a Sprite from the game.
     * 
     * @param {Sprite} obj  The Sprite to remove from the game.
     */
    remove(obj) {
        // Remove the Sprite from the screen.
        try {
            this.screen.removeChild(obj);
        } catch (e) {
            // Ignore. We don't care if it has already been removed.
        }

        // Remove the Sprite from our list of managed objects.
        this.objs = this.objs.filter(o => o !== obj);
    }

    /**
     * Scales the screen div to fit the whole screen.
     * 
     * @param {UIEvent} e The resize event.
     */
    resizeScreen(e) {
        this.scaleX = window.innerWidth / this.wrap.offsetWidth;
        this.scaleY = window.innerHeight / this.wrap.offsetHeight;
        this.wrap.style.setProperty('--scale-x', this.scaleX);
        this.wrap.style.setProperty('--scale-y', this.scaleY);
    }

    /**
     * This is the main game loop, in theory executed on every animation frame.
     *
     * @param {number} now Time. The delta of this value is used to calculate the movements of Sprites.
     */
    loop(now) {
        // Immediately request another invocation on the next.
        requestAnimationFrame(now => this.loop(now));

        // Calculates the time since the last invocation of the game loop.
        this.updateDelta(now);

        // Update all objects on the screen.
        this.updateObjects();

        // Update sentence.
        let newSentence = (this._gameOver? 'Game Over' : this.command + ' ' + this.thing);
        if (newSentence != this.lastSentence) {
            this.sentence.innerHTML = this.lastSentence = newSentence;
        }

        // Adjust screen left to account for scrolling.
        if (this.ego.isVisible()) {
            let newScreenLeft = this.ego.cx - (960 / 2);
            if (newScreenLeft < 0) newScreenLeft = 0;
            if (newScreenLeft > (this.roomData[1] - 960)) newScreenLeft = (this.roomData[1] - 960);

            if (newScreenLeft != this.screenLeft) {
                this.screenLeft = newScreenLeft;
                this.screen.style.setProperty('--screen-left', `-${this.screenLeft}px`);
            }
        }

        //this.userInput.processUserInput(this.ego);

        // If after updating all objects, the room that Ego says it is in is different
        // than what it was previously in, then we trigger entry in to the new room.
        if (this.ego.edge) {
            this.edge = this.ego.edge;
            if (this.room == this.ego.room) {
                // No room change.
                this.ego.say("I didn't find much in that direction.", 200);
            } else {
                this.room = this.ego.room;
                this.fadeOut(this.wrap);
                setTimeout(() => this.newRoom(), 200);
            }
            this.ego.edge = 0;
        }

        // Update cursor and overlay based on user input state.
        this.overlay.style.display = (this.inputEnabled? 'none' : 'block');
        //this.wrap.style.cursor = (this.inputEnabled? 'crosshair' : 'wait');
    }

    /**
     * Updates the delta, which is the difference between the last time and now. Both values
     * are provided by the requestAnimationFrame call to the game loop. The last time is the
     * value from the previous frame, and now is the value for the current frame. The difference
     * between them is the delta, which is the time between the two frames.
     * 
     * @param {number} now The current time provided in the invocation of the game loop.
     */
    updateDelta(now) {
        if (now) {
            this.delta = now - (this.lastTime ? this.lastTime : (now - 16));
            this.stepFactor = this.delta * 0.06;
            this.lastTime = now;
        }
    }

    /**
     * The main method invoked on every animation frame when the game is unpaused. It 
     * interates through all of the Sprites and invokes their update method. The update
     * method will invoke the move method if the calculated position has changed. This
     * method then tests if the Sprite is touching another Sprite. If it is, it invokes
     * the hit method on both Sprites. 
     */
    updateObjects() {
        let objsLen = this.objs.length;

        // Iterate over all of the Sprites in the current room, invoking update on each on.
        for (let i=-1, a1=this.ego; i < objsLen; a1 = this.objs[++i]) {
            if (a1) {
                a1.update();

                // Check if the Sprite is touching another Sprite.
                for (let j = i + 1; j < objsLen; j++) {
                    let a2 = this.objs[j];
                    if (a2 && a1.touching(a2)) {
                        // If it is touching, then invoke hit on both Sprites. They might take 
                        // different actions in response to the hit.
                        a1.hit(a2);
                        a2.hit(a1);
                    }
                }

                // Clears the Sprite's moved flag, which is only of use to the hit method.
                a1.moved = false;
            }
        }
    }

    /**
     * Adds the given points to the current score.
     * 
     * @param {number} points The number of points to increment the score by.
     */
    addToScore(points) {
        this.score += points;
        this.scoreEl.innerHTML = '' + this.score + ' of 135';
    }
      
    /**
     * Processes the current user interaction.
     * 
     * @param {MouseEvent} e The mouse event that trigger the command to process.
     */
    processCommand(e) {
        if (this.inputEnabled && !this._gameOver) {
          this.command = this.logic.process(this.verb, this.command, this.thing, e);
          if (this.command == this.verb) {
            this.command = this.verb = 'Walk to';
          }
        }
        if (e) e.stopPropagation();
    }

    /**
     * Invoked when Ego is entering a room.  
     */
    newRoom() {
        console.time('newRoom');

        // Remove the previous room's Objs from the screen.
        this.objs.forEach(obj => obj.remove());
        this.objs = [];

        this.roomData = this.rooms[this.room - 1];

        // Adjust the screen width for the new room.
        this.screen.style.setProperty('--screen-width', `${this.roomData[1]}px`);

        // Add props
        console.time("addProps");
        this.props.forEach(prop => {
            // If prop is in the current room, or in room 0 (i.e. all rooms)...
            if ((prop[0] == this.room) || (prop[0] == 0)) this.addPropToRoom(prop);
        });
        console.timeEnd("addProps");

        // Add tree row, if required.
        // TODO: Do we need to create the Sprite every time?
        if (this.roomData[0] & 2) {
            console.time('buildTrees');
            let treeSize = this.roomData[0] & 4? 100 : 200;
            for (let x=0; x < this.roomData[1]; x += treeSize) {
                this.addPropToRoom([ 0, 0x42, 'trees', '🌲', treeSize, treeSize, x, 400 ]);
            }
            for (let x=-treeSize/2; x < this.roomData[1]; x += treeSize) {
                this.addPropToRoom([ 0, 2, 'trees', '🌲', treeSize, treeSize, x, 450 ]);
            }
            console.timeEnd('buildTrees');
        }
        if (this.roomData[0] & 8) {
            for (let x=0; x < this.roomData[1]; x += 300) {
                this.addPropToRoom([ 0, 0x42, 'trees', '🌲', 300, 300, x, 1100 ]);
            }
            for (let x=-150; x < this.roomData[1]; x += 300) {
                this.addPropToRoom([ 0, 2, 'trees', '🌲', 300, 300, x, 1150 ]);
            }
        }

        if (this.edge == 3) {
            let e = this.ego;
            let bo = this.objs.find(o => e.touching(o));
            if (bo) {
                // Ego is touching a car...
                // TODO: We could make this a death scenario, e.g. car just started moving.
                // Move Ego to either the left or right, depending on which is closer.
                e.setPosition(e.cx < bo.cx? bo.x - e.width - 20 : bo.x + bo.width + 20, 0, e.z);
                // Adjust the destination to match the new X position.
                e.dests[0].x = e.x;
            }
        }

        this.fadeIn(this.wrap);
        this.ego.show();
        this.fadeIn(this.ego);

        console.timeEnd('newRoom');
    }

    /**
     * Adds the given prop to the current room screen.
     * 
     * @param {Array} prop 
     */
    addPropToRoom(prop) {
        console.time('addProp_'+prop[2]);

        // Room type, room width, left, left path, road crossing, right path, right

        // We only add the wall if the room type says there is one.
        if (((prop[2] == 'wall') && !(this.roomData[0] & 0x01)) || 
            ((prop[2] == 'left_path') && !this.roomData[3]) || 
            ((prop[2] == 'right_path') && !this.roomData[5])) {
            return;
        }

        // We cache the obj when it isn't in the dom rather than recreate. It might remember it's state.
        let obj = prop[11];

        // Room#, type, name, content, width, height, x, y, radius override, z-index override, element reference
        // bit 0-1:  00 = actor, 01 = item, 10 = prop, 11 = not used.
        // bit 2:    0  = shadow, 1 = no shadow
        // bit 3:    0  = observe objs, 1 = ignore objs
        // bit 4:    0  = not building, 1 = building
        // bit 5-6:  00 = normal, 01 = light, 10 = dark
        // bit 7:    0 = normal, 1 = horizontal flip

        if (!obj) {
            obj = new Sprite();
            obj.init(this, prop[4], prop[5], prop[3], !(prop[1] & 4), (prop[1] & 128));

            obj.dataset.name = prop[2]?.replace('_',' ');
            obj.classList.add(prop[2]);

            obj.propData = prop;

            if (prop[6] !== null) {
                obj.setPosition(prop[6], 0, prop[7]);
            }

            if (prop[1] & 32) {
                obj.classList.add('light');
            }
            if (prop[1] & 64) {
                obj.classList.add('dark');
            }
            if (prop[1] & 8) {
                // Ignore objs
                obj.ignore = true;
            }
            if (prop[8]) {
                obj.radius = prop[8];
            }
            if (prop[9]) {
                obj.style.zIndex = prop[9];
            }

            prop[11] = obj;
        }

        // For the paths, update down class for if path is going down (instead of up).
        if (prop[2].includes('path')) {
            obj.classList.remove('down');
            if (this.roomData[3] < 0) {
                obj.classList.add('down');
            }
        }

        // If it is an actor, store a reference to ease of use.
        if (!prop[1]) this.actor = obj;

        this.add(obj);

        this.addObjEventListeners(obj);

        console.timeEnd('addProp_'+prop[2]);
    }

    /**
     * Adds the necessarily event listens to the given element to allow it to be 
     * interacted with as an object in the current room.
     * 
     * @param {HTMLElement} elem The HTMLElement to add the object event listeners to.
     */
    addObjEventListeners(elem) {
        // It is important that we don't use addEventListener in this case. We need to overwrite
        // the event handler on entering each room.
        elem.onmouseleave = e => this.thing = '';
        elem.onclick = e => this.processCommand(e);
        elem.onmousemove = e => this.objMouseMove(e);
    }

    // /**
    //  * Handles a mouse leave event.
    //  * 
    //  * @param {MouseEvent} e 
    //  */
    // objMouseLeave(e) {
    //     this.thing = '';
    // }

    // /**
    //  * Handles a mouse click event.
    //  * 
    //  * @param {MouseEvent} e 
    //  */
    // objClicked(e) {
    //     this.processCommand(e);
    // }
    
    // TODO: Experimenting with testing pixels for transparency.
    objMouseMove(e) {
        let target = e.currentTarget;
        //let name = target.dataset.name? target.dataset.name : target.id;
        if (target.canvas) {
            let rect = target.getBoundingClientRect(); 
            let x = ~~((e.clientX - rect.left) / this.scaleX);
            let y = ~~((e.clientY - rect.top) / this.scaleY);
            let { width, height } = target;
            let ctx = target.canvas.getContext('2d');
            let imgData = ctx.getImageData(0, 0, width, height);

            // Pixel is transparent, so get sprite underneath.
            if (!imgData.data[(y * (width << 2)) + (x << 2) +3]) {
                let elements = document.elementsFromPoint(e.clientX, e.clientY).filter(s => s instanceof Sprite);
                target = elements[1]? elements[1] : null;
            }
        }
        this.thing = target? (target.dataset.name? target.dataset.name : target.id).replace('_',' ') : '';
    }

    /**
     * Adds the given item to the inventory.
     * 
     * @param {string} name The name of the item to add to the inventory.
     */
    getItem(name, icon) {
        let item = document.createElement('span');
        item.dataset.name = name;
        this.items.appendChild(item);
        this.addObjEventListeners(item);
        this.inventory[name] = item;
        let obj = this.objs.find(i => i.dataset['name'] == name);
        if (obj) {
            obj.propData[0] = -1;
            this.remove(obj);
            item.innerHTML = obj.propData[3];
        } else {
            item.innerHTML = icon;
        }
    }

    /**
     * Checks if the given item is in the inventory.
     * 
     * @param {string} name The name of the item to check is in the inventory.
     */
    hasItem(name) {
        return this.inventory.hasOwnProperty(name);
    }

    /**
     * Removes the given item from the inventory.
     * 
     * @param {string} name The name of the item to drop.
     */
    dropItem(name) {
        let item = this.inventory[name];
        this.items.removeChild(item);
        delete this.inventory[name];
    }

    /**
     * Handles scrolling of the inventory list.
     * 
     * @param {number} dir The direction to scroll the inventory.
     */
    scrollInv(dir) {
        let newLeft = this.itemsLeft + (77 * dir);
        let invCount = this.items.children.length;
        if ((newLeft <= 0) && (newLeft >= -((invCount - 6) * 77))) {
            this.itemsLeft = newLeft;
            this.items.style.left = this.itemsLeft + 'px';
        }
    }

    /**
     * Fades in the given DOM Element.
     * 
     * @param {HTMLElement} elem The DOM Element to fade in.
     */
    fadeIn(elem) {
        // Remove any previous transition.
        elem.style.transition = 'opacity 0.5s';
        elem.style.opacity = 1.0;
        // This is so that other css styles can set transitions on the element
        // while we're not fading in.
        setTimeout(() => elem.style.removeProperty('transition'), 700);
    }

    /**
     * Fades out the given DOM Element.
     * 
     * @param {HTMLElement} elem The DOM Element to fade out.
     */
    fadeOut(elem) {
        elem.style.transition = 'opacity 0.5s';
        elem.style.opacity = 0.0;
    }
}