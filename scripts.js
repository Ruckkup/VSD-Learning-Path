// --- DATABASE: รายชื่อบทเรียนทั้งหมด ---
// ตรวจสอบให้แน่ใจว่าชื่อไฟล์และ title ตรงกับที่คุณมี
const lessons = [
    { id: 'lesson-01', file: '01.html', title: 'What is VSD ?' },
    { id: 'lesson-02', file: '02.html', title: 'Basic Component' },
    { id: 'lesson-03', file: '03.html', title: 'Key Parameters' },
    { id: 'lesson-04', file: '04.html', title: 'Nameplate' },
    { id: 'lesson-05', file: '05.html', title: 'Case Study' },
    { id: 'lesson-06', file: '06.html', title: 'Construction and Operation' },
    { id: 'lesson-07', file: '07.html', title: 'Torque-Speed' },
    { id: 'lesson-08', file: '08.html', title: 'Heating and Cooling' },
    { id: 'lesson-09', file: '09.html', title: 'V&f on Motor Performance' },
    { id: 'lesson-10', file: '10.html', title: 'Selecting the Motor' },
    { id: 'lesson-11', file: '11.html', title: 'Scalar Control' },
    { id: 'lesson-12', file: '12.html', title: 'Vector Control' },
    { id: 'lesson-13', file: '13.html', title: 'Direct Torque Control' },
    { id: 'lesson-14', file: '14.html', title: 'Slip Compensation' },
    { id: 'lesson-15', file: '15.html', title: 'Open VS Closed-Loop' },
    { id: 'lesson-16', file: '16.html', title: 'VSD User Interface' },
    { id: 'lesson-17', file: '17.html', title: 'Set V/I/f' },
    { id: 'lesson-18', file: '18.html', title: 'Set Accel&Decel' },
    { id: 'lesson-19', file: '19.html', title: 'Protection Parameters' },
    { id: 'lesson-20', file: '20.html', title: 'Hands-on' },
    { id: 'lesson-21', file: '21.html', title: 'Pump' },
    { id: 'lesson-22', file: '22.html', title: 'Fan' },
    { id: 'lesson-23', file: '23.html', title: 'Conveyor' },
    { id: 'lesson-24', file: '24.html', title: 'Energy Saving' },
    { id: 'lesson-25', file: '25.html', title: 'VSD Application' },
    { id: 'lesson-26', file: '26.html', title: 'Faults&Alarms' },
    { id: 'lesson-27', file: '27.html', title: 'Using a Multimeter' },
    { id: 'lesson-28', file: '28.html', title: 'Check Input&Output V&I' },
    { id: 'lesson-29', file: '29.html', title: 'Problems Related to VSD' },
    { id: 'lesson-30', file: '30.html', title: 'Maintenance Procedures' }
];

// --- LOGIC หลัก: จะทำงานเมื่อหน้าเว็บโหลดเสร็จ ---
document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = document.querySelector('.module-grid');
    const lessonContainer = document.querySelector('.vsd-learning-path');

    if (isHomePage) {
        updateHomePageLinks();
    }

    if (lessonContainer && !isHomePage) {
        addCompletionButton(lessonContainer);
    }
});

// --- ฟังก์ชันสำหรับหน้า Home ---
function updateHomePageLinks() {
    const progress = getProgress();
    document.querySelectorAll('.lesson-list a').forEach(link => {
        const linkFile = link.getAttribute('href');
        const lesson = lessons.find(l => l.file === linkFile);

        if (lesson && progress[lesson.id]) {
            link.classList.add('completed');
        }
    });
}

// --- ฟังก์ชันสำหรับหน้าบทเรียน ---
function addCompletionButton(container) {
    const currentPath = window.location.pathname.split('/').pop();
    const currentLesson = lessons.find(lesson => lesson.file === currentPath);
    
    if (!currentLesson) return;

    const progress = getProgress();
    const lessonId = currentLesson.id;

    const conclusionDiv = container.querySelector('.conclusion');
    if (conclusionDiv) {
        const button = document.createElement('button');
        button.id = 'mark-complete-btn';
        
        if (progress[lessonId]) {
            button.textContent = '✅ เรียนจบบทนี้แล้ว';
            button.disabled = true;
        } else {
            button.textContent = 'ทำเครื่องหมายว่าเรียนจบแล้ว';
        }

        button.onclick = () => {
            markComplete(lessonId);
            button.textContent = '✅ เรียนจบบทนี้แล้ว';
            button.disabled = true;
            alert('บันทึกความคืบหน้าเรียบร้อย!');
        };
        
        conclusionDiv.appendChild(button);
    }
}

// --- ฟังก์ชันจัดการ Local Storage ---
const PROGRESS_KEY = 'vsdLearningProgress';

function getProgress() {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
}

function saveProgress(progress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function markComplete(lessonId) {
    const progress = getProgress();
    progress[lessonId] = true;
    saveProgress(progress);
}