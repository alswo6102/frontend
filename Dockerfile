# --- 1. 의존성 설치 스테이지 (Dependencies) ---
# 소스코드를 복사하기 전에 의존성만 먼저 설치하여 Docker 캐시를 최대한 활용합니다.
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

# --- 2. 빌드 스테이지 (Builder) ---
# 실제 소스코드를 빌드하는 스테이지입니다.
FROM node:20-alpine AS builder
WORKDIR /app

# 위 'deps' 스테이지에서 설치된 node_modules를 복사합니다.
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 앱을 빌드합니다.
RUN npm run build

# --- 3. 프로덕션 스테이지 (Runner) ---
# 최종적으로 실행될 가벼운 이미지입니다.
FROM node:20-alpine AS runner
WORKDIR /app

# 프로덕션 환경에 필요한 환경변수를 설정합니다.
ENV NODE_ENV production

# Next.js가 자동으로 생성하는 기본 사용자를 사용합니다.
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# 빌드에 필요한 파일들만 최종 이미지로 복사합니다.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# USER nextjs

EXPOSE 3000

# Next.js 프로덕션 서버를 시작합니다.
CMD ["npm", "start"]
