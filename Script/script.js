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

    // ==========================================
    // 3. الخطوة الأولى: طلب البريد الإلكتروني (forgot-password_3.html)
    // ==========================================
    const forgotEmailForm = document.querySelector('form[name="reset-password"]');

    if (forgotEmailForm) {
        forgotEmailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const targetEmail = document.getElementById('em').value.trim();

            try {
                const response = await fetch('../users.json');
                const fileUsers = await response.json();
                const localUsers = JSON.parse(localStorage.getItem('usersList')) || [];
                const allUsers = [...fileUsers, ...localUsers];

                const userExists = allUsers.find(u => u.email === targetEmail);

                if (!userExists) {
                    alert('البريد الإلكتروني غير مسجل في النظام!');
                    return;
                }

                // توليد كود عشوائي من 4 أرقام
                const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

                // تخزين الإيميل والكود مؤقتاً في localStorage
                localStorage.setItem('resetEmail', targetEmail);
                localStorage.setItem('resetOTP', generatedOTP);

                // الانتقال لصفحة التحقق (verify-code.html)
                window.location.href = 'verify-code.html';

            } catch (error) {
                console.error('Error checking email:', error);
                alert('حدث خطأ أثناء التحقق من البريد.');
            }
        });
    }

    // ==========================================
    // 4. الخطوة الثانية: وضع الكود تلقائياً في البوكس والتحقق منه (verify-code.html)
    // ==========================================
    const numberInput = document.getElementById('number');
    const verifyForm = document.getElementById('verifyForm');
    const successMessage = document.getElementById('success-message');

    // طبع الكود تلقائياً داخل البوكس فور فتح الصفحة
    if (numberInput) {
        const savedOTP = localStorage.getItem('resetOTP');
        if (savedOTP) {
            numberInput.value = savedOTP;
        } else {
            numberInput.value = "";
        }
    }

    if (verifyForm) {
        verifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const enteredCode = numberInput.value.trim();
            const savedOTP = localStorage.getItem('resetOTP');

            if (enteredCode !== savedOTP) {
                alert('كود التحقق غير صحيح!');
                return;
            }

            // إظهار الرسالة الخضراء أعلى الشاشة بنجاح التحقق
            if (successMessage) {
                successMessage.style.display = 'block';
            }

            // الانتقال لصفحة تعيين كلمة المرور الجديدة بعد ثانية واحدة
            setTimeout(function() {
                window.location.href = 'reset-password.html';
            }, 1200);
        });
    }

    // ==========================================
    // 5. الخطوة الثالثة: تعيين كلمة المرور الجديدة (reset-password_2.html)
    // ==========================================
    const updatePasswordForm = document.querySelector('form[name="forgot-password"]');

    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const newPassword = document.getElementById('newps').value;
            const confirmNewPassword = document.getElementById('cnewps').value;
            const targetEmail = localStorage.getItem('resetEmail');

            if (newPassword !== confirmNewPassword) {
                alert('كلمتا المرور غير متطابقتين!');
                return;
            }

            if (newPassword.length < 6) {
                alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
                return;
            }

            let localUsers = JSON.parse(localStorage.getItem('usersList')) || [];
            let userIndex = localUsers.findIndex(u => u.email === targetEmail);

            if (userIndex !== -1) {
                localUsers[userIndex].password = newPassword;
                localStorage.setItem('usersList', JSON.stringify(localUsers));
            } else {
                try {
                    const response = await fetch('../users.json');
                    const fileUsers = await response.json();
                    let defaultUser = fileUsers.find(u => u.email === targetEmail);
                    if (defaultUser) {
                        defaultUser.password = newPassword;
                        localUsers.push(defaultUser);
                        localStorage.setItem('usersList', JSON.stringify(localUsers));
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            // تنظيف بيانات الاستعادة المؤقتة
            localStorage.removeItem('resetOTP');
            localStorage.removeItem('resetEmail');

            alert('تم تحديث كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.');
            window.location.href = 'login.html';
        });
    }

});