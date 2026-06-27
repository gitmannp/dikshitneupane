document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year in Footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Drawer Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileNavToggle && mobileMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileNavToggle.classList.toggle('active');
            
            // Toggle hamburger icon animation states
            const bars = mobileNavToggle.querySelectorAll('.bar');
            if (mobileMenu.classList.contains('open')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close drawer menu on click of any mobile navigation link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileNavToggle.classList.remove('active');
                const bars = mobileNavToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // 3. Navbar scroll styling
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // 5. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // reveal only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Interactive Terminal Logic
    const terminalInput = document.getElementById('terminal-input');
    const terminalCursor = document.getElementById('terminal-cursor');
    const terminalBody = document.getElementById('terminal-body');
    const terminalTime = document.getElementById('terminal-time');
    
    // Set initial clock
    if (terminalTime) {
        const updateTime = () => {
            const now = new Date();
            terminalTime.textContent = now.toTimeString().split(' ')[0];
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Command database
    const commands = {
        help: `Available commands:
  - <span class="term-highlight">about</span>      : Display information about Dikshit Neupane
  - <span class="term-highlight">skills</span>     : View details about tech stack and expertise
  - <span class="term-highlight">projects</span>   : Inspect featured projects
  - <span class="term-highlight">contact</span>    : Show social accounts & email address
  - <span class="term-highlight">clear</span>      : Clear screen history
  - <span class="term-highlight">matrix</span>     : Toggle digital matrix rain effect
  - <span class="term-highlight">neofetch</span>   : Show system statistics info card`,
        
        about: `Hey there, I’m Dikshit Neupane! 👋

Just a tech enthusiast who loves building cool stuff on the web and diving into cyber security. When I'm not tweaking code or messing around in the Linux terminal, I'm usually exploring new tech trends or learning something new. Welcome to my space!`,
        
        skills: `🛠️ Dikshit's Tech Stack & Tools:
----------------------------------------
[+] Web Development : HTML5, CSS3, JavaScript (ES6+), UI/UX Layouts, Responsive Design
[+] Cyber Security  : Vulnerability Analysis, OWASP Top 10, Network Audit, Ethical Hacking
[+] Systems & Ops   : Linux (Debian, Arch), Bash Scripting, Git, Command Line Tools`,
        
        projects: `📂 Featured Repositories & Labs:
----------------------------------------
1. Vulnerability Scanner Lab
   - Description: Port scanning and auditing scanner built with Python.
   - Tags: Python, Sockets, SecAuditing
   
2. Custom CSS Glassmorphism Boilerplate
   - Description: A lightweight stylesheet structure for responsive layouts.
   - Tags: HTML5, CSS3, UI Boilerplate
   
3. Arch Setup Installer
   - Description: Dynamic bash scripts configuring customized linux window managers.
   - Tags: Shell Scripting, Linux, Automations`,
        
        contact: `📧 Connect with Dikshit:
----------------------------------------
[+] Email     : <a href="mailto:dixitneupane.np@gmail.com" class="term-highlight">dixitneupane.np@gmail.com</a>
[+] GitHub    : <a href="https://github.com/neupanedikshit" target="_blank" class="term-highlight">github.com/neupanedikshit</a>
[+] Instagram : <a href="https://www.instagram.com/dikshitneupanee/" target="_blank" class="term-highlight">instagram.com/dikshitneupanee</a>
[+] Facebook  : <a href="https://www.facebook.com/dikshitneupanee" target="_blank" class="term-highlight">facebook.com/dikshitneupanee</a>`,
        
        neofetch: `    <span class="term-highlight">.---.</span>       dikshit@portfolio
   <span class="term-highlight">/     \\</span>      -----------------
   <span class="term-highlight">\\_.._/</span>       OS: Linux / Web Browser
   <span class="term-highlight">||  ||</span>       Host: Dikshit Personal Web Space
   <span class="term-highlight">||  ||</span>       Kernel: Antigravity-v2.0
   <span class="term-highlight">||__||</span>       Uptime: 2 mins
   <span class="term-highlight">|____|</span>       Shell: Javascript Terminal Shell
                Theme: Glassmorphism Cyber-Slate
                Interests: Cybersecurity & Web Development`
    };

    let terminalHistory = [];
    let historyIndex = -1;

    if (terminalInput) {
        // Sync terminal cursor positioning with input text width
        const updateCursorPosition = () => {
            const val = terminalInput.value;
            // Create a temporary span to measure pixel length of characters
            const tempSpan = document.createElement('span');
            tempSpan.style.fontFamily = getComputedStyle(terminalInput).fontFamily;
            tempSpan.style.fontSize = getComputedStyle(terminalInput).fontSize;
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'pre';
            tempSpan.textContent = val;
            document.body.appendChild(tempSpan);
            
            // Offset from the start of the input
            const width = tempSpan.getBoundingClientRect().width;
            terminalCursor.style.left = `${width}px`;
            document.body.removeChild(tempSpan);
        };

        // Initialize cursor width offset
        updateCursorPosition();

        terminalInput.addEventListener('input', updateCursorPosition);

        // Keep terminal input focused when clicking inside the terminal body
        terminalBody.addEventListener('click', (e) => {
            // Only focus if user is not selecting text
            if (window.getSelection().toString() === '') {
                terminalInput.focus();
            }
        });

        // Command handler
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawCommand = terminalInput.value;
                const command = rawCommand.trim().toLowerCase();
                
                // Add to history
                if (command !== '') {
                    terminalHistory.push(rawCommand);
                    historyIndex = terminalHistory.length;
                }

                // Process output
                executeTerminalCommand(rawCommand, command);

                // Clear input & reset cursor
                terminalInput.value = '';
                updateCursorPosition();
            } else if (e.key === 'ArrowUp') {
                // Command history traversal
                e.preventDefault();
                if (terminalHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = terminalHistory[historyIndex];
                    updateCursorPosition();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < terminalHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = terminalHistory[historyIndex];
                    updateCursorPosition();
                } else {
                    historyIndex = terminalHistory.length;
                    terminalInput.value = '';
                    updateCursorPosition();
                }
            }
        });

        // Matrix rain effect inside terminal
        let matrixInterval = null;
        let canvas = null;

        function toggleMatrixEffect() {
            if (matrixInterval) {
                // Turn off matrix
                clearInterval(matrixInterval);
                matrixInterval = null;
                if (canvas && canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
                appendOutputLine("Matrix rain sequence terminated.");
                return;
            }

            // Start matrix effect inside terminal body
            appendOutputLine("Initializing digital rain sequence. Press <span class='term-highlight'>matrix</span> again to disable.");
            
            canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '0';
            canvas.style.opacity = '0.15';
            
            // Ensure terminal body is positioned relatively
            const computedStyle = window.getComputedStyle(terminalBody);
            if (computedStyle.position === 'static') {
                terminalBody.style.position = 'relative';
            }
            
            terminalBody.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            
            // Adjust canvas sizing
            const resizeCanvas = () => {
                canvas.width = terminalBody.clientWidth;
                canvas.height = terminalBody.clientHeight;
            };
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            const characters = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ10";
            const font_size = 14;
            const columns = Math.floor(canvas.width / font_size);
            const drops = Array(columns).fill(1);

            function drawMatrix() {
                ctx.fillStyle = 'rgba(8, 10, 16, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00e5ff'; // matrix color matches theme
                ctx.font = `${font_size}px monospace`;
                
                for (let i = 0; i < drops.length; i++) {
                    const text = characters[Math.floor(Math.random() * characters.length)];
                    ctx.fillText(text, i * font_size, drops[i] * font_size);
                    
                    if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            matrixInterval = setInterval(drawMatrix, 35);
        }

        function executeTerminalCommand(rawCommand, command) {
            // Find input line container to append before it
            const inputLine = document.querySelector('.terminal-input-line');
            
            // Create user prompt echo line
            const echoLine = document.createElement('div');
            echoLine.className = 'terminal-line';
            echoLine.innerHTML = `<span class="terminal-prompt">guest@dikshit:~$</span> <span class="terminal-input-display">${escapeHTML(rawCommand)}</span>`;
            terminalBody.insertBefore(echoLine, inputLine);

            if (command === 'clear') {
                // Clear all except prompt line
                const lines = Array.from(terminalBody.querySelectorAll('.terminal-line, .terminal-output'));
                lines.forEach(line => {
                    if (!line.classList.contains('terminal-input-line')) {
                        line.remove();
                    }
                });
                
                // Clear matrix if running
                if (matrixInterval) {
                    toggleMatrixEffect();
                }
                return;
            }

            // Command logic Routing
            if (command === 'matrix') {
                toggleMatrixEffect();
            } else if (command === 'sudo') {
                appendOutputLine("Error: User 'guest' is not in the sudoers file. This incident will be reported.");
            } else if (command === '') {
                // Do nothing
            } else if (commands[command]) {
                appendOutputLine(commands[command]);
            } else {
                appendOutputLine(`Command not found: <span class="term-highlight">${escapeHTML(command)}</span>. Type <span class="term-highlight">help</span> for a list of available commands.`);
            }

            // Scroll to bottom of terminal container
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function appendOutputLine(content) {
            const inputLine = document.querySelector('.terminal-input-line');
            const outputDiv = document.createElement('div');
            outputDiv.className = 'terminal-output';
            outputDiv.innerHTML = content;
            terminalBody.insertBefore(outputDiv, inputLine);
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag)
            );
        }
    }
});
