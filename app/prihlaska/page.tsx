import PageHero from "@/components/ui/PageHero";
import RegistrationForm from "@/components/prihlaska/RegistrationForm";

export const metadata = {
  title: "Přihláška do mládeže | SK Slovan Kunratice",
};

export default function PrihlaskaPage() {
  return (
    <main>
      <PageHero
        title="Přihlaste své dítě"
        subtitle="Začněte fotbalovou cestu vašeho dítěte v SK Slovan Kunratice"
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <RegistrationForm />
      </div>
    </main>
  );
}
