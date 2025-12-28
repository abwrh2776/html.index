// بيانات المواد الافتراضية
let subjects = [
    { id: 1, name: "هيكلة البيانات والخوارزميات", code: "CS201", hours: 3, grade: 4, desc: "مادة أساسية في برمجة هياكل البيانات والخوارزميات", type: "core" },
    { id: 2, name: "قواعد البيانات", code: "CS202", hours: 3, grade: 3.75, desc: "تصميم وإدارة قواعد البيانات", type: "core" },
    { id: 3, name: "الذكاء الاصطناعي", code: "CS305", hours: 3, grade: 3.5, desc: "مقدمة في الذكاء الاصطناعي وتعلم الآلة", type: "elective" },
    { id: 4, name: "لغة إنجليزية أكاديمية", code: "ENG101", hours: 2, grade: 4, desc: "تطوير مهارات الكتابة والقراءة الأكاديمية", type: "university" },
    { id: 5, name: "الرياضيات المتقدمة", code: "MATH202", hours: 3, grade: 3.75, desc: "مواضيع متقدمة في الرياضيات التطبيقية", type: "core" },
    { id: 6, name: "أمن المعلومات", code: "CS401", hours: 3, grade: 4, desc: "مبادئ أمن المعلومات والحماية", type: "elective" }
];

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عرض السنة الحالية في الفوتر
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // عرض المواد الافتراضية
    renderSubjects();
    updateSummary();
    
    // إضافة معالج الحدث لنموذج إضافة مادة
    document.getElementById('subjectForm').addEventListener('submit', addSubject);
    
    // إضافة معالجات الأحداث لأزرار التصفية
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
            
            // تطبيق التصفية
            const filter = this.getAttribute('data-filter');
            filterSubjects(filter);
        });
    });
});

// دالة لعرض المواد
function renderSubjects(filter = 'all') {
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';
    
    let filteredSubjects = subjects;
    
    if (filter !== 'all') {
        filteredSubjects = subjects.filter(subject => subject.type === filter);
    }
    
    if (filteredSubjects.length === 0) {
        container.innerHTML = '<div class="no-subjects">لا توجد مواد لعرضها. أضف مواد جديدة باستخدام النموذج أعلاه.</div>';
        return;
    }
    
    filteredSubjects.forEach(subject => {
        const subjectCard = createSubjectCard(subject);
        container.appendChild(subjectCard);
    });
}

// دالة لإنشاء بطاقة مادة
function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = `subject-card ${subject.type}`;
    card.setAttribute('data-id', subject.id);
    
    // تحويل الدرجة الرقمية إلى حرف
    const gradeLetter = getGradeLetter(subject.grade);
    
    card.innerHTML = `
        <div class="subject-header">
            <div class="subject-code">${subject.code}</div>
            <div class="subject-hours">${subject.hours} ساعات</div>
        </div>
        <h3 class="subject-name">${subject.name}</h3>
        <p class="subject-desc">${subject.desc}</p>
        <div class="subject-grade">${gradeLetter} (${subject.grade})</div>
        <div class="subject-actions">
            <span class="subject-type">${getTypeName(subject.type)}</span>
            <button class="btn-delete" onclick="deleteSubject(${subject.id})">
                <i class="fas fa-trash"></i> حذف
            </button>
        </div>
    `;
    
    return card;
}

// دالة لإضافة مادة جديدة
function addSubject(e) {
    e.preventDefault();
    
    // جمع بيانات النموذج
    const name = document.getElementById('subjectName').value;
    const code = document.getElementById('subjectCode').value;
    const hours = parseInt(document.getElementById('subjectHours').value);
    const grade = parseFloat(document.getElementById('subjectGrade').value);
    const desc = document.getElementById('subjectDesc').value || 'لا يوجد وصف';
    
    // تحديد نوع المادة بناءً على الرمز
    let type = 'core'; // افتراضيًا
    if (code.startsWith('CS') || code.startsWith('MATH')) {
        type = 'core';
    } else if (code.startsWith('ENG') || code.startsWith('ARAB')) {
        type = 'university';
    } else {
        type = 'elective';
    }
    
    // إنشاء مادة جديدة
    const newSubject = {
        id: subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
        name,
        code,
        hours,
        grade,
        desc,
        type
    };
    
    // إضافة المادة إلى المصفوفة
    subjects.push(newSubject);
    
    // إعادة عرض المواد
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    renderSubjects(activeFilter);
    
    // تحديث الملخص
    updateSummary();
    
    // إعادة تعيين النموذج
    document.getElementById('subjectForm').reset();
    
    // إشعار نجاح
    alert(`تمت إضافة المادة "${name}" بنجاح!`);
}

// دالة لحذف مادة
function deleteSubject(id) {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
        // البحث عن المادة وحذفها
        subjects = subjects.filter(subject => subject.id !== id);
        
        // إعادة عرض المواد
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        renderSubjects(activeFilter);
        
        // تحديث الملخص
        updateSummary();
        
        // إشعار نجاح
        alert('تم حذف المادة بنجاح!');
    }
}

// دالة لتصفية المواد حسب النوع
function filterSubjects(filter) {
    renderSubjects(filter);
}

// دالة لتحديث الملخص
function updateSummary() {
    const totalSubjects = subjects.length;
    const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
    
    // حساب المعدل الفصلي المتوقع
    let totalPoints = 0;
    subjects.forEach(subject => {
        totalPoints += subject.grade * subject.hours;
    });
    
    const expectedGPA = totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : 0;
    
    // تحديث واجهة المستخدم
    document.getElementById('totalSubjects').textContent = totalSubjects;
    document.getElementById('totalHours').textContent = totalHours;
    document.getElementById('expectedGPA').textContent = expectedGPA;
}

// دالة لتحويل الدرجة الرقمية إلى حرف
function getGradeLetter(grade) {
    if (grade >= 3.75) return 'أ';
    if (grade >= 3.5) return 'ب+';
    if (grade >= 3) return 'ب';
    if (grade >= 2.5) return 'ج+';
    if (grade >= 2) return 'ج';
    if (grade >= 1.5) return 'د+';
    if (grade >= 1) return 'د';
    return 'ف';
}

// دالة للحصول على اسم النوع بالعربية
function getTypeName(type) {
    switch(type) {
        case 'core': return 'متطلب تخصص';
        case 'elective': return 'متطلب اختياري';
        case 'university': return 'متطلب جامعة';
        default: return type;
    }
}

// دالة لتصدير البيانات (وظيفة إضافية)
function exportData() {
    const dataStr = JSON.stringify(subjects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'المواد الجامعية.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}