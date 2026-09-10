export default function Loading() {
  return (
    <div className="public-loading" role="status" aria-label="Loading SciLoop">
      <div className="public-loading-inner">
        <div className="public-loading-brand">SciLoop</div>
        <div className="public-loading-line public-loading-line-wide" />
        <div className="public-loading-line public-loading-line-short" />
        <div className="public-loading-card" />
      </div>
    </div>
  );
}
