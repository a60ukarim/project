document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. كود صفحة التسجيل (Register Page)
    // ==========================================
    const registerForm = document.querySelector('form[name="reg"]');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الإرسال الافتراضي

            // جلب الحقول
            const firstName = document.getElementById('fn').value.trim();
            const lastName = document.getElementById('ls').value.trim();
            const email = document.getElementById('em').value.trim();
            const age = document.getElementById('age').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            // فحص تطابق كلمة المرور
            if (password !== confirmPassword) {
                alert('كلمتا المرور غير متطابقتين!');
                return;
            }

            // إنشاء كائن المستخدم (Object)
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                password: password
            };

            // جلب البيانات القديمة من localStorage أو مصفوفة فارغة
            let users = JSON.parse(localStorage.getItem('usersList')) || [];

            // فحص إذا كان الإيميل مستخدم مسبقاً
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('هذا البريد الإلكتروني مسجل مسبقاً!');
                return;
            }

            // إضافة المستخدم الجديد وحفظه كـ JSON
            users.push(userData);
            localStorage.setItem('usersList', JSON.stringify(users));

            alert('تم تسجيل الحساب بنجاح!');
            window.location.href = 'login.html'; // الانتقال لصفحة تسجيل الدخول
        });
    }

    // ==========================================
    // 2. كود صفحة تسجيل الدخول (Login Page)
    // ==========================================
    const loginForm = document.querySelector('form[name="login"]');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الإرسال الافتراضي

            const loginInput = document.getElementById('login').value.trim();
            const passwordInput = document.getElementById('ps').value;

            if (loginInput === '' || passwordInput === '') {
                alert('الرجاء إدخال اسم المستخدم/البريد وكلمة المرور!');
                return;
            }

            // استرجاع المستخدمين المخزنين كـ JSON
            let users = JSON.parse(localStorage.getItem('usersList')) || [];

            // البحث عن المستخدم (نبحث بالبريد الإلكتروني أو الاسم الأول كمثال)
            let foundUser = users.find(u => (u.email === loginInput || u.firstName === loginInput) && u.password === passwordInput);

            if (foundUser) {
                alert('مرحباً بك مجدداً، ' + foundUser.firstName + '! تم تسجيل الدخول بنجاح.');
                // هنا ممكن تنقله لصفحة الداشبورد الخاصة فيه
                // window.location.href = 'dashboard.html';
            } else {
                alert('خطأ في البيانات المدخلة، يرجى التأكد أو إنشاء حساب جديد!');
            }
        });
    }

});