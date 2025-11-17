/**
 * API 함수 모음!!
 * - loginUser: 로그인
 * - joinUser: 회원가입/질문 제출
 * - getUserInfo: 유저 정보 조회
 * - getQuestions: 질문 리스트 조회
 * - buildTeams: 팀 빌딩 실행
 * - getTeamInfo: 팀 정보 조회
 * - deleteMember: 개별 유저 삭제
 * - deleteTeams: 팀 삭제
 * - getAdultResults: 어른사자 결과 조회
 * 
 * fetchJSON으로 공통 fetch 처리
 */

import { LoginRequest, LoginResponse, Question, MyPageUser } from "./types";

export const API_BASE_URL = 'https://cauhackathon-team2.p-e.kr';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any = null;

  try { 
    data = text ? JSON.parse(text) : null; 
  } catch { 
    data = text; 
  }

  if (!res.ok) {
    const err: any = new Error(data?.message ?? res.statusText ?? 'API 호출 실패');
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}

// 로그인
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return fetchJSON(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// 회원가입 + 질문 제출
export async function joinUser(body: { name: string; password: string; gender?: string; answers: Record<string, string> }): Promise<{ id: number }> {
  return fetchJSON(`${API_BASE_URL}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// 유저 정보 조회 (MyPageUser 타입 반환으로 수정)
export async function getUserInfo(id: number): Promise<MyPageUser> { // MyPageUser 반환
  // fetchJSON 함수가 이미 API_BASE_URL을 사용하므로 경로를 통일합니다.
  // 이 API 명세에는 Authorization 헤더가 없으나, 필요하다면 fetchJSON을 수정하거나 별도 함수를 쓰는 것이 좋습니다.
  // 현재 명세와 MyPageUser 타입에 맞춰 수정합니다.
  return fetchJSON<MyPageUser>(`${API_BASE_URL}/my/${id}`);
}

// 질문 리스트 조회
export async function getQuestions(): Promise<Question[]> {
  return fetchJSON(`${API_BASE_URL}/question`);
}

// 팀 빌딩 실행
export async function buildTeams(totalMembers: number, teamCount: number): Promise<any> {
  return fetchJSON(`${API_BASE_URL}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ totalMembers, teamCount }),
  });
}

// 팀 정보 조회
export async function getTeamInfo(): Promise<any> {
  return fetchJSON(`${API_BASE_URL}/team`);
}

// 개별 유저 삭제
export async function deleteMember(id: number): Promise<void> {
  return fetchJSON(`${API_BASE_URL}/member/${id}`, { method: 'DELETE' });
}

// 팀 삭제
export async function deleteTeams(): Promise<void> {
  const token = localStorage.getItem("token");
  return fetchJSON(`${API_BASE_URL}/team`, {
    method: 'DELETE',
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
}

// 어른사자
export async function getAdultResults(): Promise<any> {
  return fetchJSON(`${API_BASE_URL}/adult`);
}