"use client";

type WheelPaginationProps = {
  totalPages: number;
  activePage: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
};

export function WheelPagination({ totalPages, activePage, onChange, ariaLabel = "เลือกหน้า" }: WheelPaginationProps) {
  function changeBy(offset: number) {
    if (totalPages < 2) return;
    onChange((activePage + offset + totalPages) % totalPages);
  }

  return <div className="wheel-pagination" role="group" aria-label={ariaLabel} onWheel={(event) => { event.preventDefault(); changeBy(event.deltaY > 0 ? 1 : -1); }}>
    <button type="button" className="wheel-arrow" aria-label="ก่อนหน้า" onClick={() => changeBy(-1)}>↑</button>
    <div className="wheel-pages">{Array.from({ length: totalPages }, (_, index) => <button type="button" key={index} className={index === activePage ? "wheel-page active" : "wheel-page"} aria-label={`หน้า ${index + 1}`} aria-current={index === activePage ? "true" : undefined} onClick={() => onChange(index)}><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div>
    <button type="button" className="wheel-arrow" aria-label="ถัดไป" onClick={() => changeBy(1)}>↓</button>
  </div>;
}
