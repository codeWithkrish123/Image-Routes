# FotoFix Backend – API Guide

A Node.js + Express + MongoDB backend with Cloudinary + Sharp for image processing.

## Quick Start

- Node 18+
- Install deps: `npm install`
- Dev: `npm run dev`
- Prod: `npm start`

## Environment Variables (.env)

Copy these to `.env` (values are examples):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes

- Never commit `.env`.
- Ensure Cloudinary credentials are correct from your Cloudinary Console.

## Folder Overview

- `server.js`: App entry
- `routes/`: Express routes
- `controllers/`: Business logic
- `middleware/`: Auth, multer, errors
- `config/`: DB + Cloudinary config
- `model/`: Mongoose models
- `Utils/`: Sharp image operations

## Auth Endpoints

Base URL: `http://localhost:5000/api/auth`

- POST `/register`

  - Body (JSON):
    ```json
    { "name":"Test User", "email":"test@example.com", "password":"password123" }
    ```
  - Returns: user + JWT
- POST `/login`

  - Body (JSON):
    ```json
    { "email":"test@example.com", "password":"password123" }
    ```
  - Returns: user + JWT

Use the JWT in subsequent requests:

- Header: `Authorization: Bearer <token>`

## Image Endpoints

Base URL: `http://localhost:5000/api/images`

All below require auth header: `Authorization: Bearer <token>`
and Body type: `multipart/form-data` with file field name `image`.

- POST `/upload`

  - Body (form-data):
    - `image` (File)
  - Response: `{ image: { _id, url, public_id, ... } }`
- POST `/crop`

  - Body (form-data):
    - `image` (File)
    - `x` (Number)
    - `y` (Number)
    - `width` (Number)
    - `height` (Number)
  - Response: `{ url, public_id }`
- POST `/rotate`

  - Body (form-data):
    - `image` (File)
    - `angle` (Number, e.g., 90, 180, -90)
  - Response: `{ url, public_id }`
- POST `/adjust`

  - Body (form-data):
    - `image` (File)
    - `brightness` (Number, default 1)
    - `contrast` (Number, default 1)
  - Response: `{ url, public_id }`
- POST `/convert`

  - Body (form-data):
    - `image` (File)
    - `format` (String: `jpeg|png|webp`)
  - Response: `{ url, public_id }`

Placeholders (currently return a message):

- POST `/find-object`
- POST `/extract-text`
- POST `/magic-brush`

## Postman How-To

1. Create a request
2. Set Method + URL per endpoint above
3. For protected endpoints add header: `Authorization: Bearer <token>`
4. Body tab → `form-data` for image endpoints
   - Add key `image` → type File → choose your image
   - Add any extra fields (e.g., `angle`, `x`, `y`, `width`, `height`)
5. Send

Tip: Do not manually set `Content-Type`; Postman sets the multipart boundary automatically.

## cURL Examples

Upload

```bash
curl -X POST http://localhost:5000/api/images/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg"
```

Crop

```bash
curl -X POST http://localhost:5000/api/images/crop \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "x=100" -F "y=100" -F "width=300" -F "height=300"
```

Rotate

```bash
curl -X POST http://localhost:5000/api/images/rotate \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "angle=90"
```

Adjust

```bash
curl -X POST http://localhost:5000/api/images/adjust \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "brightness=1.2" -F "contrast=1.1"
```

Convert

```bash
curl -X POST http://localhost:5000/api/images/convert \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "format=webp"
```

## Troubleshooting

- MulterError: Unexpected field
  - Ensure file key is `image` (routes use `upload.single('image')`).
- 400 No file
  - Use `multipart/form-data` and select a file.
- 401 Unauthorized
  - Provide `Authorization: Bearer <token>` from login.
- Cloudinary errors
  - Check `CLOUDINARY_*` values. Make sure `.env` is loaded and `config/cloudinary.js` calls `cloudinary.config(...)`.
- ECONNRESET in Postman
  - Often due to bad multipart body or field name mismatch. Recreate the request with correct form-data keys.

## Security Notes

- Keep JWT short-lived for production and rotate secrets as needed.
- Set `secure: true` for cookies if you later use cookie-based auth and run behind HTTPS.
- Validate and sanitize all user inputs.

## Health Check

- GET `http://localhost:5000/api/ping` → `{ ok: true }`

---

If you want GET endpoints to list/fetch images (e.g., `/api/images` and `/api/images/:id`), let me know and I will add them and update this README accordingly.
