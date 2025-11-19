# --- 1. 빌드 스테이지 (Builder) ---
# 이 스테이지는 소스코드를 빌드하는 역할만 하며, 최종 이미지에는 포함되지 않습니다.
FROM node:20-alpine AS builder
WORKDIR /app

# devDependencies를 포함한 모든 의존성을 설치합니다.
# next build는 typescript와 같은 개발용 라이브러리를 필요로 합니다.
COPY package.json package-lock.json* ./
RUN npm install

# 소스코드를 복사합니다.
COPY . .

# Next.js 앱을 빌드합니다.
RUN npm run build

# --- 2. 프로덕션 스테이지 (Runner) ---
# 최종적으로 실행될 가벼운 이미지입니다.
FROM node:20-alpine AS runner
WORKDIR /app

# 프로덕션 환경에 필요한 환경변수를 설정합니다.
ENV NODE_ENV production

# 빌드 스테이지로부터 빌드 결과물(.next 폴더)을 복사합니다.
COPY --from=builder /app/.next ./.next

# 프로덕션용 의존성만 새로 설치합니다.
# 이렇게 하면 최종 이미지에 devDependencies가 포함되지 않아 용량이 줄어듭니다.
COPY --from=builder /app/package.json ./package.json
RUN npm install --production

EXPOSE 3000

# Next.js 프로덕션 서버를 시작합니다.
CMD ["npm", "start"]
