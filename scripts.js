// --- DATABASE: รายชื่อบทเรียนทั้งหมด ---
const lessons = [
    { id: 'lesson-01', file: '01.html', title: 'What is VSD ?', module: 'Module 01: Introduction' },
    { id: 'lesson-02', file: '02.html', title: 'Basic Component', module: 'Module 01: Introduction' },
    { id: 'lesson-03', file: '03.html', title: 'Key Parameters', module: 'Module 01: Introduction' },
    { id: 'lesson-04', file: '04.html', title: 'Nameplate', module: 'Module 01: Introduction' },
    { id: 'lesson-05', file: '05.html', title: 'Case Study', module: 'Module 01: Introduction' },
    { id: 'lesson-06', file: '06.html', title: 'Construction and Operation', module: 'Module 02: AC Motor Fundamentals' },
    { id: 'lesson-07', file: '07.html', title: 'Torque-Speed', module: 'Module 02: AC Motor Fundamentals' },
    { id: 'lesson-08', file: '08.html', title: 'Heating and Cooling', module: 'Module 02: AC Motor Fundamentals' },
    { id: 'lesson-09', file: '09.html', title: 'V&f on Motor Performance', module: 'Module 02: AC Motor Fundamentals' },
    { id: 'lesson-10', file: '10.html', title: 'Selecting the Motor', module: 'Module 02: AC Motor Fundamentals' },
    { id: 'lesson-11', file: '11.html', title: 'Scalar Control', module: 'Module 03: Control & Operation' },
    { id: 'lesson-12', file: '12.html', title: 'Vector Control', module: 'Module 03: Control & Operation' },
    { id: 'lesson-13', file: '13.html', title: 'Direct Torque Control', module: 'Module 03: Control & Operation' },
    { id: 'lesson-14', file: '14.html', title: 'Slip Compensation', module: 'Module 03: Control & Operation' },
    { id: 'lesson-15', file: '15.html', title: 'Open VS Closed-Loop', module: 'Module 03: Control & Operation' },
    { id: 'lesson-16', file: '16.html', title: 'VSD User Interface', module: 'Module 04: Parameter & Config' },
    { id: 'lesson-17', file: '17.html', title: 'Set V/I/f', module: 'Module 04: Parameter & Config' },
    { id: 'lesson-18', file: '18.html', title: 'Set Accel&Decel', module: 'Module 04: Parameter & Config' },
    { id: 'lesson-19', file: '19.html', title: 'Protection Parameters', module: 'Module 04: Parameter & Config' },
    { id: 'lesson-20', file: '20.html', title: 'Hands-on', module: 'Module 04: Parameter & Config' },
    { id: 'lesson-21', file: '21.html', title: 'Pump', module: 'Module 05: Application & Benifits' },
    { id: 'lesson-22', file: '22.html', title: 'Fan', module: 'Module 05: Application & Benifits' },
    { id: 'lesson-23', file: '23.html', title: 'Conveyor', module: 'Module 05: Application & Benifits' },
    { id: 'lesson-24', file: '24.html', title: 'Energy Saving', module: 'Module 05: Application & Benifits' },
    { id: 'lesson-25', file: '25.html', title: 'VSD Application', module: 'Module 05: Application & Benifits' },
    { id: 'lesson-26', file: '26.html', title: 'Faults&Alarms', module: 'Module 06: Trobleshooting & Maint.' },
    { id: 'lesson-27', file: '27.html', title: 'Using a Multimeter', module: 'Module 06: Trobleshooting & Maint.' },
    { id: 'lesson-28', file: '28.html', title: 'Check Input&Output V&I', module: 'Module 06: Trobleshooting & Maint.' },
    { id: 'lesson-29', file: '29.html', title: 'Problems Related to VSD', module: 'Module 06: Trobleshooting & Maint.' },
    { id: 'lesson-30', file: '30.html', title: 'Maintenance Procedures', module: 'Module 06: Trobleshooting & Maint.' },
    { id: 'resource-01', file: '#', title: 'เอกสารอ้างอิงและลิงก์เพิ่มเติม', module: 'Module 07: Resource Center' }
];

// --- CONFIGURATION ---
const CONFIG = {
    storageKey: 'vsdLearningProgress',
    homePage: 'index.html',
    modules: [
        { id: 'module-01', name: 'Module 01: Introduction' },
        { id: 'module-02', name: 'Module 02: AC Motor Fundamentals' },
        { id: 'module-03', name: 'Module 03: Control & Operation' },
        { id: 'module-04', name: 'Module 04: Parameter & Config' },
        { id: 'module-05', name: 'Module 05: Application & Benifits' },
        { id: 'module-06', name: 'Module 06: Trobleshooting & Maint.' },
        { id: 'module-07', name: 'Module 07: Resource Center' }
    ]
};

