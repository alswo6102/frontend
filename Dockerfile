# --- 1. 빌드 스테이지 (Builder) ---
# TypeScript를 JavaScript로 컴파일하는 역할
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 1. 의존성 설치 (소스코드 복사보다 먼저 수행하여 Docker 캐시 활용)
COPY package*.json ./
RUN npm install

# 2. 소스코드 복사
COPY . .

# 3. TypeScript 컴파일
RUN npm run build

# --- 2. 프로덕션 스테이지 (Runner) ---
# 실제 애플리케이션을 실행하는 역할
FROM node:20-alpine

WORKDIR /usr/src/app

# 1. 프로덕션용 의존성만 설치하기 위해 package.json 복사
COPY package*.json ./
RUN npm install --omit=dev --production

# 2. 빌드 스테이지에서 컴파일된 결과물만 복사
COPY --from=builder /usr/src/app/dist ./dist

# 애플리케이션이 사용할 포트 노출 (예: 3000번)
EXPOSE 3000

# 컨테이너 시작 시 실행될 명령어
# 컴파일된 JavaScript 파일을 직접 실행
CMD [ "node", "dist/index.js" ]
