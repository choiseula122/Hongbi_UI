// server.js

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // .env에서 API 키 읽어오기

const app = express();
const PORT = process.env.PORT || 3000; // 환경변수에서 포트 읽거나 기본 3000 사용

app.use(cors()); // 모든 origin 허용 (필요시 제한 가능)
app.use(express.json()); // JSON 요청 바디 파싱

// /chat 경로로 POST 요청 오면 OpenAI에 프록시 요청
app.post('/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // 보안상 중요
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

const data = await response.json();

// ✅ 응답 실패 시 로그 출력
if (!response.ok) {
  console.error('🔴 OpenAI 응답 오류:', data);  // 콘솔에 에러 로그
  return res.status(response.status).json({ error: data });
}

res.json(data); // 성공한 경우 그대로 반환

  } catch (error) {
    console.error('OpenAI API 오류:', error);
    res.status(500).json({ error: 'OpenAI API 호출 실패' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