const firebaseConfig = {
    apiKey: "AIzaSyDmDvSOwdiEF0ZN5QWYpardsJZntdDVsNo",
    authDomain: "vsd-maintenace-progressing.firebaseapp.com",
    databaseURL: "https://vsd-maintenace-progressing-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vsd-maintenace-progressing",
    storageBucket: "vsd-maintenace-progressing.appspot.com",
    messagingSenderId: "1070321938533",
    appId: "1:1070321938533:web:92707b3bfff8c8f64bd68c",
    measurementId: "G-HL45FSZLY2"
};
firebase.initializeApp(firebaseConfig);

const TRACKED_MODULES = CONFIG.modules
    .filter(m => m.id !== 'module-07')
    .map(m => m.name);

// --- UNIFIED PROGRESS TRACKER ---
class UnifiedProgressTracker {
    constructor() {
        this.progress = {};
        this.userId = null;
        this.dbRef = null;
        this.localStoreKey = CONFIG.storageKey;
    }

    async loadForUser(user) {
        if (user) {
            this.userId = user.uid;
            this.dbRef = firebase.database().ref(`progress/${this.userId}`);
            const snapshot = await this.dbRef.once('value');
            this.progress = snapshot.val() || {};
        } else {
            this.userId = null;
            this.dbRef = null;
            const stored = localStorage.getItem(this.localStoreKey);
            this.progress = stored ? JSON.parse(stored) : {};
        }
        this.saveToLocal(); // Always sync to local storage
        updateUI();
    }

    saveToLocal() {
        localStorage.setItem(this.localStoreKey, JSON.stringify(this.progress));
    }

    saveProgress() {
        this.saveToLocal();
        if (this.dbRef) {
            this.dbRef.set(this.progress);
        }
    }

    markComplete(lessonId) {
        this.progress[lessonId] = true;
        this.saveProgress();
    }

    resetProgress(lessonId) {
        if (this.progress[lessonId]) {
            delete this.progress[lessonId];
            this.saveProgress();
        }
    }

    isComplete(lessonId) {
        return !!this.progress[lessonId];
    }

    getCompletionStats() {
        const trackedLessons = lessons.filter(l => TRACKED_MODULES.includes(l.module));
        const completedCount = trackedLessons.filter(l => this.isComplete(l.id)).length;
        const totalLessons = trackedLessons.length;
        const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        return { completedCount, totalLessons, percentage };
    }

    getModuleProgress(moduleName) {
        const moduleLessons = lessons.filter(l => l.module === moduleName);
        if (moduleLessons.length === 0) {
            return { completedCount: 0, totalLessons: 0, percentage: 0 };
        }
        const completedCount = moduleLessons.filter(l => this.isComplete(l.id)).length;
        const totalLessons = moduleLessons.length;
        const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        return { completedCount, totalLessons, percentage };
    }
}

// --- NAVIGATION SYSTEM ---
class LessonNavigator {
    constructor() {
        this.lessons = lessons;
    }

    getCurrentLessonIndex() {
        const currentPath = window.location.pathname.split('/').pop();
        return this.lessons.findIndex(lesson => lesson.file === currentPath);
    }

    getNavigationInfo() {
        const currentIndex = this.getCurrentLessonIndex();
        if (currentIndex === -1) return null;
        
        const prevLesson = currentIndex > 0 ? this.lessons[currentIndex - 1] : null;
        const nextLesson = currentIndex < this.lessons.length - 1 ? this.lessons[currentIndex + 1] : null;
        
        return { prev: prevLesson, next: nextLesson };
    }
}

// --- GLOBAL INSTANCES ---
const progressTracker = new UnifiedProgressTracker();
const lessonNavigator = new LessonNavigator();

// --- MAIN APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // The main logic is now triggered by the auth state change
});

// --- AUTHENTICATION ---
firebase.auth().onAuthStateChanged(async (user) => {
    renderAuthUI(user);
    await progressTracker.loadForUser(user);
});

