module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        //   TODO Add Scope Enum Here
        // 'scope-enum': [2, 'always', ['auth', 'user', 'product', 'order']],
        'type-enum': [
            2,
            'always',
            [
                'feat',     // Thêm tính năng mới Ex: 'feat: add new feature' or 'feat(auth): add new feature #123'
                'fix',      // Sửa lỗi Ex: 'fix: fix auth bug' or 'fix(auth): fix auth bug #123'
                'docs',     // Thay đổi tài liệu Ex: 'docs: update README' or 'docs(auth): update auth docs #123'
                'chore',    // Các thay đổi không ảnh hưởng mã nguồn hoặc test (vd: cấu hình) Ex: 'chore: update dependencies' or 'chore(auth): update auth config #123'
                'style',    // Thay đổi về style code (không ảnh hưởng logic) Ex: 'style: format code' or 'style(auth): format auth code #123'
                'refactor', // Viết lại code không thêm tính năng hoặc sửa lỗi Ex: 'refactor: refactor auth logic' or 'refactor(auth): refactor auth logic #123'
                'ci',       // Các thay đổi liên quan đến CI/CD (ví dụ cấu hình pipeline) Ex: 'ci: update CI config' or 'ci(auth): update auth CI config #123'
                'test',     // Thêm hoặc sửa test case Ex: 'test: add auth tests' or 'test(auth): add auth tests #123'
                'revert',   // Hoàn tác commit trước đó Ex: 'revert: revert auth feature #123' or 'revert(auth): revert auth feature #123'
                'perf',     // Cải thiện hiệu năng Ex: 'perf: optimize auth performance' or 'perf(auth): optimize auth performance #123'
            ],
        ],
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-max-length': [2, 'always', 100],
        // 'scope-enum': [2, 'always', ['auth', 'user', 'product', 'order']], // nếu bạn dùng scope
    },
};