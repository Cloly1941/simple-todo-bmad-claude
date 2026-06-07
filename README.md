# smiple-todo v0.0.0

<div align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000" alt="JavaScript">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/Node.js_Test_Runner-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Test Runner">
</div>

## 🚀 Giới thiệu

**smiple-todo v0.0.0** là ứng dụng todo list nhỏ gọn, chạy hoàn toàn phía client, được xây dựng với **Vite Vanilla JavaScript**.

Dự án tập trung vào trải nghiệm quản lý task đơn giản: thêm việc cần làm, đánh dấu task quan trọng, chỉnh sửa tiêu đề, hoàn thành task và xóa task. Toàn bộ dữ liệu được lưu trong **localStorage** của trình duyệt nên không cần backend, đăng nhập hay cơ sở dữ liệu.

Ứng dụng được thiết kế theo tinh thần **Warm Minimal** với giao diện nhẹ, responsive, có trạng thái loading ban đầu, inline validation và các control có nhãn truy cập rõ ràng.

---

## ✨ Tính năng chính

- Thêm task mới với validation chống tiêu đề rỗng hoặc chỉ chứa khoảng trắng.
- Hiển thị danh sách **Active** cho các task đang làm.
- Đánh dấu hoặc bỏ đánh dấu task là **Important**.
- Tự động ưu tiên task quan trọng lên đầu danh sách Active.
- Chỉnh sửa tiêu đề task ngay trong danh sách.
- Đánh dấu task hoàn thành và chuyển sang khu vực **Completed**.
- Xóa task khỏi Active hoặc Completed.
- Lưu task cục bộ bằng `localStorage` với schema rõ ràng và fallback an toàn khi dữ liệu hỏng.
- Empty state riêng cho danh sách Active và Completed.
- Trạng thái loading ban đầu giúp tránh flash giao diện chưa render.
- Giao diện responsive, semantic HTML, keyboard-friendly và có accessible labels cho các thao tác chính.
- Test bằng Node.js built-in test runner.

---

## 🛠️ Tech Stack

- [Vite](https://vite.dev/) – Development server và production build cho ứng dụng frontend.
- [JavaScript ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) – Tổ chức logic theo module nhỏ, dễ kiểm thử.
- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) – App shell tĩnh, semantic markup và accessibility baseline.
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) – Design system bằng CSS custom properties, responsive layout và micro-interactions.
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) – Lưu dữ liệu task cục bộ trên trình duyệt.
- [Node.js Test Runner](https://nodejs.org/api/test.html) – Unit test cho validation, storage, task model, render view model và app shell.

---

## 📂 Cấu trúc thư mục

```text
.
├── docs/                       # Tài liệu BMad, PRD, architecture, stories và specs
├── public/
│   └── favicon.svg             # Favicon của ứng dụng
├── src/
│   ├── main.js                 # Controller chính: event handling, render và persistence
│   ├── styles.css              # Warm Minimal design system và responsive UI
│   ├── tasks.js                # Task model, actions và selectors
│   ├── storage.js              # localStorage adapter và schema guard
│   ├── validation.js           # Validation tiêu đề task
│   ├── render.js               # DOM rendering và view model cho task
│   ├── app-shell.test.js       # Test app shell và loading behavior
│   ├── render.test.js          # Test render/view model
│   ├── storage.test.js         # Test persistence layer
│   ├── tasks.test.js           # Test task actions/selectors
│   └── validation.test.js      # Test validation helper
├── index.html                  # HTML entry point và first-paint loading markup
├── package.json                # Scripts và dependencies
└── README.md                   # Tài liệu dự án
```

---

## 🧭 Luồng sử dụng chính

| Luồng                  | Mô tả                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| Thêm task              | Nhập tiêu đề task và bấm **Add** để đưa vào danh sách Active          |
| Validation             | Tiêu đề rỗng sẽ hiển thị inline error và giữ focus ở input            |
| Đánh dấu quan trọng    | Bấm **Important** để gắn nhãn Important và ưu tiên task lên đầu       |
| Bỏ đánh dấu quan trọng | Bấm **Unmark** để đưa task về trạng thái bình thường                  |
| Chỉnh sửa task         | Bấm **Edit**, cập nhật tiêu đề, sau đó **Save** hoặc **Cancel**       |
| Hoàn thành task        | Bấm **Complete** để chuyển task từ Active sang Completed              |
| Xóa task               | Bấm **Delete** để xóa task khỏi localStorage và giao diện hiện tại    |
| Tải lại trang          | Task đã lưu sẽ được đọc lại từ localStorage khi mở lại ứng dụng       |

---

## ⚙️ Cài đặt & chạy dự án

### Yêu cầu

- Node.js phiên bản tương thích với Vite 5
- npm
- Trình duyệt hiện đại có hỗ trợ ES Modules và localStorage

### Cài đặt dependencies

```bash
npm install
```

### Chạy development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ Vite hiển thị trong terminal, thường là:

```bash
http://localhost:5173
```

### Build production

```bash
npm run build
```

Output production sẽ được tạo trong thư mục:

```bash
dist/
```

### Preview production build

```bash
npm run preview
```

---

## 🧪 Testing

Chạy toàn bộ test:

```bash
npm test
```

Test hiện tại bao phủ các nhóm chính:

- Validation tiêu đề task.
- Tạo, sửa, hoàn thành, đánh dấu quan trọng, sắp xếp và xóa task.
- Đọc/ghi localStorage và fallback khi dữ liệu không hợp lệ.
- View model/render behavior cho Active, Editing và Completed task.
- App shell, loading markup, noscript fallback và luồng reveal giao diện sau render đầu tiên.

---

## 📜 Scripts

| Script            | Mô tả                                          |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Chạy Vite development server                   |
| `npm run build`   | Build static site production                   |
| `npm run preview` | Preview production build sau khi build         |
| `npm test`        | Chạy toàn bộ test bằng Node.js built-in runner |

---

## 🔧 Ghi chú triển khai

- Ứng dụng là static frontend, không có backend, API, authentication hoặc database.
- Task được lưu bằng key `smiple-todo.tasks` trong localStorage.
- Dữ liệu task chỉ tồn tại trên trình duyệt/thiết bị hiện tại của người dùng.
- Storage layer kiểm tra schema khi đọc dữ liệu và trả về danh sách rỗng nếu dữ liệu không hợp lệ.
- Render layer dùng `textContent` để hiển thị tiêu đề task an toàn thay vì chèn HTML trực tiếp.
- Test script hiện tại chạy các file `src/**/*.test.js` bằng Node.js built-in test runner.

---

## 📄 License

Dự án được phát triển với mục đích học tập, thực hành quy trình BMad và xây dựng một todo app local-first bằng HTML, CSS và JavaScript thuần.
