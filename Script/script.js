document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. كود صفحة التسجيل (Register Page)
    // ==========================================
    const registerForm = document.querySelector('form[name="reg"]');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName = document.getElementById('fn').value.trim();
            const lastName = document.getElementById('ls').value.trim();
            const email = document.getElementById('em').value.trim();
            const age = document.getElementById('age').value.trim();
            const password = document.getElementById('ps').value;
            const confirmPassword = document.getElementById('cps').value;

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

            let users = JSON.parse(localStorage.getItem('usersList')) || [];

            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('هذا البريد الإلكتروني مسجل مسبقاً!');
                return;
            }

            users.push(newUserData);
            localStorage.setItem('usersList', JSON.stringify(users));

            window.location.href = 'login.html';
        });
    }

    // ==========================================
    // 2. كود صفحة تسجيل الدخول (Login Page)
    // ==========================================
    const loginForm = document.querySelector('form[name="login"]');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const loginInput = document.getElementById('login').value.trim();
            const passwordInput = document.getElementById('ps').value;

            if (loginInput === '' || passwordInput === '') {
                alert('الرجاء إدخال اسم المستخدم وكلمة المرور!');
                return;
            }

            try {
                const response = await fetch('../users.json');
                const fileUsers = await response.json();

                const localUsers = JSON.parse(localStorage.getItem('usersList')) || [];

                const allUsers = [...fileUsers, ...localUsers];

                let foundUser = allUsers.find(u => 
                    (u.email === loginInput || u.firstName === loginInput) && u.password === passwordInput
                );

                if (foundUser) {
                    // تحويل مباشر وبدون أي رسالة Alert نهائياً!
                    window.location.href = 'index.html';
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