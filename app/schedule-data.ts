export type ScheduleMatch = readonly [date: string, time: string, matchup: string, stage: string, score: string];

export const schedule = [
  ["08/17（日）", "13:30", "香港 vs 日本", "B組預賽", "1：14"],
  ["08/17（日）", "13:30", "斯里蘭卡 vs 菲律賓", "B組預賽", "1：11"],
  ["08/17（日）", "18:30", "韓國 vs 台灣", "A組預賽", "5：3"],
  ["08/17（日）", "19:30", "巴基斯坦 vs 泰國", "A組預賽", "16：2"],
  ["08/18（一）", "13:30", "香港 vs 菲律賓", "B組預賽", "2：3"],
  ["08/18（一）", "13:30", "日本 vs 斯里蘭卡", "B組預賽", "24：1"],
  ["08/18（一）", "18:30", "泰國 vs 韓國", "A組預賽", "0：16"],
  ["08/18（一）", "18:30", "台灣 vs 巴基斯坦", "A組預賽", "27：0"],
  ["08/19（二）", "13:30", "巴基斯坦 vs 韓國", "A組預賽", "0：24"],
  ["08/19（二）", "13:30", "菲律賓 vs 日本", "B組預賽", "0：10"],
  ["08/19（二）", "18:30", "斯里蘭卡 vs 香港", "B組預賽", "3：10"],
  ["08/19（二）", "18:30", "泰國 vs 台灣", "A組預賽", "0：18"],
  ["08/21（四）", "13:30", "日本 vs 韓國", "超級循環賽", "5：1"],
  ["08/21（四）", "13:30", "斯里蘭卡 vs 泰國", "排名賽", "7：3"],
  ["08/21（四）", "18:30", "台灣 vs 菲律賓", "超級循環賽", "10：0"],
  ["08/21（四）", "18:30", "巴基斯坦 vs 香港", "排名賽", "3：4"],
  ["08/22（五）", "13:30", "韓國 vs 菲律賓", "超級循環賽", "16：1"],
  ["08/22（五）", "13:30", "香港 vs 泰國", "排名賽", "12：2"],
  ["08/22（五）", "18:30", "日本 vs 台灣", "超級循環賽", "7：10"],
  ["08/22（五）", "18:30", "巴基斯坦 vs 斯里蘭卡", "排名賽", "9：5"],
  ["08/23（六）", "13:00", "菲律賓 vs 韓國", "季軍賽", "0：15"],
  ["08/23（六）", "18:30", "日本 vs 台灣", "冠軍賽", "0：3"],
] as const satisfies readonly ScheduleMatch[];

export const teamFlagSrc: Record<string, string> = {
  台灣: "/generated-scenes/flags/tw.svg",
  日本: "/generated-scenes/flags/jp.svg",
  韓國: "/generated-scenes/flags/kr.svg",
  香港: "/generated-scenes/flags/hk.svg",
  菲律賓: "/generated-scenes/flags/ph.svg",
  斯里蘭卡: "/generated-scenes/flags/lk.svg",
  巴基斯坦: "/generated-scenes/flags/pk.svg",
  泰國: "/generated-scenes/flags/th.svg",
};

export const teamOptions = ["中華", "日本", "韓國", "香港", "泰國", "菲律賓", "巴基斯坦", "斯里蘭卡"] as const;
export const stageOptions = ["A 組預賽", "B 組預賽", "超級循環賽", "排名賽", "季軍賽", "冠軍賽"] as const;

export type ScheduleFilters = { team: string; stage: string; search: string };

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/(?:中華|[台臺]灣)(?:隊)?/gu, "中華").replace(/\s+/gu, "");
}

export function filterSchedule(matches: readonly ScheduleMatch[], filters: ScheduleFilters): readonly ScheduleMatch[] {
  const team = normalize(filters.team);
  const stage = normalize(filters.stage);
  const terms = filters.search.trim().split(/\s+/u).filter(Boolean).map(normalize);

  return matches.filter(match => {
    const [, , matchup, matchStage] = match;
    const teams = matchup.split(" vs ").map(normalize);
    const searchable = normalize(match.join(" "));
    return (!team || teams.includes(team))
      && (!stage || normalize(matchStage) === stage)
      && terms.every(term => searchable.includes(term));
  });
}
