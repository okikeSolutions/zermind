import { sx } from "@/styles/sx";
interface InfoSectionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  content: (string | React.ReactNode)[];
}

function InfoSection({ icon: Icon, title, content }: Readonly<InfoSectionProps>) {
  return (
    <div {...sx("flex space-x-4")}>
      <div {...sx("shrink-0")}>
        <Icon {...sx("h-6 w-6 text-primary")} />
      </div>
      <div>
        <h2 {...sx("text-lg font-medium text-primary")}>{title}</h2>
        <ul {...sx("mt-2 text-sm text-primary")}>
          {content.map((item, index) => (
            <li {...sx("list-disc")} key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InfoSection;
