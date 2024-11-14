"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CourseCardTwoDash({ data }) {
  // Găsește imaginea principală (cu `isMain: true`)
  const mainImage =
    data.images.find((image) => image.isMain)?.fileUri ||
    data.images[0]?.fileUri ||
    "/default-image.jpg";

  return (
    <div className="col-xl-3">
      <Link
        href={`/client-compatibil?uid=${data.id}`}
        className="relative d-block rounded-8 px-10 py-10 border-light"
      >
        <div className="row x-gap-20 y-gap-20 items-center">
          <div className="col-md-auto">
            <div className="shrink-0">
              <Image
                width={550}
                height={420}
                className="w-1/1"
                src={mainImage} // Afișează imaginea principală
                alt="image"
              />
            </div>
          </div>
          <div className="col-md">
            <h3 className="text-17 lh-16 fw-500 mt-10 pr-40 xl:pr-0">
              {data.username || "Utilizator"}
            </h3>
            <p>{data.gender ? `Gen: ${data.gender}` : "Gen necunoscut"}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
