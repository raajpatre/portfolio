import { ContactCard } from "@/components/public/ContactCard";

export const metadata = { title: "Send a Raven | Raaj Patre" };

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/contact-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
        aria-hidden="true"
      >
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,12,26,0.72) 0%, rgba(10,12,26,0.60) 40%, rgba(10,12,26,0.78) 100%)",
          }}
        />
      </div>

      <ContactCard />
    </div>
  );
}