function renderAuthUI(user) {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    if (user) {
        const name = user.displayName || user.email || (user.isAnonymous ? 'Anonymous' : 'User');
        authContainer.innerHTML = `
            <div class="user-info">
                <span>Welcome, ${name}!</span>
                <button id="logout-btn">Logout</button>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', () => firebase.auth().signOut());
    } else {
        authContainer.innerHTML = `
            <div class="login-buttons">
                 <p>Login to save your progress across devices.</p>
                 <button id="login-google-btn">Login with Google</button>
                 <button id="login-anon-btn">Continue as Guest</button>
            </div>
        `;
        document.getElementById('login-google-btn').addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider);
        });
        document.getElementById('login-anon-btn').addEventListener('click', () => {
            firebase.auth().signInAnonymously();
        });
    }
}

// --- UI UPDATE FUNCTIONS ---
function updateUI() {
    const isHomePage = document.querySelector('.module-grid');
    const lessonContainer = document.querySelector('.vsd-learning-path:not(:has(.module-grid))');

    if (isHomePage) {
        updateHomePageUI();
    } else if (lessonContainer) {
        updateLessonPageUI(lessonContainer);
    }
}

function updateHomePageUI() {
    updateHomePageLinks();
    updateProgressBar();
    updateAllModuleProgress();
}

function updateLessonPageUI(container) {
    const conclusionDiv = container.querySelector('.conclusion');
    if (conclusionDiv) {
        const oldFooter = conclusionDiv.querySelector('.lesson-footer');
        if (oldFooter) {
            oldFooter.remove();
        }
        setupLessonFooter(conclusionDiv);
    }
}

function updateHomePageLinks() {
    document.querySelectorAll('.lesson-list a').forEach(link => {
        const linkFile = link.getAttribute('href');
        const lesson = lessons.find(l => l.file === linkFile);
        if (lesson && progressTracker.isComplete(lesson.id)) {
            link.classList.add('completed');
        } else {
            link.classList.remove('completed');
        }
    });
}

function updateProgressBar() {
    const stats = progressTracker.getCompletionStats();
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
        progressBar.style.width = `${stats.percentage}%`;
        progressText.textContent = `สำเร็จไปแล้ว ${stats.percentage}% (${stats.completedCount} จาก ${stats.totalLessons} บทเรียน)`;
    }
}

function updateAllModuleProgress() {
    CONFIG.modules.forEach(module => {
        const stats = progressTracker.getModuleProgress(module.name);
        const moduleCard = document.getElementById(module.id);
        if (!moduleCard) return;

        const progressContainer = moduleCard.querySelector('.module-progress');
        if (!progressContainer) return;

        if (module.id === 'module-07' || stats.totalLessons === 0) {
            progressContainer.style.display = 'none';
            return;
        }

        progressContainer.style.display = 'block';
        const fillElement = progressContainer.querySelector('.module-progress-fill');
        const textElement = progressContainer.querySelector('.module-progress-text');
        
        if(fillElement && textElement) {
            fillElement.style.width = `${stats.percentage}%`;
            textElement.textContent = `${stats.percentage}% (${stats.completedCount}/${stats.totalLessons})`;
        }
    });
}

function setupLessonFooter(conclusionDiv) {
    const navInfo = lessonNavigator.getNavigationInfo();
    const currentIndex = lessonNavigator.getCurrentLessonIndex();
    if (currentIndex === -1) return;

    const currentLesson = lessons[currentIndex];
    const isCompleted = progressTracker.isComplete(currentLesson.id);

    const footerDiv = document.createElement('div');
    footerDiv.className = 'lesson-footer';

    let navHTML = '<div class="lesson-nav">';
    navHTML += navInfo.prev ? `<a href="${navInfo.prev.file}" class="nav-button nav-prev">← ${navInfo.prev.title}</a>` : '<div></div>';
    navHTML += `<a href="${CONFIG.homePage}" class="nav-button home-button">🏠 กลับหน้าแรก</a>`;
    navHTML += navInfo.next ? `<a href="${navInfo.next.file}" class="nav-button nav-next">${navInfo.next.title} →</a>` : '<div></div>';
    navHTML += '</div>';
    footerDiv.innerHTML = navHTML;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const completeButton = document.createElement('button');
    completeButton.id = 'mark-complete-btn';
    completeButton.textContent = isCompleted ? '✅ เรียนจบบทนี้แล้ว' : 'ทำเครื่องหมายว่าเรียนจบแล้ว';
    if (isCompleted) {
        completeButton.classList.add('completed');
    }

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-progress-btn';
    resetButton.textContent = '🔄 รีเซ็ตบทเรียนนี้';
    resetButton.style.display = isCompleted ? 'inline-block' : 'none';

    completeButton.addEventListener('click', () => {
        if (!progressTracker.isComplete(currentLesson.id)) {
            progressTracker.markComplete(currentLesson.id);
            updateLessonPageUI(conclusionDiv.parentElement);
            showNotification('บันทึกความคืบหน้าเรียบร้อย!');
        }
    });

    resetButton.addEventListener('click', () => {
        progressTracker.resetProgress(currentLesson.id);
        updateLessonPageUI(conclusionDiv.parentElement);
        showNotification('รีเซ็ตบทเรียนเรียบร้อย!');
    });

    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(resetButton);
    footerDiv.appendChild(buttonContainer);

    conclusionDiv.appendChild(footerDiv);
}

// --- UTILITY FUNCTIONS ---
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


