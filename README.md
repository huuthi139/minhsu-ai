# 🔮 Minh Sư AI — Khám Phá Vận Mệnh Bằng Trí Tuệ AI

Du Già Mật Tông Thiên Cẩm Sơn

## Deploy lên GitHub Pages

### Cách 1: Auto deploy (khuyên dùng)

1. Tạo repo mới trên GitHub tên `minhsu-ai`
2. Upload toàn bộ folder này lên repo (branch `main`)
3. Vào **Settings → Pages → Source** chọn **GitHub Actions**
4. Push code → GitHub tự build + deploy
5. Truy cập: `https://<username>.github.io/minhsu-ai/`

### Cách 2: Manual deploy (nhanh hơn)

1. Tạo repo mới trên GitHub tên `minhsu-ai`  
2. Chỉ upload nội dung folder `dist/` lên branch `gh-pages`
3. Vào **Settings → Pages → Source** chọn **Deploy from a branch** → `gh-pages` → `/ (root)`
4. Truy cập: `https://<username>.github.io/minhsu-ai/`

## Dev local

```bash
npm install
npx vite          # dev server
npx vite build    # production build
```

## Tech Stack
- React 19 + Vite
- Inline styles (no CSS framework)
- Thần Số Học (Pythagorean) calculator
- DISC Profile mapping
- Tứ Trụ Bát Tự / Ngũ Hành / Nạp Âm
