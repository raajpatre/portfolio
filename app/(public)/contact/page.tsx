import { ContactCard } from "@/components/public/ContactCard";

export const metadata = { title: "Contact | Raaj Patre" };

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center min-h-[70vh]">
      <ContactCard />
    </div>
  );
}
