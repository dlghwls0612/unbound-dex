// dex UI / 게임 공통 용어 (정식 한글). ko_dict 에 병합.
Object.assign(window.KO_DICT, {
  // ── 탭 / 버튼 ──
  "Species":"포켓몬", "Moves":"기술", "Abilities":"특성", "Locations":"출현장소",
  "Trainers":"트레이너", "Items":"도구", "Info":"정보", "Settings":"설정",
  "Credits":"제작진", "Update":"업데이트", "Changelog":"변경내역", "Changed":"변경됨",
  "Strategy":"전략", "Hide":"숨기기", "Hide Crossed":"지운 항목 숨기기",
  "Hide Empty":"빈 항목 숨기기", "Reset":"초기화", "Show Community Sets":"커뮤니티 세트 보기",
  "Defensive":"방어 상성", "Offensive":"공격 상성", "FILTER":"필터", "Filter":"필터",
  "Random":"랜덤", "Randomize":"랜덤화", "Search":"검색",

  // ── Form 필터 ──
  "Mega":"메가", "Alolan":"알로라", "Galarian":"가라르", "Hisuian":"히스이",

  // ── 표 헤더 ──
  "Name":"이름", "Type":"타입", "Types":"타입", "Split":"분류", "Power":"위력",
  "Acc":"명중", "Accuracy":"명중률", "PP":"PP", "Effect":"효과", "ID":"번호",
  "Sprite":"스프라이트", "Innates":"이너츠", "BST":"종족값", "Description":"설명",
  "Level":"레벨", "Atk":"공격", "Def":"방어", "SpA":"특수공격", "SpD":"특수방어", "Spe":"스피드",

  // ── 스탯 (전체명) ──
  "Attack":"공격", "Defense":"방어", "Speed":"스피드", "Sp. Atk":"특수공격", "Sp. Def":"특수방어",
  "Special Attack":"특수공격", "Special Defense":"특수방어", "Ability":"특성",

  // ── 분류 (물리/특수/변화) ──
  "Physical":"물리", "Special":"특수", "Status":"변화",

  // ── 타입 (dex 표시형 전체명; DB엔 축약형만 있어 누락됨) ──
  "Normal":"노말", "Fire":"불꽃", "Water":"물", "Grass":"풀", "Electric":"전기",
  "Ice":"얼음", "Fighting":"격투", "Fight":"격투", "Poison":"독", "Ground":"땅",
  "Flying":"비행", "Psychic":"에스퍼", "Bug":"벌레", "Rock":"바위", "Ghost":"고스트",
  "Dragon":"드래곤", "Dark":"악", "Steel":"강철", "Fairy":"페어리",

  // ── 학습 방식 / 섹션 ──
  "Level Up":"레벨업", "Level Up Moves":"레벨업 기술", "TM":"기술머신", "HM":"비전머신",
  "TMHM":"기술머신", "Tutor":"기술가르침", "Egg Moves":"유전기", "Egg":"알",
  "Egg Move":"유전기", "Move Tutor":"기술가르침",

  // ── 출현 방식 (Locations) ── (타입명과 겹치는 Grass/Water/Rock 은 타입 우선이라 제외)
  "Land":"지상", "Surf":"파도타기", "Old Rod":"낡은 낚싯대",
  "Good Rod":"좋은 낚싯대", "Super Rod":"굉장한 낚싯대", "Rock Smash":"바위 부수기",
  "Headbutt":"박치기", "Fishing":"낚시", "Hidden":"숨겨진 포켓몬",
  "Raid":"레이드", "Raids":"레이드", "Swarm":"대량발생", "Hordes":"무리",
  "Rod":"낚싯대", "Trees":"나무",

  // ── 시간대 ──
  "Anytime":"항상", "Morning":"아침", "Day":"낮", "Night":"밤",
  "Evening":"저녁", "Dusk":"해질녘", "Dawn":"새벽",

  // ── 기술 타겟 ──
  "Selected":"선택한 대상", "User":"자신", "Both":"양쪽 상대", "All":"전체",
  "Depends":"상황에 따라", "Opponents Field":"상대 필드", "Foes And Ally":"자신 외 전체",
  "User Or Partner":"자신 또는 파트너", "Random":"무작위", "Ally":"우리 편", "Field":"필드",

  // ── 기술 플래그 ──
  "Makes Contact":"직접 접촉", "Protect Affected":"방어로 막힘",
  "Magic Coat Affected":"매직코트에 반사됨", "Mirror Move Affected":"미러무브로 복사됨",
  "Snatch Affected":"가로채기 대상", "Triage Affected":"우선도 회복기",

  // ── 웹도감 전수조사 보강: 특성 설명문 ──
  "Prevents ability reduction.": "상대에 의해 능력치가 떨어지지 않는다.",
  "“Super effective” hits.": "\"효과가 굉장한\" 공격을 받는다.",
  "\"Super effective\" hits.": "\"효과가 굉장한\" 공격을 받는다.",
  "Boosts \"not very effective\" moves.": "\"효과가 별로인\" 기술의 위력을 올린다.",
  'Boosts "not very effective\\" moves.': "\"효과가 별로인\" 기술의 위력을 올린다.",
  "Nullifies all water to up Sp. Atk.": "모든 물을 무효화해 특수공격을 올린다.",
  "Drill moves land critical hits.": "드릴 기술이 급소에 맞는다.",
  "Grass-type moves hit first.": "풀타입 기술을 선공으로 쓴다.",
  "Tail moves hit first.": "꼬리 기술을 선공으로 쓴다.",

  // ── 웹도감 전수조사 보강: 특성명 ──
  "ASONE GRIM": "혼연일체 (흑마)", "Asone Grim": "혼연일체 (흑마)",
  "ASONE CHILLING": "혼연일체 (백마)", "Asone Chilling": "혼연일체 (백마)",
  "Cacophony": "소음", "BELOW": "포효", "Below": "포효",
  "Neutralizinggas": "화학변화가스", "NEUTRALIZINGGAS": "화학변화가스",
  "DRILL BEAK": "드릴부리", "GRASS DASH": "풀질주", "SLIPPERY TAIL": "미끄럼꼬리",

  // ── 웹도감 전수조사 보강: 타입명 및 상성/기술표 축약어 ──
  "Fighti": "격투", "Psychi": "에스퍼",
  "Nor": "노말", "Fir": "불꽃", "Wat": "물", "Gra": "풀", "Ele": "전기",
  "Fig": "격투", "Poi": "독", "Gro": "땅", "Fly": "비행", "Psy": "에스퍼",
  "Bug": "벌레", "Roc": "바위", "Gho": "고스트", "Dra": "드래곤", "Dar": "악",
  "Ste": "강철", "Fai": "페어리",

  // ── 웹도감 전수조사 보강: 포켓몬 이름 ──
  "Fletchinder": "불화살빈", "Crabominable": "모단단게", "Blacephalon": "두파팡",
  "Corvisquire": "파크로우", "Corviknight": "아머까오", "Barraskewda": "꼬치조",
  "Centiskorch": "다태우지네", "Polteageist": "포트데스", "Stonjourner": "돌헨진",
  "Shadow Warrior": "그림자 전사",

  // ── 웹도감 전수조사 보강: 기술명 (복합어/띄어쓰기 누락 대응) ──
  "Payday": "돈뿌리기", "Pay Day": "돈뿌리기",
  "Vicegrip": "찝기", "Vice Grip": "찝기",
  "Icebeam": "냉동빔", "Ice Beam": "냉동빔",
  "Lowkick": "안다리걸기", "Low Kick": "안다리걸기",
  "Eggbomb": "알폭탄", "Egg Bomb": "알폭탄",
  "Mudslap": "진흙뿌리기", "Mud-Slap": "진흙뿌리기",
  "Icywind": "얼어붙은바람", "Icy Wind": "얼어붙은바람",
  "Lockon": "록온", "Lock-On": "록온",
  "Psychup": "자기암시", "Psych Up": "자기암시",
  "Grassyterrain": "그래스필드", "Grassy Terrain": "그래스필드",
  "Mistyterrain": "미스트필드", "Misty Terrain": "미스트필드",
  "Psychicterrain": "사이코필드", "Psychic Terrain": "사이코필드",
  "Craftyshield": "트릭가드", "Crafty Shield": "트릭가드",
  "Aromaticmist": "아로마미스트", "Aromatic Mist": "아로마미스트",
  "Magneticflux": "자기장조작", "Magnetic Flux": "자기장조작",
  "Trickortreat": "핼러윈", "Trick-or-Treat": "핼러윈",
  "Forestscurse": "숲의저주", "Forest's Curse": "숲의저주",
  "Lightofruin": "파멸의빛", "Light of Ruin": "파멸의빛",
  "Doubleironbash": "더블철판", "Double Iron Bash": "더블철판",
  "Skydrop": "프리폴", "Sky Drop": "프리폴",
  "Dynamaxcannon": "다이맥스포", "Dynamax Cannon": "다이맥스포",
  "Jawlock": "물고버티기", "Jaw Lock": "물고버티기",
  "Tarshot": "타르샷", "Tar Shot": "타르샷",
  "Clangoroussoul": "소울비트", "Clangorous Soul": "소울비트",
  "Behemothblade": "거수인", "Behemoth Blade": "거수인",
  "Behemothbash": "거수탄", "Behemoth Bash": "거수탄",
  "Breakingswipe": "와이드브레이커", "Breaking Swipe": "와이드브레이커",
  "Strangesteam": "원더스팀", "Strange Steam": "원더스팀",
  "Lifedew": "생명의물방울", "Life Dew": "생명의물방울",
  "Falsesurrender": "거짓항복", "False Surrender": "거짓항복",
  "Meteorassault": "스타어설트", "Meteor Assault": "스타어설트",
  "Expandingforce": "와이드포스", "Expanding Force": "와이드포스",
  "Mistyexplosion": "미스트폭발", "Misty Explosion": "미스트폭발",
  "Risingvoltage": "라이징볼트", "Rising Voltage": "라이징볼트",
  "Burningjealousy": "질투의불꽃", "Burning Jealousy": "질투의불꽃",
  "Lashout": "분풀이", "Lash Out": "분풀이",
  "Corrosivegas": "부식가스", "Corrosive Gas": "부식가스",
  "Scorchingsands": "열사의대지", "Scorching Sands": "열사의대지",
  "Junglehealing": "정글의치유", "Jungle Healing": "정글의치유",
  "Surgingstrikes": "수류연타", "Surging Strikes": "수류연타",
  "Freezingglare": "얼어붙는시선", "Freezing Glare": "얼어붙는시선",
  "Thunderouskick": "천둥차기", "Thunderous Kick": "천둥차기",
  "Astralbarrage": "아스트랄비트", "Astral Barrage": "아스트랄비트",
  "Psyshieldbash": "배리어러시", "Psyshield Bash": "배리어러시",
  "Mysticalpower": "신비의힘", "Mystical Power": "신비의힘",
  "Infernalparade": "백귀야행", "Infernal Parade": "백귀야행",
  "Ceaselessedge": "비검천중파", "Ceaseless Edge": "비검천중파",
  "Bleakwindstorm": "찬바람폭풍", "Bleakwind Storm": "찬바람폭풍",
  "Wildboltstorm": "번개폭풍", "Wildbolt Storm": "번개폭풍",
  "Sandsearstorm": "열사의폭풍", "Sandsear Storm": "열사의폭풍",
  "Springtidestorm": "봄바람폭풍", "Springtide Storm": "봄바람폭풍",
  "Lunarblessing": "초승달의기도", "Lunar Blessing": "초승달의기도",
  "Beatup": "집단구타", "Beat Up": "집단구타",
  "Fakeout": "속이기", "Fake Out": "속이기",
  "Spitup": "토해내기", "Spit Up": "토해내기",
  "Iceball": "아이스볼", "Ice Ball": "아이스볼",
  "Bulkup": "벌크업", "Bulk Up": "벌크업",
  "Mudshot": "머드숏", "Mud Shot": "머드숏",
  "Aquajet": "아쿠아제트", "Aqua Jet": "아쿠아제트",
  "Bugbuzz": "벌레의야단법석", "Bug Buzz": "벌레의야단법석",
  "Mudbomb": "진흙폭탄", "Mud Bomb": "진흙폭탄",
  "Workup": "분발", "Work Up": "분발",
  "Icefang": "얼음엄니", "Ice Fang": "얼음엄니",
  "Uturn": "유턴", "U-turn": "유턴",
  "Bugbite": "벌레먹기", "Bug Bite": "벌레먹기",
  "Steelyhit": "메탈배시", "Steely Hit": "메탈배시", "Metal Bash": "메탈배시",
  "Mefirst": "선취", "Me First": "선취",
  "Iceburn": "콜드플레어", "Ice Burn": "콜드플레어",
  "Vcreate": "V제너레이트", "V-create": "V제너레이트",
  "Burnup": "불사르기", "Burn Up": "불사르기",
  "Gearup": "어시스트기어", "Gear Up": "어시스트기어",
  "Shoreup": "모래모으기", "Shore Up": "모래모으기",
  "Zingzap": "찌릿찌릿따끔따끔", "Zing Zap": "찌릿찌릿따끔따끔",

  // ── 전용 Z기술 ──
  "Catastropika": "필살피카슛",
  "10000000 Volt Thunderbolt": "1000만볼트",
  "Stoked Sparksurfer": "라이트닝서프라이드",
  "Extreme Evoboost": "나인이볼부스트",
  "Pulverizing Pancake": "진심의공격",
  "Genesis Supernova": "오리진즈슈퍼노바",
  "Sinister Arrow Raid": "섀도우애리즈스트라이크",
  "Malicious Moonsault": "하이퍼다크크러셔",
  "Oceanic Operetta": "바다의심포니",
  "Splintered Stormshards": "레이디얼에지스톰",
  "Lets Snuggle Forever": "투닥투닥프렌드타임",
  "Clangorous Soulblaze": "브레이징소울비트",
  "Guardian Of Alola": "알로라의수호자", "Guardian of Alola": "알로라의수호자",
  "Searing Sunraze Smash": "선샤인스매시",
  "Menacing Moonraze Maelstrom": "문라이트메일스트롬",
  "Light That Burns The Sky": "하늘을태우는멸망의빛", "Light That Burns the Sky": "하늘을태우는멸망의빛",
  "Soul Stealing 7 Star Strike": "칠성탈혼퇴", "Soul-Stealing 7-Star Strike": "칠성탈혼퇴",

  // ── Z기술 물리/특수 분기 ──
  "Breakneck Blitz P": "울트라대시어택 (물리)", "Breakneck Blitz S": "울트라대시어택 (특수)",
  "All Out Pummeling P": "전력무쌍격 (물리)", "All Out Pummeling S": "전력무쌍격 (특수)",
  "Supersonic Skystrike P": "파이널다이브클래시 (물리)", "Supersonic Skystrike S": "파이널다이브클래시 (특수)",
  "Acid Downpour P": "애시드포이즌델루지 (물리)", "Acid Downpour S": "애시드포이즌델루지 (특수)",
  "Tectonic Rage P": "라이징랜드오버 (물리)", "Tectonic Rage S": "라이징랜드오버 (특수)",
  "Continental Crush P": "월드엔드폴 (물리)", "Continental Crush S": "월드엔드폴 (특수)",
  "Savage Spin Out P": "절대포식회전일격 (물리)", "Savage Spin Out S": "절대포식회전일격 (특수)",
  "Never Ending Nightmare P": "무한암야로의유인 (물리)", "Never Ending Nightmare S": "무한암야로의유인 (특수)",
  "Corkscrew Crash P": "초절나선연격 (물리)", "Corkscrew Crash S": "초절나선연격 (특수)",
  "Inferno Overdrive P": "다이내믹풀플레임 (물리)", "Inferno Overdrive S": "다이내믹풀플레임 (특수)",
  "Hydro Vortex P": "슈퍼아쿠아토네이도 (물리)", "Hydro Vortex S": "슈퍼아쿠아토네이도 (특수)",
  "Bloom Doom P": "블룸샤인엑스트라 (물리)", "Bloom Doom S": "블룸샤인엑스트라 (특수)",
  "Gigavolt Havoc P": "스파킹기가볼트 (물리)", "Gigavolt Havoc S": "스파킹기가볼트 (특수)",
  "Shattered Psyche P": "맥시멈사이브레이커 (물리)", "Shattered Psyche S": "맥시멈사이브레이커 (특수)",
  "Subzero Slammer P": "레이징지오프리즈 (물리)", "Subzero Slammer S": "레이징지오프리즈 (특수)",
  "Devastating Drake P": "얼티메이트드래곤번 (물리)", "Devastating Drake S": "얼티메이트드래곤번 (특수)",
  "Black Hole Eclipse P": "블랙홀이클립스 (물리)", "Black Hole Eclipse S": "블랙홀이클립스 (특수)",
  "Twinkle Tackle P": "러블리스타임팩트 (물리)", "Twinkle Tackle S": "러블리스타임팩트 (특수)",

  // ── 거다이맥스 기술 물리/특수 분기 ──
  "G Max Volt Crash P": "거다이만뢰", "G Max Volt Crash S": "거다이만뢰",
  "G Max Gold Rush P": "거다이금화", "G Max Gold Rush S": "거다이금화",
  "G Max Chi Strike P": "거다이회심격", "G Max Chi Strike S": "거다이회심격",
  "G Max Foam Burst P": "거다이포말", "G Max Foam Burst S": "거다이포말",
  "G Max Wind Rage P": "거다이풍격", "G Max Wind Rage S": "거다이풍격",
  "G Max Stun Shock P": "거다이감전", "G Max Stun Shock S": "거다이감전",

  // ── 정적 HTML 및 테이블 헤더 ──
  "Unbound Dex": "언바운드 도감",
  "Misc:": "기타:", "Misc": "기타",
  "Changes:": "변경사항:", "Changes": "변경사항",
  "Formes:": "폼:", "Formes": "폼",
  "Level Up From Previous Evolution": "진화 전 레벨업 기술",
  "TM/HM": "기술머신/비전머신",
  "HP": "HP", "HP:": "HP:",

  // ── 설정창 (Settings Popup) ──
  "Species Panel": "포켓몬 정보창",
  "Hide History": "열람 기록 숨기기", "Sticky History": "열람 기록 고정",
  "Hide Level Up From Previous Evolution": "진화 전 레벨업 기술 숨기기",
  "Hide Level Up": "레벨업 기술 숨기기", "Hide TM/HM": "기술머신 숨기기",
  "Hide Tutor": "기술가르침 숨기기", "Hide Egg Moves": "유전기 숨기기",

  // ── 알 그룹 및 도구 헤더 (Species Panel Info Popup) ──
  "Egg Groups:": "알 그룹:", "Held Items:": "지닌물건:",
  "Monster": "괴수", "Water 1": "수중1", "Water 2": "수중2", "Water 3": "수중3",
  "Field": "육상", "Human Like": "인간형", "Human-Like": "인간형",
  "Mineral": "광물", "Amorphous": "부정형", "Undiscovered": "미발견",

  // ── 서식지 및 조우 방식 ──
  "Surfing": "파도타기",
  "Thundercap Mountain": "썬더캡산",
  "Rov Post Game Aklove": "보이드유적 아클로브 (엔딩 후)",
  "Rov Post Game Aklove Anytime": "보이드유적 아클로브 (엔딩 후)",
  "Rov Post Game Aklove Morning": "보이드유적 아클로브 (엔딩 후) 아침",
  "Rov Post Game Aklove Day": "보이드유적 아클로브 (엔딩 후) 낮",
  "Rov Post Game Aklove Night": "보이드유적 아클로브 (엔딩 후) 밤",
  "Rov Post Game Aklove Evening": "보이드유적 아클로브 (엔딩 후) 저녁",
  "Rov Post Game Aklove Dusk": "보이드유적 아클로브 (엔딩 후) 해질녘",
  "Rov Post Game Aklove Dawn": "보이드유적 아클로브 (엔딩 후) 새벽",

  // ── 진화 도구 ──
  "Whipped Dream": "휘핑팝"
});

