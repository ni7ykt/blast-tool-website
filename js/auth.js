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
    
    // 檢查帳號是否已存在
    if (users[username]) {
        return { success: false, message: '❌ 此帳號已被使用！' };
    }
    
    // 儲存使用者
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
    
    // 儲存登入狀態
    sessionStorage.setItem('blast_user', JSON.stringify({
        username: username,
        email: users[username].email,
        avatar: users[username].avatar
    }));
    
    return { success: true, message: '✅ 登入成功！' };
}

// 登出
function logoutUser() {
    sessionStorage.removeItem('blast_user');
    window.location.href = 'index.html';
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

// 顯示使用者名稱（放在導航欄）
function updateNavbar() {
    const user = getCurrentUser();
    const nav = document.querySelector('nav .flex.items-center.gap-4');
    
    if (user && nav) {
        nav.innerHTML = `
            <span class="text-cyan-400 text-sm">👤 ${user.username}</span>
            <a href="dashboard.html" class="hover:text-cyan-400 transition text-sm">儀表板</a>
            <a href="#" onclick="logoutUser()" class="text-red-400 hover:text-red-300 transition text-sm">登出</a>
        `;
    }
}
