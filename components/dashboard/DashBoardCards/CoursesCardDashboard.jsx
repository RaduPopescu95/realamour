import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CoursesCardDashboard({ data }) {
  const router = useRouter();

  const handleCardClick = () => {
    console.log("User Data:", data); // Afișează toate datele utilizatorului în consola browserului
    router.push(`/informatii-utilizator?uid=${data.id}`); // Redirecționează la pagina dorită cu uid-ul utilizatorului
  };

  return (
    <div
      className="w-1/3 xl:w-1/2 lg:w-1/1 sm:w-1/1"
      onClick={handleCardClick} // Adaugă funcția de click
      style={{ padding: "10px", cursor: "pointer" }} // Adaugă cursorul pointer pentru indicarea clicului
    >
      <div className="relative">
        {data.images && data.images[0]?.fileUri ? (
          <>
            <div
              className="relative"
              style={{ width: "100%", height: "300px" }}
            >
              <Image
                src={data.images[0].fileUri}
                alt={data.username}
                fill
                className="rounded-8"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Overlay pentru nume */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Alb transparent
                padding: "5px 15px",
                borderRadius: "12px",
                display: "inline-block",
              }}
            >
              <h3 className="text-18 fw-600 lh-15">{data.username}</h3>
            </div>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: 400,
              backgroundColor: "#f2f2f2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>No Image</span>
          </div>
        )}
      </div>
    </div>
  );
}
