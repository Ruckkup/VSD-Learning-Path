// 1. ใส่ URL และ Key ที่คัดลอกมาจาก Supabase
const SUPABASE_URL = 'https://vdwlfrhxgikdywucryqh.supabase.co'; // <--- วาง URL ของคุณที่นี่
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2xmcmh4Z2lrZHl3dWNyeXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTE2NjEsImV4cCI6MjA2OTc4NzY2MX0.NPCzNhNHamAdxxt9pjwn3wP-JRYzjsI9LI5hU3YIySQ'; // <--- วาง Key ของคุณที่นี่

// 2. สร้างการเชื่อมต่อกับ Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. อ้างอิงถึง Element ต่างๆ ใน HTML
const emailInput = document.getElementById('userEmail');
const loadBtn = document.getElementById('loadProgressBtn');
const completeButtons = document.querySelectorAll('.complete-btn');

// 4. ฟังก์ชันสำหรับเช็คสถานะการเรียนเมื่อผู้ใช้ใส่ Email
async function checkCompletionStatus() {
    const userEmail = emailInput.value;
    if (!userEmail) {
        alert('กรุณาใส่อีเมลก่อน');
        return;
    }

    // ดึงข้อมูลจากตาราง 'progress' เฉพาะของอีเมลนี้
    const { data, error } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_email', userEmail);

    if (error) {
        console.error('Error fetching progress:', error);
        return;
    }
    
    // รีเซ็ตสถานะทั้งหมดก่อน
    document.querySelectorAll('.lesson').forEach(lesson => {
        lesson.querySelector('.status').textContent = 'สถานะ: ยังไม่เริ่ม';
        lesson.querySelector('.complete-btn').disabled = false;
    });

    // อัปเดต UI ตามข้อมูลที่ดึงมาได้
    data.forEach(item => {
        const lessonElement = document.getElementById(item.lesson_id);
        if (lessonElement) {
            lessonElement.querySelector('.status').textContent = 'สถานะ: เรียนจบแล้ว';
            lessonElement.querySelector('.complete-btn').disabled = true; // ปิดปุ่มที่เรียนจบแล้ว
        }
    });

    alert('โหลดข้อมูลความคืบหน้าสำเร็จ!');
}


// 5. ฟังก์ชันสำหรับบันทึกเมื่อกดปุ่ม "เรียนจบ"
async function markAsComplete(event) {
    const userEmail = emailInput.value;
    if (!userEmail) {
        alert('กรุณาใส่อีเมลของคุณก่อน');
        return;
    }

    const lessonId = event.target.dataset.lessonId;
    
    // ส่งข้อมูลไปที่ตาราง 'progress'
    const { data, error } = await supabase
        .from('progress')
        .insert([{ user_email: userEmail, lesson_id: lessonId }]);

    if (error) {
        console.error('Error saving progress:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } else {
        alert(`บันทึกว่าคุณเรียน ${lessonId} จบแล้ว!`);
        // อัปเดต UI ทันที
        const lessonElement = document.getElementById(lessonId);
        lessonElement.querySelector('.status').textContent = 'สถานะ: เรียนจบแล้ว';
        event.target.disabled = true;
    }
}

// 6. เพิ่ม Event Listeners
loadBtn.addEventListener('click', checkCompletionStatus);
completeButtons.forEach(button => {
    button.addEventListener('click', markAsComplete);
});