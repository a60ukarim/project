document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. كود صفحة التسجيل (Register Page)
    // ==========================================
    const registerForm = document.querySelector('form[name="reg"]');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الإرسال الافتراضي

            const firstName = document.getElementById('fn').value.trim();
            const lastName = document.getElementById('ls').value.trim();
            const email = document.getElementById('em').value.trim();
            const age = document.getElementById('age').value.trim();
            const password = document.getElementById('ps').value;
            const confirmPassword = document.getElementById('cps').value;

            // فحص تطابق كلمة المرور
            if (password !== confirmPassword) {
                alert('كلمتا المرور غير متطابقتين!');
                return;
            }

            const newUserData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                password: password
            };

            // جلب البيانات المخزنة محلياً أو البدء بمصفوفة جديدة
            let users = JSON.parse(localStorage.getItem('usersList')) || [];

            // فحص إذا كان الإيميل مسجل مسبقاً
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('هذا البريد الإلكتروني مسجل مسبقاً!');
                return;
            }

            users.push(newUserData);
            localStorage.setItem('usersList', JSON.stringify(users));

            alert('تم تسجيل الحساب بنجاح!');
            window.location.href = 'login.html';
        });
    }

    // ==========================================
    // 2. كود صفحة تسجيل الدخول (Login Page)
    // ==========================================
    const loginForm = document.querySelector('form[name="login"]');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // منع الإرسال الافتراضي

            const loginInput = document.getElementById('login').value.trim();
            const passwordInput = document.getElementById('ps').value;

            if (loginInput === '' || passwordInput === '') {
                alert('الرجاء إدخال اسم المستخدم وكلمة المرور!');
                return;
            }

            try {
                // جلب البيانات من ملف users.json الخارجي (الخروج خطوة للوراء للمجلد الرئيسي)
                const response = await fetch('../users.json');
                const fileUsers = await response.json();

                // جلب البيانات المضافة حديثاً من الـ localStorage (إن وجدت)
                const localUsers = JSON.parse(localStorage.getItem('usersList')) || [];

                // دمج القائمتين معاً للبحث فيهما
                const allUsers = [...fileUsers, ...localUsers];

                // البحث عن المستخدم المطابق
                let foundUser = allUsers.find(u => 
                    (u.email === loginInput || u.firstName === loginInput) && u.password === passwordInput
                );

                if (foundUser) {
                    alert('مرحباً بك مجدداً، ' + foundUser.firstName + '! تم تسجيل الدخول بنجاح.');
                    // الانتقال إلى الصفحة الرئيسية (index.html) الموجودة في المجلد الرئيسي
                    window.location.href = '../index.html';
                } else {
                    alert('خطأ في اسم المستخدم أو كلمة المرور، يرجى التحقق!');
                }

            } catch (error) {
                console.error('Error loading users.json:', error);
                alert('حدث خطأ أثناء الاتصال بقاعدة البيانات المحلية.');
            }
        });
    }

});