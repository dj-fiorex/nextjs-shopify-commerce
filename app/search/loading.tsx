export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="aspect-[4/5] w-full animate-pulse bg-neutral-100"
          />
        ))}
    </div>
  );
}
