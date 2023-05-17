# JobFinding-Server
Phần backend cho ứng dụng JobFinding
## Installation

Sau khi clone project, chạy dòng sau trên terminal:

```bash
npm install
```

## Usage
Sau khi cài xong các packages trong package.json, đến file configs/db.config.js và sửa các dòng sau:
```
HOST: "localhost",
USER: "root",
PASSWORD: "235689jkl",
PORT: 3307
```
Thay các thông số theo MySQL đã cài sẵn trên máy (có thể sử dụng MySQL Workbench)

Sau khi thay đổi, chạy câu lệnh sau trên terminal:
```
npm start
```

Cần chạy server trước khi chạy app.