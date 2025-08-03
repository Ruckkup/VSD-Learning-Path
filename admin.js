// ใช้ URL และ Key เดียวกันกับไฟล์ app.js
const SUPABASE_URL = 'https://vdwlfrhxgikdywucryqh.supabase.co'; // <--- วาง URL ของคุณที่นี่
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2xmcmh4Z2lrZHl3dWNyeXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTE2NjEsImV4cCI6MjA2OTc4NzY2MX0.NPCzNhNHamAdxxt9pjwn3wP-JRYzjsI9LI5hU3YIySQ'; // <--- วาง Key ของคุณที่นี่

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ฟังก์ชันสำหรับโหลดข้อมูลทั้งหมดมาแสดงในตาราง
async function loadAdminDashboard() {
    const tableBody = document.getElementById('progress-table-body');
    tableBody.innerHTML = '<tr><td colspan="3">กำลังโหลดข้อมูล...</td></tr>'; // แสดงสถานะกำลังโหลด

    // ดึงข้อมูลทั้งหมดจากตาราง 'progress' และเรียงตามวันที่ล่าสุดก่อน
    const { data, error } = await supabase
        .from('progress')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin data:', error);
        tableBody.innerHTML = '<tr><td colspan="3">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>';
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">ยังไม่มีข้อมูล</td></tr>';
        return;
    }

    // เคลียร์ตารางและเติมข้อมูลใหม่
    tableBody.innerHTML = ''; 
    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.user_email}</td>
                <td>${item.lesson_id}</td>
                <td>${new Date(item.created_at).toLocaleString('th-TH')}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', loadAdminDashboard);