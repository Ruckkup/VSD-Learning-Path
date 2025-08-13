// --- DATABASE: รายชื่อบทเรียนทั้งหมด ---
// ตรวจสอบให้แน่ใจว่าชื่อไฟล์และ title ตรงกับที่คุณมี
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
    { id: 'lesson-16', file: '16.html', title: 'VSD User Interface', module: 'Module 04: User Interface' },
    { id: 'lesson-17', file: '17.html', title: 'Set V/I/f', module: 'Module 04: User Interface' },
    { id: 'lesson-18', file: '18.html', title: 'Set Accel&Decel', module: 'Module 04: User Interface' },
    { id: 'lesson-19', file: '19.html', title: 'Protection Parameters', module: 'Module 04: User Interface' },
    { id: 'lesson-20', file: '20.html', title: 'Hands-on', module: 'Module 04: User Interface' },
    { id: 'lesson-21', file: '21.html', title: 'Pump', module: 'Module 05: Applications' },
    { id: 'lesson-22', file: '22.html', title: 'Fan', module: 'Module 05: Applications' },
    { id: 'lesson-23', file: '23.html', title: 'Conveyor', module: 'Module 05: Applications' },
    { id: 'lesson-24', file: '24.html', title: 'Energy Saving', module: 'Module 05: Applications' },
    { id: 'lesson-25', file: '25.html', title: 'VSD Application', module: 'Module 05: Applications' },
    { id: 'lesson-26', file: '26.html', title: 'Faults&Alarms', module: 'Module 06: Troubleshooting' },
    { id: 'lesson-27', file: '27.html', title: 'Using a Multimeter', module: 'Module 06: Troubleshooting' },
    { id: 'lesson-28', file: '28.html', title: 'Check Input&Output V&I', module: 'Module 06: Troubleshooting' },
    { id: 'lesson-29', file: '29.html', title: 'Problems Related to VSD', module: 'Module 06: Troubleshooting' },
    { id: 'lesson-30', file: '30.html', title: 'Maintenance Procedures', module: 'Module 06: Troubleshooting' },
    { id: 'resource-01', file: 'resource-01.html', title: 'VSD Documentation', module: 'Module 07: Resource Center' },
    { id: 'resource-02', file: 'resource-02.html', title: 'Technical Papers', module: 'Module 07: Resource Center' },
    { id: 'resource-03', file: 'resource-03.html', title: 'Video Library', module: 'Module 07: Resource Center' },
    { id: 'resource-04', file: 'resource-04.html', title: 'Tools & Downloads', module: 'Module 07: Resource Center' }
];

// --- CONFIGURATION ---
const CONFIG = {
    storageKey: 'vsdLearningProgress',
    homePage: 'index.html',
    modules: [
        { id: 'module-01', name: 'Module 01: Introduction', icon: '💡' },
        { id: 'module-02', name: 'Module 02: AC Motor Fundamentals', icon: '⚙️' },
        { id: 'module-03', name: 'Module 03: Control & Operation', icon: '🕹️' },
        { id: 'module-04', name: 'Module 04: User Interface', icon: '🖥️' },
        { id: 'module-05', name: 'Module 05: Applications', icon: '🏭' },
        { id: 'module-06', name: 'Module 06: Troubleshooting', icon: '🔧' },
        { id: 'module-07', name: 'Module 07: Resource Center', icon: '📚' }
    ]
};

// Helper: List of modules to track progress for
const TRACKED_MODULES = CONFIG.modules
    .filter(m => m.id !== 'module-07') // Exclude Resource Center
    .map(m => m.name);

// --- PROGRESS TRACKING SYSTEM ---
class ProgressTracker {
    constructor() {
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    saveProgress() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.progress));
    }

    markComplete(lessonId) {
        this.progress[lessonId] = true;
        this.saveProgress();
        return true;
    }

    isComplete(lessonId) {
        return !!this.progress[lessonId];
    }

    // Only count lessons in tracked modules
    getCompletionStats() {
        const trackedLessons = lessons.filter(l => TRACKED_MODULES.includes(l.module));
        const completedCount = trackedLessons.filter(l => this.isComplete(l.id)).length;
        const totalLessons = trackedLessons.length;
        const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        return { completedCount, totalLessons, percentage };
    }

    getModuleProgress(moduleName) {
        if (!TRACKED_MODULES.includes(moduleName)) {
            return { completedCount: 0, totalLessons: 0, percentage: 0 };
        }
        const moduleLessons = lessons.filter(l => l.module === moduleName);
        const completedCount = moduleLessons.filter(l => this.isComplete(l.id)).length;
        const totalLessons = moduleLessons.length;
        const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        return { completedCount, totalLessons, percentage };
    }

    resetProgress(lessonId) {
        if (lessonId) {
            delete this.progress[lessonId];
        } else {
            this.progress = {};
        }
        this.saveProgress();
        return true;
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

    getNavigationButtons() {
        const currentIndex = this.getCurrentLessonIndex();
        
        if (currentIndex === -1) return null;
        
        const prevLesson = currentIndex > 0 ? this.lessons[currentIndex - 1] : null;
        const nextLesson = currentIndex < this.lessons.length - 1 ? this.lessons[currentIndex + 1] : null;
        
        return {
            prev: prevLesson,
            next: nextLesson,
            isFirst: currentIndex === 0,
            isLast: currentIndex === this.lessons.length - 1
        };
    }

    createNavigationHTML() {
        const nav = this.getNavigationButtons();
        if (!nav) return '';
        
        let html = '<div class="lesson-nav">';
        
        if (nav.prev) {
            html += `<a href="${nav.prev.file}" class="nav-button nav-prev">← ${nav.prev.title}</a>`;
        } else {
            html += '<div></div>';
        }
        
        html += `<a href="index.html" class="nav-button home-button">🏠 กลับหน้าแรก</a>`;
        
        if (nav.next) {
            html += `<a href="${nav.next.file}" class="nav-button nav-next">${nav.next.title} →</a>`;
        } else {
            html += '<div></div>';
        }
        
        html += '</div>';
        return html;
    }
}

