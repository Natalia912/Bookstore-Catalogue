import { BookCardSkeleton } from './book-card-skeleton';

const DEFAULT_SKELETON_COUNT = 12;

function BookGridSkeleton({ count = DEFAULT_SKELETON_COUNT }: { count?: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
      aria-busy="true"
      aria-label="Loading books"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <BookCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export { BookGridSkeleton };
