"""FISAI MeetUP 과제Ⅰ — 안내서비스 카테고리 분리 및 집계.

사용법:
    python solution.py

입력 파일 ``안내서비스.csv``를 스크립트와 같은 폴더에 놓으면 됩니다.
출력 파일은 해당 폴더의 ``출력_카테고리별/`` 및
``결과_카테고리집계.csv``에 저장됩니다.

대표 문의기관 선정 방식:
    카테고리 내에서 가장 자주 나타난 '문의기관'을 선택합니다.
    최다 빈도가 같은 기관이 여럿이면 원본에 먼저 등장한 기관을 선택합니다.
"""

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
INPUT_FILE = BASE_DIR / "안내서비스.csv"
OUTPUT_DIR = BASE_DIR / "출력_카테고리별"
SUMMARY_FILE = BASE_DIR / "결과_카테고리집계.csv"
WEB_DATA_FILE = BASE_DIR / "docs" / "assets" / "data.js"
REQUIRED_COLUMNS = ("카테고리", "문의기관")


def read_services(path: Path):
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        fieldnames = reader.fieldnames
        if not fieldnames:
            raise ValueError("입력 CSV의 헤더가 비어 있습니다.")
        missing = [name for name in REQUIRED_COLUMNS if name not in fieldnames]
        if missing:
            raise ValueError(f"입력 CSV에 필수 열이 없습니다: {', '.join(missing)}")
        rows = list(reader)
    for line_number, row in enumerate(rows, start=2):
        if not (row.get("카테고리") or "").strip():
            raise ValueError(f"{line_number}행: 카테고리가 비어 있습니다.")
    return fieldnames, rows


def write_csv(path: Path, fieldnames, rows):
    # utf-8-sig: Windows Excel에서도 한글이 깨지지 않도록 BOM 포함.
    with path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def representative_agency(rows):
    agencies = [str(row.get("문의기관") or "").strip() for row in rows]
    agencies = [agency for agency in agencies if agency]
    if not agencies:
        return "미기재"
    counts = Counter(agencies)
    return max(counts, key=counts.get)


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"입력 파일을 찾을 수 없습니다: {INPUT_FILE}\n"
            "'안내서비스.csv'를 solution.py와 같은 폴더에 저장해 주세요."
        )

    fieldnames, rows = read_services(INPUT_FILE)
    groups = defaultdict(list)
    for row in rows:
        category = row["카테고리"].strip()
        # 파일명으로 쓸 수 없는 경로 구분자·예약 문자는 허용하지 않음.
        if any(c in category for c in '\\/:*?"<>|') or category in {".", ".."}:
            raise ValueError(f"파일명으로 사용할 수 없는 카테고리: {category!r}")
        groups[category].append(row)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    summary_rows = []
    print(f"[OK] 안내서비스 {len(rows)}건 카테고리별 분리 → {OUTPUT_DIR.name}/")
    for category, category_rows in groups.items():
        write_csv(OUTPUT_DIR / f"{category}.csv", fieldnames, category_rows)
        agency = representative_agency(category_rows)
        summary_rows.append({
            "카테고리": category,
            "건수": len(category_rows),
            "대표 문의기관": agency,
        })
        print(f"  · {category} {len(category_rows)}건 (대표 문의기관: {agency})")

    write_csv(SUMMARY_FILE, ["카테고리", "건수", "대표 문의기관"], summary_rows)
    print(f"[OK] 집계표 → {SUMMARY_FILE.name}")

    # 정적 웹에서도 로컬 파일을 더블클릭해 바로 동작하도록 JS 데이터 파일 생성.
    # JSON을 외부 데이터 파일 형태로 만들기 때문에 별도의 서버나 라이브러리는 불필요.
    WEB_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    data = {"services": rows, "summary": summary_rows}
    WEB_DATA_FILE.write_text(
        "window.FISAI_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"[OK] 웹페이지 데이터 → {WEB_DATA_FILE.relative_to(BASE_DIR)}")
    print(f"[검증] 카테고리 {len(groups)}개, 총 {sum(r['건수'] for r in summary_rows)}건")


if __name__ == "__main__":
    main()
