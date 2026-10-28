import Image from "next/image";
import { PlaceholderPhoto } from "@/components/placeholder-photo";

export function PropertyGallery({ photos, title }: { photos: string[]; title: string }) {
  if (photos.length === 0) {
    return <PlaceholderPhoto className="aspect-[4/3] w-full rounded-xl" />;
  }

  const [cover, ...rest] = photos;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden">
      <div className="col-span-4 sm:col-span-2 row-span-2 relative aspect-[4/3] sm:aspect-auto">
        <Image
          src={cover}
          alt={title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {rest.slice(0, 4).map((photo, i) => (
        <div key={photo} className="relative aspect-square hidden sm:block">
          <Image
            src={photo}
            alt={`${title} — foto ${i + 2}`}
            fill
            loading="lazy"
            sizes="25vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
