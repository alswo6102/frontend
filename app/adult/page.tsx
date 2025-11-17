/**
 * AdultAdminPage
 * - 운영진용 관리 페이지
 * - 팀 빌딩, 응답 삭제, 리셋, 팀별 카드 표시
 */

'use client';

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import {
  getAdultResults,
  getTeamInfo,
  buildTeams,
  deleteMember,
  deleteTeams,
} from "@/lib/api";

import Loading from "@/components/common/Loading";

import AnswerCard from "@/components/admin/AnswerCard";
import TeamBuildControls from "@/components/admin/TeamBuildControls";
import TeamSelectMobile from "@/components/admin/TeamSelectMobile";
import TeamSelectPC from "@/components/admin/TeamSelectPC";
import TeamCards from "@/components/admin/TeamCards";
import DeleteModal from "@/components/admin/DeleteModal";
import ResetModal from "@/components/admin/ResetModal";

export default function AdultAdminPage() {
  const [totalMembers, setTotalMembers] = useState(30);
  const [teamCount, setTeamCount] = useState(5);
  const [answerCount, setAnswerCount] = useState(0);

  const [results, setResults] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [hasUnbuiltMembers, setHasUnbuiltMembers] = useState(true);
  const [activeTeam, setActiveTeam] = useState(0);

  const [loading, setLoading] = useState(true);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const TEAM_COLORS = ["#FF6F00", "#007AFF", "#34C759", "#AF52DE", "#FF3B30", "#5AC8FA"];

  // 응답 조회
  const loadAdultResults = async () => {
    try {
      const data = await getAdultResults();
      setAnswerCount(data.memberCount ?? 0);
      setResults(data.results ?? []);
    } catch {
      console.error("어른사자 응답 조회 실패");
    }
  };

  // 팀 정보 조회
  const loadTeamInfo = async () => {
    if (results.length === 0) return;

    try {
      const data = await getTeamInfo();
      setHasUnbuiltMembers(data.hasUnbuiltMembers);

      const answerMap = new Map(results.map((r) => [r.memberName, r.answers]));

      const mergedTeams = (data.teams ?? []).map((team: any) => ({
        ...team,
        members: team.members.map((m: any) => ({
          ...m,
          answers: answerMap.get(m.name) ?? {},
        })),
      }));

      setTeams(mergedTeams);
    } catch {
      console.error("팀 정보 조회 실패");
    }
  };

  // 팀 빌딩 실행
  const handleBuildTeams = async () => {
    try {
      await buildTeams(totalMembers, teamCount);
      alert("팀 빌딩이 완료되었습니다!");
      await loadTeamInfo();
    } catch (err: any) {
      alert(err?.message ?? "팀 빌딩 실패");
    }
  };

  // 개별 응답 삭제
  const handleDeleteAnswer = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteMember(deleteTargetId);

      setResults((prev) => prev.filter((r) => r.memberId !== deleteTargetId));
      setAnswerCount((prev) => prev - 1);
      setTotalMembers((prev) => prev - 1);

      alert("삭제되었습니다.");
    } catch {
      alert("삭제 실패");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  // 팀 전체 초기화 (리셋)
  const confirmResetTeams = async () => {
    setShowResetModal(false);

    try {
      await deleteTeams();
      alert("팀 데이터 초기화 완료!");

      setTeams([]);
      setHasUnbuiltMembers(true);
      setActiveTeam(0);

      await loadAdultResults();
    } catch {
      alert("초기화 실패");
    }
  };

  // 초기 로딩
  useEffect(() => {
    (async () => {
      await loadAdultResults();
      setLoading(false);
    })();
  }, []);

  // 응답 불러온 뒤 팀 정보 로딩
  useEffect(() => {
    loadTeamInfo();
  }, [results]);

  // 총원 자동 동기화
  useEffect(() => {
    if (answerCount > 0) setTotalMembers(answerCount);
  }, [answerCount]);

  if (loading) return <Loading />;

  return (
    <>
      {/* 모달 */}
      <DeleteModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        onConfirm={handleDeleteAnswer}
      />

      <ResetModal
        show={showResetModal}
        setShow={setShowResetModal}
        onConfirm={confirmResetTeams}
      />

      {/* PAGE */}
      <div className="w-full max-w-[375px] md:max-w-[1000px] flex flex-col items-center mt-3 px-6 gap-6">
        
        {/* INPUT UI: 총원/팀개수 + 빌딩 버튼 */}
        <TeamBuildControls
          totalMembers={totalMembers}
          setTotalMembers={setTotalMembers}
          teamCount={teamCount}
          setTeamCount={setTeamCount}
          hasUnbuiltMembers={hasUnbuiltMembers}
          answerCount={answerCount}
          handleBuildTeams={handleBuildTeams}
        />

        {/* 응답 정보 */}
        <p className="text-m bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-center w-full md:w-[600px]">
          응답: {answerCount} / {totalMembers}
        </p>

        {/* TEAM UI */}
        {teams.length > 0 && !hasUnbuiltMembers ? (
          <>
            <TeamSelectMobile
              teams={teams}
              activeTeam={activeTeam}
              setActiveTeam={setActiveTeam}
            />

            <TeamSelectPC
              teams={teams}
              TEAM_COLORS={TEAM_COLORS}
              activeTeam={activeTeam}
              setActiveTeam={setActiveTeam}
            />

            <TeamCards
              teams={teams}
              activeTeam={activeTeam}
              TEAM_COLORS={TEAM_COLORS}
            />
          </>
        ) : (
          <div className="w-full flex flex-col gap-4 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((item) => (
                <div key={item.memberId} className="relative">
                  <AnswerCard
                    name={item.memberName}
                    answers={item.answers}
                  />

                  <button
                    onClick={() => {
                      setDeleteTargetId(item.memberId);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-4 right-4 text-red-500 hover:scale-110 transition"
                  >
                    <Trash2 size={20} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESET 버튼 */}
        {!hasUnbuiltMembers && (
          <div className="w-full flex justify-center mt-24 mb-3">
            <button
              onClick={() => setShowResetModal(true)}
              className="text-sm bg-red-500 border border-gray-300 text-white px-4 py-2 rounded-full hover:brightness-95"
            >
              전체 리셋
            </button>
          </div>
        )}
      </div>
    </>
  );
}