// --- INITIALIZATION ---
const progressTracker = new ProgressTracker();
const lessonNavigator = new LessonNavigator();

// --- MAIN APPLICATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = document.querySelector('.module-grid');
    const lessonContainer = document.querySelector('.vsd-learning-path');

    if (isHomePage) {
        initializeHomePage();
    } else if (lessonContainer) {
        initializeLessonPage(lessonContainer);
    }
});

// --- HOME PAGE FUNCTIONS ---
function initializeHomePage() {
    updateHomePageLinks();
    updateProgressBar();
    updateModuleProgress();
}

function updateHomePageLinks() {
    document.querySelectorAll('.lesson-list a').forEach(link => {
        const linkFile = link.getAttribute('href');
        if (!linkFile || linkFile === '#') return;
        const lesson = lessons.find(l => l.file === linkFile);
        if (lesson && progressTracker.isComplete(lesson.id)) {
            link.classList.add('completed');
        } else {
            link.classList.remove('completed');
        }
    });
}

function markComplete(lessonId) {
    if (progressTracker.markComplete(lessonId)) {
        updateProgressBar();
        updateModuleProgress();
        updateHomePageLinks();
        showNotification('บันทึกความคืบหน้าเรียบร้อย!');
        return true;
    }
    return false;
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


function updateModuleProgress() {
    const moduleGrid = document.querySelector('.module-grid');
    if (!moduleGrid) return;
    
    CONFIG.modules.forEach(module => {
        const moduleCard = moduleGrid.querySelector(`#${module.id}`);
        if (!moduleCard) return;

        // Hide progress bar for Resource Center
        if (module.id === 'module-07') {
            const progressContainer = moduleCard.querySelector('.module-progress');
            if (progressContainer) progressContainer.style.display = 'none';
            return;
        }
        
        const stats = progressTracker.getModuleProgress(module.name);
        const progressContainer = moduleCard.querySelector('.module-progress');
        
        if (progressContainer) {
            progressContainer.style.display = '';
            progressContainer.innerHTML = `
                <div class="module-progress-bar">
                    <div class="module-progress-fill" style="width: ${stats.percentage}%"></div>
                </div>
                <div class="module-progress-text">${stats.percentage}% (${stats.completedCount}/${stats.totalLessons})</div>
            `;
        }
    });
}

// --- LESSON PAGE FUNCTIONS ---
function initializeLessonPage(container) {
    setupLessonFooter(container);
}

// --- MODIFIED FUNCTION ---
function setupLessonFooter(container) {
    const currentPath = window.location.pathname.split('/').pop();
    const currentIndex = lessons.findIndex(lesson => lesson.file === currentPath);
    
    if (currentIndex === -1) return;

    const currentLesson = lessons[currentIndex];
    
    const footerDiv = document.createElement('div');
    footerDiv.className = 'lesson-footer';
    
    footerDiv.innerHTML = lessonNavigator.createNavigationHTML();
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const completeButton = document.createElement('button');
    completeButton.id = 'mark-complete-btn';
    completeButton.className = progressTracker.isComplete(currentLesson.id) ? 'completed' : '';
    completeButton.textContent = progressTracker.isComplete(currentLesson.id) 
        ? 'เรียนจบบทนี้แล้ว' 
        : 'ทำเครื่องหมายว่าเรียนจบแล้ว';
    
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-progress-btn';
    resetButton.className = 'reset-button';
    resetButton.textContent = '🔄 รีเซ็ตบทเรียนนี้';
    resetButton.style.display = progressTracker.isComplete(currentLesson.id) ? 'block' : 'none';
    
    completeButton.onclick = () => {
        if (!progressTracker.isComplete(currentLesson.id)) {
            progressTracker.markComplete(currentLesson.id);
            completeButton.textContent = 'เรียนจบบทนี้แล้ว';
            completeButton.classList.add('completed');
            resetButton.style.display = 'block';
            showNotification('บันทึกความคืบหน้าเรียบร้อย!');
             }
    };
    
    resetButton.onclick = () => {
        if (progressTracker.resetProgress(currentLesson.id)) {
            progressTracker.resetProgress(currentLesson.id);
            completeButton.textContent = 'ทำเครื่องหมายว่าเรียนจบแล้ว';
            completeButton.classList.remove('completed');
            resetButton.style.display = 'none';
            showNotification('รีเซ็ตบทเรียนเรียบร้อย!');
        }
    };
    
    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(resetButton);
    
    footerDiv.appendChild(buttonContainer);
    
    container.appendChild(footerDiv);
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}