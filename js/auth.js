// ============================================
// 🔐 登入/註冊系統 (LocalStorage)
// ============================================

// 取得所有使用者
function getUsers() {
    const users = localStorage.getItem('blast_users');
    return users ? JSON.parse(users) : {};
}

// 儲存使用者
function saveUsers(users) {
    localStorage.setItem('blast_users', JSON.stringify(users));
}

// 註冊
function registerUser(username, password, email = '') {
    const users = getUsers();
    
    if (users[username]) {
        return { success: false, message: '❌ 此帳號已被使用！' };
    }
    
    // 檢查信箱是否已被註冊
    for (let key in users) {
        if (users[key].email && users[key].email === email) {
            return { success: false, message: '❌ 此信箱已被註冊！' };
        }
    }
    
    users[username] = {
        password: password,
        email: email,
        created_at: new Date().toISOString(),
        avatar: 'https://i.pinimg.com/1200x/13/41/45/13414519583c03a8576b45d6171c11c9.jpg'
    };
    saveUsers(users);
    return { success: true, message: '✅ 註冊成功！' };
}

// 登入
function loginUser(username, password) {
    const users = getUsers();
    
    if (!users[username]) {
        return { success: false, message: '❌ 帳號不存在！' };
    }
    
    if (users[username].password !== password) {
        return { success: false, message: '❌ 密碼錯誤！' };
    }
    
    sessionStorage.setItem('blast_user', JSON.stringify({
        username: username,
        email: users[username].email || '',
        avatar: users[username].avatar || 'https://i.pinimg.com/1200x/13/41/45/13414519583c03a8576b45d6171c11c9.jpg'
    }));
    
    return { success: true, message: '✅ 登入成功！' };
}

// 登出
function logoutUser() {
    sessionStorage.removeItem('blast_user');
    window.location.href = 'login.html';
}

// 檢查是否已登入
function isLoggedIn() {
    return sessionStorage.getItem('blast_user') !== null;
}

// 取得當前使用者
function getCurrentUser() {
    const user = sessionStorage.getItem('blast_user');
    return user ? JSON.parse(user) : null;
}

// 檢查登入狀態，若未登入則跳轉
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ===== 忘記密碼相關 =====

function sendResetCode(email) {
    const users = getUsers();
    
    let foundUser = null;
    for (let key in users) {
        if (users[key].email === email) {
            foundUser = key;
            break;
        }
    }
    
    if (!foundUser) {
        return { success: false, message: '❌ 此信箱未註冊！' };
    }
    
    const code = String(Math.floor(100000 + Math.random() * 900000));
    
    const resetData = {
        username: foundUser,
        email: email,
        code: code,
        created_at: Date.now()
    };
    localStorage.setItem('reset_' + email, JSON.stringify(resetData));
    
    alert(`📧 驗證碼已寄送到 ${email}\n\n你的驗證碼是：${code}\n\n（實際會透過 Gmail 發送）`);
    
    return { success: true, message: '✅ 驗證碼已寄送！', code: code };
}

function verifyResetCode(email, code) {
    const key = 'reset_' + email;
    const data = localStorage.getItem(key);
    
    if (!data) {
        return { success: false, message: '❌ 驗證碼已過期，請重新申請！' };
    }
    
    const resetData = JSON.parse(data);
    
    if (Date.now() - resetData.created_at > 300000) {
        localStorage.removeItem(key);
        return { success: false, message: '❌ 驗證碼已過期，請重新申請！' };
    }
    
    if (resetData.code !== code) {
        return { success: false, message: '❌ 驗證碼錯誤！' };
    }
    
    return { success: true, message: '✅ 驗證成功！', username: resetData.username };
}

function resetPassword(email, newPassword) {
    const users = getUsers();
    
    let foundUser = null;
    for (let key in users) {
        if (users[key].email === email) {
            foundUser = key;
            break;
        }
    }
    
    if (!foundUser) {
        return { success: false, message: '❌ 使用者不存在！' };
    }
    
    users[foundUser].password = newPassword;
    saveUsers(users);
    
    localStorage.removeItem('reset_' + email);
    
    return { success: true, message: '✅ 密碼重設成功！' };
}
