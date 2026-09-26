/*
 * ko_translate.js — 언바운드 웹도감 한글화 DOM 번역 계층
 *
 * 동작: window.KO_DICT(영문 원문 -> 한글) 을 바탕으로,
 *   1) sanitizeString 결과(이름/타입 등)를 번역하는 함수 KO_TRANSLATE 제공
 *   2) 화면에 그려진 "텍스트 노드"만 골라 한글로 치환 (클래스명/id/속성은 절대 건드리지 않음)
 *      -> 설명문, 게임 내 이름(ingameName) 등 sanitizeString을 거치지 않는 텍스트까지 모두 커버
 *
 * 매칭은 3단계 정규화로 관대하게:
 *   exact     : 앞뒤 공백만 제거한 원문 일치
 *   collapsed : 소문자 + 공백 1칸 정규화 일치 (줄바꿈/여러 공백 차이 흡수)
 *   fp        : 영숫자만 남긴 지문 일치 (문장부호/공백 차이까지 흡수, 긴 문자열 전용)
 */
(function () {
    "use strict";

    var RAW = window.KO_DICT || {};
    var FP_MIN = 8; // 지문 매칭은 이 길이 이상만 (짧은 UI 라벨 오매칭 방지)

    var exact = Object.create(null);
    var collapsed = Object.create(null);
    var loose = Object.create(null);
    var fp = Object.create(null);

    function collapseKey(s) {
        return s.replace(/\s+/g, " ").trim().toLowerCase();
    }
    // 발음기호 제거 + 소문자 + 문장부호를 공백으로 (단어 경계 유지)
    // 예: "Mr. Mime"/"Mr Mime", "Ho-Oh"/"Ho Oh", "Flabébé"/"Flabebe" 를 동일 키로
    function looseKey(s) {
        return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    }
    function fpKey(s) {
        return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "");
    }

    for (var en in RAW) {
        var ko = RAW[en];
        if (ko == null) continue;
        var t = en.trim();
        if (!t) continue;
        if (!(t in exact)) exact[t] = ko;
        var c = collapseKey(en);
        if (c && !(c in collapsed)) collapsed[c] = ko;
        var l = looseKey(en);
        if (l.length >= 3 && !(l in loose)) loose[l] = ko;
        var f = fpKey(en);
        if (f.length >= FP_MIN && !(f in fp)) fp[f] = ko;
    }

    // ── 검색용 역방향(한글->영문) ──
    var reverse = Object.create(null);
    for (var en2 in RAW) {
        var ko2 = RAW[en2];
        if (ko2 != null && !(ko2 in reverse)) reverse[ko2] = en2;
    }
    // 칩 텍스트(영문 또는 한글)를 받아 반대 언어 문자열 반환 (검색 양방향 매칭용)
    window.KO_SEARCH_ALT = function (text) {
        if (text == null) return null;
        var t = ("" + text).trim();
        if (!t) return null;
        if (exact[t] != null) return exact[t];       // 영문 -> 한글
        if (reverse[t] != null) return reverse[t];   // 한글 -> 영문
        return null;
    };

    function translateEvolution(s) {
        if (s === "Mega") return "메가진화";
        if (s === "Giga") return "거다이맥스";
        if (s === "Trade (0)") return "통신교환";
        if (s === "Friendship (0)") return "친밀도 진화";
        if (s === "Friendship Day (0)") return "친밀도 진화 (낮)";
        if (s === "Friendship Night (0)") return "친밀도 진화 (밤)";
        if (s === "Beauty (0)") return "아름다움 진화";
        if (s === "Critical Hit (0)") return "한 전투에서 급소 3회 명중";

        var m;
        if ((m = s.match(/^Level \((\d+)\)$/))) return "레벨 " + m[1];
        if ((m = s.match(/^Level Day \((\d+)\)$/))) return "레벨 " + m[1] + " (낮)";
        if ((m = s.match(/^Level Night \((\d+)\)$/))) return "레벨 " + m[1] + " (밤)";
        if ((m = s.match(/^Level Specific Time Range \((\d+)\)$/))) return "레벨 " + m[1] + " (해질녘)";
        if ((m = s.match(/^Level Hold Hisui Rock \((\d+)\)$/))) return "레벨 " + m[1] + " (히스이바위 소지)";
        if ((m = s.match(/^Level Atk Gt Def \((\d+)\)$/))) return "레벨 " + m[1] + " (공격 > 방어)";
        if ((m = s.match(/^Level Atk Eq Def \((\d+)\)$/))) return "레벨 " + m[1] + " (공격 = 방어)";
        if ((m = s.match(/^Level Atk Lt Def \((\d+)\)$/))) return "레벨 " + m[1] + " (공격 < 방어)";
        if ((m = s.match(/^Level Silcoon \((\d+)\)$/))) return "레벨 " + m[1] + " (실쿤)";
        if ((m = s.match(/^Level Cascoon \((\d+)\)$/))) return "레벨 " + m[1] + " (카스쿤)";
        if ((m = s.match(/^Level Ninjask \((\d+)\)$/))) return "레벨 " + m[1] + " (아이스크)";
        if ((m = s.match(/^Level Shedinja \((\d+)\)$/))) return "레벨 " + m[1] + " (껍질몬)";
        if ((m = s.match(/^Female Level \((\d+)\)$/))) return "암컷 레벨 " + m[1];
        if ((m = s.match(/^Male Level \((\d+)\)$/))) return "수컷 레벨 " + m[1];
        if ((m = s.match(/^Damage Location \((\d+)\)$/))) return "특정 장소 피해 " + m[1] + " 이상";
        if ((m = s.match(/^Nature High \((\d+)\)$/))) return "레벨 " + m[1] + " (외향적 성격)";
        if ((m = s.match(/^Nature Low \((\d+)\)$/))) return "레벨 " + m[1] + " (내향적 성격)";
        if ((m = s.match(/^Rainy Foggy Ow \((\d+)\)$/))) return "레벨 " + m[1] + " (비/안개 날씨)";
        if ((m = s.match(/^Type In Party \((\d+)\)$/))) return "레벨 " + m[1] + " (악타입 동행)";

        if ((m = s.match(/^Hold Item Day \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return item + " 지니고 레벨업 (낮)";
        }
        if ((m = s.match(/^Hold Item Night \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return item + " 지니고 레벨업 (밤)";
        }
        if ((m = s.match(/^Item \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return item + " 사용";
        }
        if ((m = s.match(/^Item Location \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return "특정 장소에서 " + item + " 사용";
        }
        if ((m = s.match(/^Item Night \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return "밤에 " + item + " 사용";
        }
        if ((m = s.match(/^Item Hold Hisui Rock \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return "히스이바위 지니고 " + item + " 사용";
        }
        if ((m = s.match(/^Trade Item \((.+)\)$/))) {
            var item = translate(m[1]) || m[1];
            return item + " 지니고 통신교환";
        }
        if ((m = s.match(/^Move \((.+)\)$/))) {
            var mv = translate(m[1]) || m[1];
            return mv + " 습득 후 레벨업";
        }
        if ((m = s.match(/^Move Female \((.+)\)$/))) {
            var mv = translate(m[1]) || m[1];
            return "암컷 + " + mv + " 습득";
        }
        if ((m = s.match(/^Move Male \((.+)\)$/))) {
            var mv = translate(m[1]) || m[1];
            return "수컷 + " + mv + " 습득";
        }
        if ((m = s.match(/^Move Type \((.+)\)$/))) {
            var tp = translate(m[1]) || m[1];
            return tp + "타입 기술 습득 후 레벨업";
        }
        if ((m = s.match(/^(?:Map|Level Up) \((?:Mapsec )?(.+)\)$/))) {
            var mp = translate(m[1]) || m[1];
            return mp + "에서 레벨업";
        }
        if ((m = s.match(/^Other Party Mon \((.+)\)$/))) {
            var mon = translate(m[1]) || m[1];
            return "파티에 " + mon + " 동행";
        }
        return null;
    }

    function translate(text) {
        if (text == null) return null;
        var s = "" + text;
        var trimmed = s.trim();
        if (!trimmed) return null;
        if (!/[A-Za-z]/.test(trimmed)) return null; // 영문자 없으면 후보 아님(이미 한글 등)
        if (exact[trimmed] != null) return exact[trimmed];
        var c = collapseKey(s);
        if (collapsed[c] != null) return collapsed[c];
        var l = looseKey(s);
        if (l.length >= 3 && loose[l] != null) return loose[l];
        var f = fpKey(s);
        if (f.length >= FP_MIN && fp[f] != null) return fp[f];

        // 동적 패턴: 소지품 출현 확률 ("50% Leftovers", "5% Oran Berry")
        var mItem = trimmed.match(/^(\d+%\s*)(.+)$/);
        if (mItem) {
            var itemKo = translate(mItem[2]);
            if (itemKo != null) return mItem[1] + itemKo;
        }

        // 동적 패턴: 진화 조건 태그 ("Level (16)", "Item (Thunder Stone)", "Friendship (0)" 등)
        var evo = translateEvolution(trimmed);
        if (evo != null) return evo;

        return null;
    }
    window.KO_TRANSLATE = translate;

    // ---------------- DOM 텍스트 노드 번역 ----------------
    var SKIP_TAGS = {
        SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1,
        SELECT: 1, OPTION: 1, NOSCRIPT: 1
    };

    // 필터 라벨 (검색 칩 "Move: X" / "Name: X" 형태)
    var FILTER_LABEL_KO = {
        "Name": "이름", "Move": "기술", "Type": "타입", "Ability": "특성",
        "Item": "도구", "Form": "폼", "Split": "분류", "Flag": "플래그",
        "Target": "타겟", "Egg Group": "알그룹", "Base Stats": "종족값", "Pocket": "주머니"
    };

    function processTextNode(node) {
        var parent = node.parentNode;
        if (!parent || SKIP_TAGS[parent.nodeName]) return;
        var val = node.nodeValue;
        if (!val) return;
        // "라벨: 값" 패턴 (검색 필터 칩)을 먼저 처리 (콜론 유지)
        var m = val.match(/^([A-Za-z][A-Za-z ]*?):[  ]?(.*)$/);
        if (m && FILTER_LABEL_KO[m[1]] != null) {
            var labelKo = FILTER_LABEL_KO[m[1]];
            var rest = m[2];
            if (rest === "") { node.nodeValue = labelKo + ": "; return; }
            var vk = translate(rest);
            node.nodeValue = labelKo + ": " + (vk != null ? vk : rest);
            return;
        }
        var ko = translate(val);
        if (ko != null && ko !== val) node.nodeValue = ko; // 한글은 재번역되지 않음
    }

    function walk(root) {
        if (!root) return;
        if (root.nodeType === 3) { processTextNode(root); return; }
        if (root.nodeType !== 1) return;
        if (SKIP_TAGS[root.nodeName]) return;
        var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        var batch = [], n;
        while ((n = tw.nextNode())) batch.push(n);
        for (var i = 0; i < batch.length; i++) processTextNode(batch[i]);
    }

    function sweepAll() {
        if (document.body) walk(document.body);
    }

    // ---------------- 변경 감시 (지연 렌더 대응) ----------------
    var scheduled = false;
    var pending = [];
    function flush() {
        scheduled = false;
        var items = pending; pending = [];
        for (var i = 0; i < items.length; i++) {
            var node = items[i];
            if (node.nodeType === 3) processTextNode(node);
            else walk(node);
        }
    }
    function schedule() {
        if (scheduled) return;
        scheduled = true;
        (window.requestAnimationFrame || window.setTimeout)(flush, 0);
    }

    var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (m.type === "characterData") {
                pending.push(m.target);
            } else if (m.type === "childList") {
                for (var j = 0; j < m.addedNodes.length; j++) pending.push(m.addedNodes[j]);
            }
        }
        if (pending.length) schedule();
    });

    function start() {
        observer.observe(document.documentElement, {
            childList: true, subtree: true, characterData: true
        });
        sweepAll();
    }

    if (document.documentElement) start();
    else document.addEventListener("DOMContentLoaded", start);

    // 외부 fetch 후 늦게 그려지는 표/패널 대비 보조 스윕
    window.addEventListener("load", sweepAll);
    setTimeout(sweepAll, 1500);
    setTimeout(sweepAll, 4000);
    setTimeout(sweepAll, 8000);

    console.log("[ko_translate] ready. entries:",
        Object.keys(exact).length, "collapsed:", Object.keys(collapsed).length,
        "fp:", Object.keys(fp).length);
})();
